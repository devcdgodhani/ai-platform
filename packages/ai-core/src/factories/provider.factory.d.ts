import type { IAIProvider } from '../interfaces/ai-provider.interface';
type ProviderConfig = {
    openaiApiKey?: string;
    anthropicApiKey?: string;
    defaultModel?: string;
};
/**
 * Registry-based factory for AI providers.
 * Registered once at app startup; retrieved by name at runtime.
 */
export declare class AIProviderFactory {
    private static registry;
    static register(name: string, provider: IAIProvider): void;
    static get(name: string): IAIProvider;
    static getDefault(): IAIProvider;
    /**
     * Bootstrap — call once during app initialization.
     * Registers all available providers based on present API keys.
     */
    static initialize(config: ProviderConfig): void;
    static listProviders(): string[];
}
export {};
//# sourceMappingURL=provider.factory.d.ts.map