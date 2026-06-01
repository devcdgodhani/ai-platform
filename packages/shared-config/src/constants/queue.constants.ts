import { QueueName } from '@ai-platform/shared-types';

export const QUEUE_CONFIG: Record<QueueName, { concurrency: number; attempts: number; backoff: number }> = {
  [QueueName.AI_INFERENCE]: {
    concurrency: 5,
    attempts: 3,
    backoff: 2000,
  },
  [QueueName.EMBEDDINGS]: {
    concurrency: 3,
    attempts: 5,
    backoff: 1000,
  },
  [QueueName.DOCUMENT_PROCESSING]: {
    concurrency: 2,
    attempts: 3,
    backoff: 5000,
  },
  [QueueName.NOTIFICATIONS]: {
    concurrency: 10,
    attempts: 3,
    backoff: 500,
  },
};
