import type { CompiledPrompt, PromptTemplate } from '../interfaces/prompt.interface';

/**
 * Central registry for all prompt templates.
 * Key format: `name:version` — allows A/B testing by version.
 */
export class PromptRegistry {
  private static readonly store = new Map<string, PromptTemplate>();

  static register(template: PromptTemplate): void {
    const key = `${template.name}:${template.version}`;
    this.store.set(key, template);
    // Also register as "latest" for convenience
    this.store.set(`${template.name}:latest`, template);
  }

  static get(name: string, version = 'latest'): PromptTemplate {
    const key = `${name}:${version}`;
    const template = this.store.get(key);
    if (!template) {
      throw new Error(`Prompt template "${key}" not found. Registered: ${[...this.store.keys()].join(', ')}`);
    }
    return template;
  }

  /**
   * Compile a template by interpolating {{variable}} placeholders.
   */
  static compile(name: string, vars: Record<string, string>, version = 'latest'): CompiledPrompt {
    const template = this.get(name, version);

    // Validate required variables
    for (const required of template.variables) {
      if (!(required in vars)) {
        throw new Error(`Missing required variable "${required}" for prompt "${name}"`);
      }
    }

    const interpolate = (str: string): string =>
      str.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);

    return {
      system: interpolate(template.system),
      user: interpolate(template.userTemplate),
    };
  }

  static list(): PromptTemplate[] {
    return [...this.store.values()];
  }
}
