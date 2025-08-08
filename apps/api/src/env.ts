import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('8787'),
  ROBFLOW_API_KEY: z.string().optional(),
  DEFAULT_MODEL_ID: z.string().default('plant-diseases/1'),
  CORS_ORIGIN: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema> & { mockMode: boolean };

export const loadEnv = (): Env => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables', parsed.error.flatten());
    throw new Error('Invalid environment variables');
  }
  const env = parsed.data;
  return { ...env, mockMode: !env.ROBFLOW_API_KEY } as Env;
};