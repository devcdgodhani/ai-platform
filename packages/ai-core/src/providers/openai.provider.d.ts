import type { AIMessage, AIResponse, ChatOptions, EmbeddingRequest, EmbeddingResponse, StreamChunk } from '@ai-platform/shared-types';
import { ModelProvider } from '@ai-platform/shared-types';
import { BaseAIProvider } from './base.provider';
export declare class OpenAIProvider extends BaseAIProvider {
    readonly providerName = ModelProvider.OPENAI;
    readonly modelName: string;
    private client;
    constructor(apiKey: string, model?: string);
    protected _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>;
    protected _stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk>;
    protected _embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
//# sourceMappingURL=openai.provider.d.ts.map