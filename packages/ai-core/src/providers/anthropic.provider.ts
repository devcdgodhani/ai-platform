import Anthropic from '@anthropic-ai/sdk';
import type {
  AIMessage,
  AIResponse,
  ChatOptions,
  EmbeddingRequest,
  EmbeddingResponse,
  StreamChunk,
} from '@ai-platform/shared-types';
import { ModelProvider } from '@ai-platform/shared-types';
import { BaseAIProvider } from './base.provider';

export class AnthropicProvider extends BaseAIProvider {
  readonly providerName = ModelProvider.ANTHROPIC;
  readonly modelName: string;
  private client: Anthropic;

  constructor(apiKey: string, model = 'claude-3-5-sonnet-20241022') {
    super();
    this.client = new Anthropic({ apiKey });
    this.modelName = model;
  }

  protected async _chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    const systemMessages = messages.filter((m) => m.role === 'system');
    const userMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const params: any = {
      model: options?.model ?? this.modelName,
      max_tokens: options?.maxTokens ?? 4096,
      messages: userMessages,
    };

    const systemContent = systemMessages.map((m) => m.content).join('\n');
    if (systemContent) {
      params.system = systemContent;
    }

    const response = await this.client.messages.create(params);

    const textBlock = response.content.find((b) => b.type === 'text');

    return {
      id: response.id,
      content: textBlock?.type === 'text' ? textBlock.text : '',
      model: response.model,
      provider: ModelProvider.ANTHROPIC,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason === 'end_turn' ? 'stop' : 'length',
    };
  }

  protected async *_stream(messages: AIMessage[], options?: ChatOptions): AsyncIterable<StreamChunk> {
    const systemMessages = messages.filter((m) => m.role === 'system');
    const userMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const params: any = {
      model: options?.model ?? this.modelName,
      max_tokens: options?.maxTokens ?? 4096,
      messages: userMessages,
    };

    const systemContent = systemMessages.map((m) => m.content).join('\n');
    if (systemContent) {
      params.system = systemContent;
    }

    const stream = this.client.messages.stream(params);

    let index = 0;
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { id: `anthropic-${index}`, delta: event.delta.text, index: index++, done: false };
      }
      if (event.type === 'message_stop') {
        yield { id: `anthropic-done`, delta: '', index: index++, done: true };
      }
    }
  }

  /** Anthropic does not provide embeddings — throw to force OpenAI usage */
  protected async _embed(_request: EmbeddingRequest): Promise<EmbeddingResponse> {
    throw new Error('Anthropic does not support embeddings. Use OpenAI provider for embeddings.');
  }
}
