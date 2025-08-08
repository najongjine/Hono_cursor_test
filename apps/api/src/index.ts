import { Hono } from 'hono';
import { cors } from 'hono/cors';
import helmet from 'helmet';
import { loadEnv } from './env';
import { pickProvider } from './provider';
import pino from 'pino';
import { ServerExposeConfig } from '@pkg/shared';

const env = loadEnv();
const logger = pino({ level: env.NODE_ENV === 'production' ? 'info' : 'debug' });

const app = new Hono();

// CORS
app.use('*', cors({ origin: env.CORS_ORIGIN ?? '*', credentials: false }));

// Helmet (adapting to fetch API via headers)
app.use('*', async (c, next) => {
  const res = await next();
  const helmetHeaders = helmet({
    contentSecurityPolicy: false,
  });
  // Helmet for Express returns a middleware; we emulate minimal headers here
  c.header('X-DNS-Prefetch-Control', 'off');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Download-Options', 'noopen');
  c.header('X-Permitted-Cross-Domain-Policies', 'none');
  c.header('Referrer-Policy', 'no-referrer');
  return res;
});

// Simple in-memory rate limiter per IP
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const ipHits = new Map<string, { count: number; first: number }>();

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || now - rec.first > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, first: now });
  } else {
    rec.count += 1;
    if (rec.count > RATE_LIMIT_MAX) {
      return c.json({ error: 'Too many requests' }, 429);
    }
  }
  return next();
});

app.get('/health', (c) => c.text('ok'));

app.get('/v1/config/expose', (c) => {
  const data: ServerExposeConfig = {
    defaultModelId: env.DEFAULT_MODEL_ID,
    mockMode: env.mockMode,
  };
  return c.json(data);
});

app.post('/v1/infer', async (c) => {
  // Expect multipart form-data with field 'image' (file) and optional 'modelId'
  const contentType = c.req.header('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return c.json({ error: 'content-type must be multipart/form-data' }, 400);
  }

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch (err) {
    logger.error({ err }, 'Failed to parse multipart');
    return c.json({ error: 'invalid multipart form' }, 400);
  }

  const file = form.get('image');
  if (!(file instanceof File)) {
    return c.json({ error: "field 'image' is required" }, 400);
  }

  const modelId = (form.get('modelId') as string | null) ?? env.DEFAULT_MODEL_ID;

  const start = Date.now();
  try {
    const provider = pickProvider();
    const result = await provider({ image: file, modelId });
    logger.info({ modelId, provider: result.provider, timeMs: result.timeMs, numPredictions: result.predictions.length }, 'inference done');
    return c.json(result);
  } catch (err: any) {
    logger.error({ err: String(err), modelId }, 'inference failed');
    return c.json({ error: 'inference failed' }, 500);
  } finally {
    const elapsed = Date.now() - start;
    if (elapsed > 5000) {
      logger.warn({ elapsed }, 'slow request');
    }
  }
});

const port = Number(env.PORT);

export default {
  port,
  fetch: app.fetch,
};

if (process.env.NODE_ENV !== 'production') {
  // Start standalone server in dev
  const { serve } = await import('@hono/node-server');
  serve({ fetch: app.fetch, port }, (addr) => {
    logger.info(`API listening on http://localhost:${port}`);
  });
}