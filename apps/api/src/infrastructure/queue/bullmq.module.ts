import { Global, Module } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { getApiEnv } from '@ai-platform/shared-config';
import { QUEUE_CONFIG } from '@ai-platform/shared-config';
import { QueueName } from '@ai-platform/shared-types';

/** Token names for injecting BullMQ Queue instances */
export const QUEUE_TOKENS = {
  AI_INFERENCE: 'QUEUE:AI_INFERENCE',
  EMBEDDINGS: 'QUEUE:EMBEDDINGS',
  DOCUMENT_PROCESSING: 'QUEUE:DOCUMENT_PROCESSING',
  NOTIFICATIONS: 'QUEUE:NOTIFICATIONS',
} as const;

function createQueueProvider(queueName: QueueName, token: string) {
  return {
    provide: token,
    useFactory: () => {
      const env = getApiEnv();
      return new Queue(queueName, {
        connection: { url: env.REDIS_URL },
        defaultJobOptions: {
          attempts: QUEUE_CONFIG[queueName].attempts,
          backoff: { type: 'exponential', delay: QUEUE_CONFIG[queueName].backoff },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 500 },
        },
      });
    },
  };
}

const queueProviders = [
  createQueueProvider(QueueName.AI_INFERENCE, QUEUE_TOKENS.AI_INFERENCE),
  createQueueProvider(QueueName.EMBEDDINGS, QUEUE_TOKENS.EMBEDDINGS),
  createQueueProvider(QueueName.DOCUMENT_PROCESSING, QUEUE_TOKENS.DOCUMENT_PROCESSING),
  createQueueProvider(QueueName.NOTIFICATIONS, QUEUE_TOKENS.NOTIFICATIONS),
];

@Global()
@Module({
  providers: queueProviders,
  exports: queueProviders.map((p) => p.provide),
})
export class BullMQModule {}
