// ─── RAG Types ───────────────────────────────────────────────────────────────

export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  collection: string;
  chunkCount?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  tokenCount: number;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  page?: number;
  section?: string;
  heading?: string;
  [key: string]: unknown;
}

export interface VectorRecord {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

export interface QueryResult {
  id: string;
  score: number;
  payload: Record<string, unknown>;
  content: string;
}

export interface RetrievalQuery {
  query: string;
  collection: string;
  topK?: number;
  filter?: Record<string, unknown>;
  minScore?: number;
}

export interface CollectionConfig {
  dimensions: number;
  metric: 'cosine' | 'euclidean' | 'dot';
}
