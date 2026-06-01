import { z } from 'zod';
/**
 * Validates and parses all environment variables required by the API.
 * Throws on startup if any required variable is missing or malformed.
 */
declare const apiEnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    API_PORT: z.ZodDefault<z.ZodNumber>;
    API_VERSION: z.ZodDefault<z.ZodString>;
    API_PREFIX: z.ZodDefault<z.ZodString>;
    CORS_ORIGINS: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    REDIS_HOST: z.ZodDefault<z.ZodString>;
    REDIS_PORT: z.ZodDefault<z.ZodNumber>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRY: z.ZodDefault<z.ZodString>;
    REFRESH_TOKEN_SECRET: z.ZodString;
    REFRESH_TOKEN_EXPIRY: z.ZodDefault<z.ZodString>;
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    ANTHROPIC_API_KEY: z.ZodOptional<z.ZodString>;
    DEFAULT_AI_PROVIDER: z.ZodDefault<z.ZodEnum<["openai", "anthropic", "mock"]>>;
    DEFAULT_MODEL: z.ZodDefault<z.ZodString>;
    DEFAULT_EMBEDDING_MODEL: z.ZodDefault<z.ZodString>;
    DEFAULT_EMBEDDING_DIMENSIONS: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT_TTL: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT_MAX: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace"]>>;
    SENTRY_DSN: z.ZodOptional<z.ZodString>;
    UPLOAD_DIR: z.ZodDefault<z.ZodString>;
    MAX_FILE_SIZE_MB: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "production" | "development" | "test";
    LOG_LEVEL: "info" | "fatal" | "error" | "warn" | "debug" | "trace";
    API_PORT: number;
    API_VERSION: string;
    API_PREFIX: string;
    CORS_ORIGINS: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;
    DEFAULT_AI_PROVIDER: "openai" | "anthropic" | "mock";
    DEFAULT_MODEL: string;
    DEFAULT_EMBEDDING_MODEL: string;
    DEFAULT_EMBEDDING_DIMENSIONS: number;
    RATE_LIMIT_TTL: number;
    RATE_LIMIT_MAX: number;
    UPLOAD_DIR: string;
    MAX_FILE_SIZE_MB: number;
    OPENAI_API_KEY?: string | undefined;
    ANTHROPIC_API_KEY?: string | undefined;
    SENTRY_DSN?: string | undefined;
}, {
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    NODE_ENV?: "production" | "development" | "test" | undefined;
    LOG_LEVEL?: "info" | "fatal" | "error" | "warn" | "debug" | "trace" | undefined;
    API_PORT?: number | undefined;
    API_VERSION?: string | undefined;
    API_PREFIX?: string | undefined;
    CORS_ORIGINS?: string | undefined;
    REDIS_URL?: string | undefined;
    REDIS_HOST?: string | undefined;
    REDIS_PORT?: number | undefined;
    JWT_EXPIRY?: string | undefined;
    REFRESH_TOKEN_EXPIRY?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
    ANTHROPIC_API_KEY?: string | undefined;
    DEFAULT_AI_PROVIDER?: "openai" | "anthropic" | "mock" | undefined;
    DEFAULT_MODEL?: string | undefined;
    DEFAULT_EMBEDDING_MODEL?: string | undefined;
    DEFAULT_EMBEDDING_DIMENSIONS?: number | undefined;
    RATE_LIMIT_TTL?: number | undefined;
    RATE_LIMIT_MAX?: number | undefined;
    SENTRY_DSN?: string | undefined;
    UPLOAD_DIR?: string | undefined;
    MAX_FILE_SIZE_MB?: number | undefined;
}>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;
export declare function getApiEnv(): ApiEnv;
export {};
//# sourceMappingURL=api.env.d.ts.map