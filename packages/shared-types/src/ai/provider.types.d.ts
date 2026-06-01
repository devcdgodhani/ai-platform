export declare enum ModelProvider {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    MOCK = "mock"
}
export declare enum MessageRole {
    USER = "user",
    ASSISTANT = "assistant",
    SYSTEM = "system",
    TOOL = "tool"
}
export interface AIMessage {
    role: MessageRole;
    content: string;
    name?: string;
}
export interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    systemPrompt?: string;
}
export interface AIResponse {
    id: string;
    content: string;
    model: string;
    provider: ModelProvider;
    usage: TokenUsage;
    finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
}
export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}
export interface StreamChunk {
    id: string;
    delta: string;
    index: number;
    done: boolean;
}
export interface EmbeddingRequest {
    text: string | string[];
    model?: string;
}
export interface EmbeddingResponse {
    embeddings: number[][];
    model: string;
    usage: TokenUsage;
}
//# sourceMappingURL=provider.types.d.ts.map