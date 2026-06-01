import { Injectable } from '@nestjs/common';
import { AIProviderFactory } from '@ai-platform/ai-core';
import { getApiEnv } from '@ai-platform/shared-config';
import { createLogger } from '@ai-platform/logger';
import { PromptRegistry, registerChatPrompts } from '@ai-platform/prompt-manager';
import type { AIMessage, AIResponse, ChatOptions, EmbeddingRequest, EmbeddingResponse, StreamChunk } from '@ai-platform/shared-types';

const logger = createLogger('api:ai-service');

@Injectable()
export class AIService {
  constructor() {
    const env = getApiEnv();
    // Initialize all available providers based on env config
    AIProviderFactory.initialize({
      openaiApiKey: env.OPENAI_API_KEY,
      anthropicApiKey: env.ANTHROPIC_API_KEY,
      nvidiaApiKey: env.NVIDIA_API_KEY,
      defaultModel: env.DEFAULT_MODEL,
    });
    // Register built-in prompt templates
    registerChatPrompts();
    logger.info({ providers: AIProviderFactory.listProviders() }, 'AI providers initialized');
  }

  async chat(
    messages: AIMessage[],
    options?: ChatOptions & { provider?: string | undefined },
  ): Promise<AIResponse> {
    const provider = AIProviderFactory.get(options?.provider ?? getApiEnv().DEFAULT_AI_PROVIDER);
    return provider.chat(messages, options);
  }

  async *stream(
    messages: AIMessage[],
    options?: ChatOptions & { provider?: string | undefined },
  ): AsyncIterable<StreamChunk> {
    const provider = AIProviderFactory.get(options?.provider ?? getApiEnv().DEFAULT_AI_PROVIDER);
    yield* provider.stream(messages, options);
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    // Always use OpenAI for embeddings (Anthropic doesn't support them)
    const provider = AIProviderFactory.get(
      getApiEnv().OPENAI_API_KEY ? 'openai' : 'mock',
    );
    return provider.embed(request);
  }

  compilePrompt(name: string, vars: Record<string, string>, version?: string) {
    return PromptRegistry.compile(name, vars, version);
  }
}
