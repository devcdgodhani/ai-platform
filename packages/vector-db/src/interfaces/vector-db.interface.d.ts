import type { CollectionConfig, QueryResult, VectorRecord } from '@ai-platform/shared-types';
/**
 * Unified vector database contract.
 * Backed by pgvector today; swap to Qdrant/Pinecone later without touching callers.
 */
export interface IVectorDB {
    /** Insert or update vectors in a collection */
    upsert(collection: string, vectors: VectorRecord[]): Promise<void>;
    /** ANN similarity search — returns topK nearest vectors */
    query(collection: string, vector: number[], topK: number, filter?: Record<string, unknown>): Promise<QueryResult[]>;
    /** Delete vectors by ID */
    delete(collection: string, ids: string[]): Promise<void>;
    /** Create a new collection (table/namespace) */
    createCollection(name: string, config: CollectionConfig): Promise<void>;
    /** Check if a collection exists */
    collectionExists(name: string): Promise<boolean>;
}
//# sourceMappingURL=vector-db.interface.d.ts.map