"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgVectorProvider = void 0;
const logger_1 = require("../../../logger/src");
const logger = (0, logger_1.createLogger)('vector-db:pgvector');
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
class PgVectorProvider {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(collection, vectors) {
        logger.debug({ collection, count: vectors.length }, 'upserting vectors');
        for (const record of vectors) {
            const vectorStr = `[${record.vector.join(',')}]`;
            await this.prisma.$executeRaw `
        INSERT INTO embeddings (id, collection, embedding, payload)
        VALUES (
          ${record.id},
          ${collection},
          ${vectorStr}::vector,
          ${JSON.stringify(record.payload)}::jsonb
        )
        ON CONFLICT (id) DO UPDATE
          SET embedding = EXCLUDED.embedding,
              payload = EXCLUDED.payload,
              updated_at = NOW()
      `;
        }
    }
    async query(collection, vector, topK, _filter) {
        const vectorStr = `[${vector.join(',')}]`;
        const rows = await this.prisma.$queryRaw `
      SELECT
        id,
        payload,
        1 - (embedding <=> ${vectorStr}::vector) AS score
      FROM embeddings
      WHERE collection = ${collection}
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
        return rows.map((row) => ({
            id: row.id,
            score: Number(row.score),
            payload: row.payload,
            content: row.payload['content'] ?? '',
        }));
    }
    async delete(collection, ids) {
        await this.prisma.$executeRaw `
      DELETE FROM embeddings WHERE collection = ${collection} AND id = ANY(${ids}::text[])
    `;
    }
    async createCollection(name, config) {
        // Ensure the pgvector extension is enabled
        await this.prisma.$executeRaw `CREATE EXTENSION IF NOT EXISTS vector`;
        // Create the embeddings table if it doesn't exist (uses a single table with collection column)
        await this.prisma.$executeRaw `
      CREATE TABLE IF NOT EXISTS embeddings (
        id          TEXT        PRIMARY KEY,
        collection  TEXT        NOT NULL,
        embedding   vector(${config.dimensions}),
        payload     JSONB       NOT NULL DEFAULT '{}',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
        // HNSW index for fast ANN search — much faster than IVFFlat for <10M vectors
        await this.prisma.$executeRaw `
      CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw_${name}
      ON embeddings
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
      WHERE collection = ${name}
    `;
        // Index on collection for fast filtering
        await this.prisma.$executeRaw `
      CREATE INDEX IF NOT EXISTS idx_embeddings_collection
      ON embeddings (collection)
    `;
        logger.info({ collection: name, dimensions: config.dimensions }, 'collection created');
    }
    async collectionExists(name) {
        const result = await this.prisma.$queryRaw `
      SELECT COUNT(*) as count FROM embeddings WHERE collection = ${name} LIMIT 1
    `;
        return (result[0]?.count ?? 0n) >= 0n;
    }
}
exports.PgVectorProvider = PgVectorProvider;
//# sourceMappingURL=pgvector.provider.js.map