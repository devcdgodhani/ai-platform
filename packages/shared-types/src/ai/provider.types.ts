// ─── AI Provider Types ─────────────────────────────────────────────────────

export enum ModelProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  NVIDIA = 'nvidia',
  MOCK = 'mock',
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool',
}

export interface AIMessage {
  role: MessageRole;
  content: string;
  name?: string | undefined;
}

export interface ChatOptions {
  model?: string | undefined;
  temperature?: number | undefined;
  maxTokens?: number | undefined;
  stream?: boolean | undefined;
  systemPrompt?: string | undefined;
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
  model?: string | undefined;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage: TokenUsage;
}
