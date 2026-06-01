export declare enum ConversationStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DELETED = "deleted"
}
export interface Conversation {
    id: string;
    userId: string;
    title: string;
    status: ConversationStatus;
    model: string;
    systemPrompt?: string;
    messageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Message {
    id: string;
    conversationId: string;
    role: import('../ai/provider.types').MessageRole;
    content: string;
    model?: string;
    tokens?: number;
    metadata?: MessageMetadata;
    createdAt: Date;
}
export interface MessageMetadata {
    toolCalls?: import('../agents/agent.types').ToolCall[];
    citations?: Citation[];
    finishReason?: string;
    latencyMs?: number;
}
export interface Citation {
    documentId: string;
    chunkId: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
}
export interface ChatRequest {
    conversationId?: string;
    message: string;
    model?: string;
    provider?: string;
    stream?: boolean;
    systemPrompt?: string;
}
export interface ChatResponse {
    conversationId: string;
    messageId: string;
    content: string;
    model: string;
    usage: import('../ai/provider.types').TokenUsage;
}
//# sourceMappingURL=conversation.types.d.ts.map