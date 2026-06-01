import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { getApiEnv } from '@ai-platform/shared-config';
import { createLogger } from '@ai-platform/logger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const logger = createLogger('api:bootstrap');

async function bootstrap(): Promise<void> {
  const env = getApiEnv(); // Validates all env vars — exits if invalid

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false, // We use Pino instead of Fastify's built-in logger
      trustProxy: true,
    }),
  );

  // ── Global prefix + versioning ───────────────────────────────────────────
  app.setGlobalPrefix(env.API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: env.API_VERSION,
    prefix: 'v',
  });

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── Global pipes ─────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,          // Auto-transform to DTO class instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global interceptors ──────────────────────────────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // ── Global filters ───────────────────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Graceful shutdown ────────────────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(env.API_PORT, '0.0.0.0');
  logger.info(`🚀 API running at http://0.0.0.0:${env.API_PORT}/${env.API_PREFIX}/v${env.API_VERSION}`);
}

void bootstrap();
