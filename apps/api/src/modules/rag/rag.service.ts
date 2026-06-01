import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AIService } from '../ai/ai.service';
import { PgVectorProvider } from '@ai-platform/vector-db';
import { PromptRegistry } from '@ai-platform/prompt-manager';
import { createLogger } from '@ai-platform/logger';
import { AI_CONSTANTS } from '@ai-platform/shared-config';
import type { QueryResult, RetrievalQuery } from '@ai-platform/shared-types';
import { MessageRole } from '@ai-platform/shared-types';

const logger = createLogger('api:rag-service');

@Injectable()
export class RAGService {
  private readonly vectorDb: PgVectorProvider;

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AIService,
  ) {
    this.vectorDb = new PgVectorProvider(this.prisma as never);
  }

  /**
   * Ingest a document chunk: generate embedding → upsert to pgvector
   */
  async ingestChunk(
    chunkId: string,
    content: string,
    collection: string,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    const embeddingResult = await this.aiService.embed({ text: content });
    const vector = embeddingResult.embeddings[0];
    if (!vector) throw new Error('Embedding generation failed');

    await this.vectorDb.upsert(collection, [
      { id: chunkId, vector, payload: { content, ...metadata } },
    ]);

    logger.debug({ chunkId, collection }, 'chunk ingested');
  }

  /**
   * Retrieve relevant context for a query and build an augmented prompt
   */
  async retrieveContext(query: RetrievalQuery): Promise<{ context: string; results: QueryResult[] }> {
    const embeddingResult = await this.aiService.embed({ text: query.query });
    const vector = embeddingResult.embeddings[0];
    if (!vector) throw new Error('Query embedding failed');

    const results = await this.vectorDb.query(
      query.collection,
      vector,
      query.topK ?? AI_CONSTANTS.DEFAULTS.RETRIEVAL_TOP_K,
      query.filter,
    );

    const filtered = results.filter(
      (r) => r.score >= (query.minScore ?? AI_CONSTANTS.DEFAULTS.RETRIEVAL_MIN_SCORE),
    );

    const context = filtered.map((r, i) => `[${i + 1}] ${r.content}`).join('\n\n');

    logger.debug({ collection: query.collection, resultCount: filtered.length }, 'context retrieved');

    return { context, results: filtered };
  }

  /**
   * Full RAG chat: retrieve context → inject into prompt → call AI
   */
  async ragChat(query: string, collection: string, conversationHistory: Array<{ role: string; content: string }> = []) {
    const { context, results } = await this.retrieveContext({ query, collection });

    const compiled = PromptRegistry.compile('chat.rag', { context, message: query });

    const messages = [
      { role: MessageRole.SYSTEM, content: compiled.system },
      ...conversationHistory.map((m) => ({ role: m.role as never, content: m.content })),
      { role: MessageRole.USER, content: compiled.user },
    ];

    const response = await this.aiService.chat(messages);

    return { content: response.content, citations: results, usage: response.usage };
  }

  async ensureCollection(name: string, dimensions: number): Promise<void> {
    await this.vectorDb.createCollection(name, { dimensions, metric: 'cosine' });
  }
}
