import type { PrismaClient } from '@prisma/client';
import type { CollectionConfig, QueryResult, VectorRecord } from '@ai-platform/shared-types';
import type { IVectorDB } from '../interfaces/vector-db.interface';
/**
 * pgvector implementation of IVectorDB.
 *
 * Uses Prisma's $queryRaw for vector operations since Prisma does not
 * natively support the `vector` type. HNSW index provides sub-millisecond
 * ANN search for up to ~5M vectors before needing a dedicated vector DB.
 *
 * Similarity operators:
 *   <=>  cosine distance  (most common for embeddings)
 *   <->  L2 / Euclidean
 *   <#>  inner product (negated)
 */
export declare class PgVectorProvider implements IVectorDB {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    upsert(collection: string, vectors: VectorRecord[]): Promise<void>;
    query(collection: string, vector: number[], topK: number, _filter?: Record<string, unknown>): Promise<QueryResult[]>;
    delete(collection: string, ids: string[]): Promise<void>;
    createCollection(name: string, config: CollectionConfig): Promise<void>;
    collectionExists(name: string): Promise<boolean>;
}
//# sourceMappingURL=pgvector.provider.d.ts.map