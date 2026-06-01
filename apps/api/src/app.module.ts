import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { RedisModule } from './infrastructure/cache/redis.module';
import { BullMQModule } from './infrastructure/queue/bullmq.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { AIModule } from './modules/ai/ai.module';
import { RAGModule } from './modules/rag/rag.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // ── Event Bus ─────────────────────────────────────────────────────────
    EventEmitterModule.forRoot({ wildcard: true, maxListeners: 20 }),

    // ── Infrastructure ────────────────────────────────────────────────────
    PrismaModule,
    RedisModule,
    BullMQModule,

    // ── Feature Modules ───────────────────────────────────────────────────
    AuthModule,
    AIModule,
    ChatModule,
    RAGModule,
    DocumentsModule,
    JobsModule,
    HealthModule,
  ],
})
export class AppModule {}
