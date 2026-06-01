import type { AIMessage, AIResponse, ChatOptions, EmbeddingRequest, EmbeddingResponse, StreamChunk } from '@ai-platform/shared-types';
import { ModelProvider } from '@ai-platform/shared-types';
import { BaseAIProvider } from './base.provider';
export declare class AnthropicProvider extends BaseAIProvider {
    readonly providerName = ModelProvider.ANTHROPIC;
    readonly modelName: string;
    private client;
    constructor(apiKey: string, model?: string);
    protected _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
    protected _stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;
    /** Anthropic does not provide embeddings — throw to force OpenAI usage */
    protected _embed(_request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
//# sourceMappingURL=anthropic.provider.d.ts.map