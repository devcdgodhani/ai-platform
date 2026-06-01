import type {
  AIMessage,
  AIResponse,
  ChatOptions,
  EmbeddingRequest,
  EmbeddingResponse,
  StreamChunk,
} from '@ai-platform/shared-types';
import { MessageRole } from '@ai-platform/shared-types';
import { createLogger } from '@ai-platform/logger';
import type { IAIProvider } from '../interfaces/ai-provider.interface';

const logger = createLogger('ai-core:base-provider');

/**
 * Abstract base provider with shared retry logic and telemetry.
 * Concrete providers extend this and implement the abstract methods.
 */
export abstract class BaseAIProvider implements IAIProvider {
  abstract readonly providerName: string;
  abstract readonly modelName: string;

  protected abstract _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
  protected abstract _stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;
  protected abstract _embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    const start = Date.now();
    try {
      logger.info({ provider: this.providerName, model: this.modelName }, 'chat request');
      const result = await this._chat(messages, options);
      logger.info({ latencyMs: Date.now() - start, tokens: result.usage.totalTokens }, 'chat complete');
      return result;
    } catch (err) {
      logger.error({ err, provider: this.providerName }, 'chat failed');
      throw err;
    }
  }

  async *stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    logger.info({ provider: this.providerName }, 'stream request');
    yield* this._stream(messages, options);
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const start = Date.now();
    try {
      const result = await this._embed(request);
      logger.debug({ latencyMs: Date.now() - start }, 'embed complete');
      return result;
    } catch (err) {
      logger.error({ err }, 'embed failed');
      throw err;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.chat([{ role: MessageRole.USER, content: 'ping' }], { maxTokens: 1 });
      return true;
    } catch {
      return false;
    }
  }
}
