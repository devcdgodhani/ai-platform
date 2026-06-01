"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderFactory = void 0;
const shared_types_1 = require("../../../shared-types/src");
const openai_provider_1 = require("../providers/openai.provider");
const anthropic_provider_1 = require("../providers/anthropic.provider");
const mock_provider_1 = require("../providers/mock.provider");
/**
 * Registry-based factory for AI providers.
 * Registered once at app startup; retrieved by name at runtime.
 */
class AIProviderFactory {
    static registry = new Map();
    static register(name, provider) {
        this.registry.set(name, provider);
    }
    static get(name) {
        const provider = this.registry.get(name);
        if (!provider) {
            throw new Error(`AI provider "${name}" not registered. Available: ${[...this.registry.keys()].join(', ')}`);
        }
        return provider;
    }
    static getDefault() {
        const defaultName = process.env['DEFAULT_AI_PROVIDER'] ?? shared_types_1.ModelProvider.MOCK;
        return this.get(defaultName);
    }
    /**
     * Bootstrap — call once during app initialization.
     * Registers all available providers based on present API keys.
     */
    static initialize(config) {
        // Always register mock for testing fallback
        this.register(shared_types_1.ModelProvider.MOCK, new mock_provider_1.MockAIProvider());
        if (config.openaiApiKey) {
            this.register(shared_types_1.ModelProvider.OPENAI, new openai_provider_1.OpenAIProvider(config.openaiApiKey, config.defaultModel));
        }
        if (config.anthropicApiKey) {
            this.register(shared_types_1.ModelProvider.ANTHROPIC, new anthropic_provider_1.AnthropicProvider(config.anthropicApiKey));
        }
    }
    static listProviders() {
        return [...this.registry.keys()];
    }
}
exports.AIProviderFactory = AIProviderFactory;
//# sourceMappingURL=provider.factory.js.map