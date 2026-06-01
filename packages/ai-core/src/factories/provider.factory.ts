import { ModelProvider } from '@ai-platform/shared-types';
import type { IAIProvider } from '../interfaces/ai-provider.interface';
import { OpenAIProvider } from '../providers/openai.provider';
import { AnthropicProvider } from '../providers/anthropic.provider';
import { NvidiaProvider } from '../providers/nvidia.provider';
import { MockAIProvider } from '../providers/mock.provider';

type ProviderConfig = {
  openaiApiKey?: string | undefined;
  anthropicApiKey?: string | undefined;
  nvidiaApiKey?: string | undefined;
  defaultModel?: string | undefined;
};

/**
 * Registry-based factory for AI providers.
 * Registered once at app startup; retrieved by name at runtime.
 */
export class AIProviderFactory {
  private static registry = new Map<string, IAIProvider>();

  static register(name: string, provider: IAIProvider): void {
    this.registry.set(name, provider);
  }

  static get(name: string): IAIProvider {
    const provider = this.registry.get(name);
    if (!provider) {
      throw new Error(`AI provider "${name}" not registered. Available: ${[...this.registry.keys()].join(', ')}`);
    }
    return provider;
  }

  static getDefault(): IAIProvider {
    const defaultName = process.env['DEFAULT_AI_PROVIDER'] ?? ModelProvider.MOCK;
    return this.get(defaultName);
  }

  /**
   * Bootstrap — call once during app initialization.
   * Registers all available providers based on present API keys.
   */
  static initialize(config: ProviderConfig): void {
    // Always register mock for testing fallback
    this.register(ModelProvider.MOCK, new MockAIProvider());

    if (config.openaiApiKey) {
      this.register(ModelProvider.OPENAI, new OpenAIProvider(config.openaiApiKey, config.defaultModel));
    }

    if (config.anthropicApiKey) {
      this.register(ModelProvider.ANTHROPIC, new AnthropicProvider(config.anthropicApiKey));
    }

    if (config.nvidiaApiKey) {
      this.register(ModelProvider.NVIDIA, new NvidiaProvider(config.nvidiaApiKey, config.defaultModel));
    }
  }

  static listProviders(): string[] {
    return [...this.registry.keys()];
  }
}
