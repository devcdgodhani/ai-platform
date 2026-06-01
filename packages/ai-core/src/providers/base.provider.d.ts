import type { AIMessage, AIResponse, ChatOptions, EmbeddingRequest, EmbeddingResponse, StreamChunk } from '@ai-platform/shared-types';
import type { IAIProvider } from '../interfaces/ai-provider.interface';
/**
 * Abstract base provider with shared retry logic and telemetry.
 * Concrete providers extend this and implement the abstract methods.
 */
export declare abstract class BaseAIProvider implements IAIProvider {
    abstract readonly providerName: string;
    abstract readonly modelName: string;
    protected abstract _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
    protected abstract _stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;
    protected abstract _embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
    stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;
    embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=base.provider.d.ts.map