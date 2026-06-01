import type {
  AIMessage,
  AIResponse,
  ChatOptions,
  EmbeddingRequest,
  EmbeddingResponse,
  StreamChunk,
} from '@ai-platform/shared-types';
import { ModelProvider, MessageRole } from '@ai-platform/shared-types';
import { BaseAIProvider } from './base.provider';

/**
 * Mock provider for local development and testing.
 * No API keys required. Simulates realistic streaming behavior.
 */
export class MockAIProvider extends BaseAIProvider {
  readonly providerName = ModelProvider.MOCK;
  readonly modelName = 'mock-model-v1';

  protected async _chat(messages: AIMessage[], _options?: ChatOptions): Promise<AIResponse> {
    const lastMessage = messages[messages.length - 1]?.content ?? '';
    return {
      id: `mock-${Date.now()}`,
      content: `[MOCK] Echo: "${lastMessage.slice(0, 50)}"`,
      model: this.modelName,
      provider: ModelProvider.MOCK,
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      finishReason: 'stop',
    };
  }

  protected async *_stream(messages: AIMessage[], _options?: ChatOptions): AsyncIterable<StreamChunk> {
    const lastMessage = messages[messages.length - 1]?.content ?? '';
    const response = `[MOCK STREAM] You said: "${lastMessage.slice(0, 50)}"`;
    const words = response.split(' ');

    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 50));
      yield {
        id: `mock-stream-${i}`,
        delta: (i === 0 ? '' : ' ') + words[i],
        index: i,
        done: false,
      };
    }
    yield { id: 'mock-stream-done', delta: '', index: words.length, done: true };
  }

  protected async _embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const texts = Array.isArray(request.text) ? request.text : [request.text];
    return {
      embeddings: texts.map(() => Array.from({ length: 1536 }, () => Math.random())),
      model: 'mock-embedding-v1',
      usage: { promptTokens: 10, completionTokens: 0, totalTokens: 10 },
    };
  }
}
