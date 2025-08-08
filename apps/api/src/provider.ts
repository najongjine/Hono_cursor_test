import { InferenceResponse, Prediction } from '@pkg/shared';
import { loadEnv } from './env';
import { randomUUID } from 'node:crypto';

export type ProviderInput = {
  image: Blob; // from multipart
  modelId: string;
};

export type Provider = (input: ProviderInput) => Promise<InferenceResponse>;

const env = loadEnv();

export const roboflowProvider: Provider = async ({ image, modelId }) => {
  const apiKey = env.ROBFLOW_API_KEY;
  if (!apiKey) {
    throw new Error('Roboflow API key not configured');
  }
  const endpoint = `https://detect.roboflow.com/${encodeURIComponent(modelId)}?api_key=${encodeURIComponent(apiKey)}&format=json`;
  const started = Date.now();
  const res = await fetch(endpoint, {
    method: 'POST',
    body: image,
    // Roboflow expects application/x-www-form-urlencoded or binary. Sending raw binary works.
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
  const timeMs = Date.now() - started;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roboflow error ${res.status}: ${text}`);
  }
  const data = await res.json() as any;
  // Normalize response
  const width = data.image?.width ?? data.width ?? 0;
  const height = data.image?.height ?? data.height ?? 0;
  const predictions: Prediction[] = (data.predictions ?? []).map((p: any) => ({
    id: p.class_id?.toString?.() ?? randomUUID(),
    label: p.class ?? p.label ?? 'unknown',
    confidence: typeof p.confidence === 'number' ? p.confidence : (typeof p.score === 'number' ? p.score : 0),
    box: {
      x: p.x ?? (p.bbox?.x ?? 0),
      y: p.y ?? (p.bbox?.y ?? 0),
      width: p.width ?? (p.bbox?.width ?? 0),
      height: p.height ?? (p.bbox?.height ?? 0),
    },
  }));

  const response: InferenceResponse = {
    modelId,
    timeMs,
    image: { width, height },
    predictions,
    provider: 'roboflow',
  };
  return response;
};

export const mockProvider: Provider = async ({ image, modelId }) => {
  // Read image to get size using a lightweight approach: rely on client-provided size if available is not possible here.
  // For mock, we assume a 1024x768 image and make deterministic predictions based on modelId hash.
  const defaultWidth = 1024;
  const defaultHeight = 768;
  const seed = Array.from(modelId).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rng = (n: number) => ((seed * 9301 + 49297) % 233280) / 233280 * n;

  const preds: Prediction[] = [
    {
      id: randomUUID(),
      label: 'leaf-spot',
      confidence: 0.82,
      box: { x: 300 + rng(50), y: 250 + rng(40), width: 180, height: 140 },
    },
    {
      id: randomUUID(),
      label: 'healthy',
      confidence: 0.61,
      box: { x: 700 - rng(60), y: 500 - rng(50), width: 200, height: 160 },
    },
  ];

  const response: InferenceResponse = {
    modelId,
    timeMs: 30 + Math.round(rng(20)),
    image: { width: defaultWidth, height: defaultHeight },
    predictions: preds,
    provider: 'mock',
  };
  return response;
};

export const pickProvider = (): Provider => {
  return env.mockMode ? mockProvider : roboflowProvider;
};