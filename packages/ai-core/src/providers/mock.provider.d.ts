import type { AIMessage, AIResponse, ChatOptions, EmbeddingRequest, EmbeddingResponse, StreamChunk } from '@ai-platform/shared-types';
import { ModelProvider } from '@ai-platform/shared-types';
import { BaseAIProvider } from './base.provider';
/**
 * Mock provider for local development and testing.
 * No API keys required. Simulates realistic streaming behavior.
 */
export declare class MockAIProvider extends BaseAIProvider {
    readonly providerName = ModelProvider.MOCK;
    readonly modelName = "mock-model-v1";
    protected _chat(messages: AIMessage[], _options?: ChatOptions): Promise<AIResponse>;
    protected _stream(messages: AIMessage[], _options?: ChatOptions): AsyncIterable<StreamChunk>;
    protected _embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
//# sourceMappingURL=mock.provider.d.ts.map