import type {
  AIMessage,
  AIResponse,
  ChatOptions,
  EmbeddingRequest,
  EmbeddingResponse,
  StreamChunk,
} from '@ai-platform/shared-types';

/**
 * Core contract every AI provider must implement.
 * Adding a new provider = creating one class that satisfies this interface.
 */
export interface IAIProvider {
  readonly providerName: string;
  readonly modelName: string;

  /** Single-turn or multi-turn chat completion */
  chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;

  /** Streaming chat — yields chunks as they arrive from the provider */
  stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;

  /** Convert text(s) to embedding vectors */
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;

  /** Health check — verify provider is reachable */
  healthCheck(): Promise<boolean>;
}
