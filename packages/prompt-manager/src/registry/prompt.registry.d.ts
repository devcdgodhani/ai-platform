import type { CompiledPrompt, PromptTemplate } from '../interfaces/prompt.interface';
/**
 * Central registry for all prompt templates.
 * Key format: `name:version` — allows A/B testing by version.
 */
export declare class PromptRegistry {
    private static readonly store;
    static register(template: PromptTemplate): void;
    static get(name: string, version?: string): PromptTemplate;
    /**
     * Compile a template by interpolating {{variable}} placeholders.
     */
    static compile(name: string, vars: Record<string, string>, version?: string): CompiledPrompt;
    static list(): PromptTemplate[];
}
//# sourceMappingURL=prompt.registry.d.ts.map