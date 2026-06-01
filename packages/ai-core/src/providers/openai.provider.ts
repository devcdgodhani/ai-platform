import OpenAI from 'openai';
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

import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

/** Map our MessageRole enum (uppercase) to OpenAI's expected lowercase role strings */
function toOpenAIMessages(messages: AIMessage[]): ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.role !== MessageRole.TOOL) // TOOL msgs need tool_call_id — handle separately
    .map((m) => ({
      role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: m.content,
    }));
}

export class OpenAIProvider extends BaseAIProvider {
  readonly providerName = ModelProvider.OPENAI;
  readonly modelName: string;
  private client: OpenAI;

  constructor(apiKey: string, model = 'gpt-4o') {
    super();
    this.client = new OpenAI({ apiKey });
    this.modelName = model;
  }

  protected async _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    const response = await this.client.chat.completions.create({
      model: options?.model ?? this.modelName,
      messages: toOpenAIMessages(messages),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });

    const choice = response.choices[0];
    if (!choice) throw new Error('No completion choice returned');

    return {
      id: response.id,
      content: choice.message.content ?? '',
      model: response.model,
      provider: ModelProvider.OPENAI,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
      finishReason: (choice.finish_reason as AIResponse['finishReason']) ?? 'stop',
    };
  }

  protected async *_stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const stream = await this.client.chat.completions.create({
      model: options?.model ?? this.modelName,
      messages: toOpenAIMessages(messages),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true,
    });

    let index = 0;
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta.content ?? '';
      const done = chunk.choices[0]?.finish_reason != null;
      yield { id: chunk.id, delta, index: index++, done };
      if (done) break;
    }
  }

  protected async _embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const input = Array.isArray(request.text) ? request.text : [request.text];
    const response = await this.client.embeddings.create({
      model: request.model ?? 'text-embedding-3-small',
      input,
    });
    return {
      embeddings: response.data.map((d) => d.embedding),
      model: response.model,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: 0,
        totalTokens: response.usage.total_tokens,
      },
    };
  }
}
