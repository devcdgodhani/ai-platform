// ─── Job Types ───────────────────────────────────────────────────────────────

export enum QueueName {
  AI_INFERENCE = 'ai-inference',
  EMBEDDINGS = 'embeddings',
  DOCUMENT_PROCESSING = 'document-processing',
  NOTIFICATIONS = 'notifications',
}

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  PAUSED = 'paused',
}

export interface InferenceJobPayload {
  conversationId: string;
  userId: string;
  messages: import('../ai/provider.types').AIMessage[];
  options: import('../ai/provider.types').ChatOptions;
}

export interface EmbeddingJobPayload {
  documentId: string;
  chunkId: string;
  text: string;
  collection: string;
  metadata: Record<string, unknown>;
}

export interface IngestionJobPayload {
  documentId: string;
  userId: string;
  filePath: string;
  mimeType: string;
  collection: string;
}
