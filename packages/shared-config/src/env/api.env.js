"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiEnv = getApiEnv;
const zod_1 = require("zod");
/**
 * Validates and parses all environment variables required by the API.
 * Throws on startup if any required variable is missing or malformed.
 */
const apiEnvSchema = zod_1.z.object({
    // App
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    API_PORT: zod_1.z.coerce.number().min(1000).max(65535).default(3000),
    API_VERSION: zod_1.z.string().default('v1'),
    API_PREFIX: zod_1.z.string().default('api'),
    CORS_ORIGINS: zod_1.z.string().default('http://localhost:5173'),
    // Database
    DATABASE_URL: zod_1.z.string().url(),
    // Redis
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    // Auth
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRY: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(32),
    REFRESH_TOKEN_EXPIRY: zod_1.z.string().default('7d'),
    // AI Providers
    OPENAI_API_KEY: zod_1.z.string().optional(),
    ANTHROPIC_API_KEY: zod_1.z.string().optional(),
    DEFAULT_AI_PROVIDER: zod_1.z.enum(['openai', 'anthropic', 'mock']).default('mock'),
    DEFAULT_MODEL: zod_1.z.string().default('gpt-4o'),
    DEFAULT_EMBEDDING_MODEL: zod_1.z.string().default('text-embedding-3-small'),
    DEFAULT_EMBEDDING_DIMENSIONS: zod_1.z.coerce.number().default(1536),
    // Rate Limiting
    RATE_LIMIT_TTL: zod_1.z.coerce.number().default(60),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(100),
    // Observability
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    SENTRY_DSN: zod_1.z.string().optional(),
    // File Storage
    UPLOAD_DIR: zod_1.z.string().default('./uploads'),
    MAX_FILE_SIZE_MB: zod_1.z.coerce.number().default(50),
});
let _apiEnv = null;
function getApiEnv() {
    if (!_apiEnv) {
        const result = apiEnvSchema.safeParse(process.env);
        if (!result.success) {
            console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
            process.exit(1);
        }
        _apiEnv = result.data;
    }
    return _apiEnv;
}
//# sourceMappingURL=api.env.js.map