import { z } from 'zod';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Validates and parses all environment variables required by the API.
 * Throws on startup if any required variable is missing or malformed.
 */
const apiEnvSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().min(1000).max(65535).default(3000),
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('api'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  // AI Providers
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  NVIDIA_API_KEY: z.string().optional(),
  DEFAULT_AI_PROVIDER: z.enum(['openai', 'anthropic', 'nvidia', 'mock']).default('nvidia'),
  DEFAULT_MODEL: z.string().default('meta/llama-3.1-8b-instruct'),
  DEFAULT_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  DEFAULT_EMBEDDING_DIMENSIONS: z.coerce.number().default(1536),

  // Rate Limiting
  RATE_LIMIT_TTL: z.coerce.number().default(60),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Observability
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SENTRY_DSN: z.string().optional(),

  // File Storage
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(50),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

let _apiEnv: ApiEnv | null = null;

export function getApiEnv(): ApiEnv {
  if (!_apiEnv) {
    // Safely try to load environment files from monorepo root or package dir
    const pathsToTry = [
      join(process.cwd(), '.env'),
      join(process.cwd(), '../../.env'),
      join(process.cwd(), 'apps/api/.env'),
    ];

    for (const p of pathsToTry) {
      if (existsSync(p)) {
        try {
          if (typeof process.loadEnvFile === 'function') {
            process.loadEnvFile(p);
          }
        } catch (e) {
          // Ignore if it fails to load or parse
        }
      }
    }

    const result = apiEnvSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
      process.exit(1);
    }
    _apiEnv = result.data;
  }
  return _apiEnv;
}
