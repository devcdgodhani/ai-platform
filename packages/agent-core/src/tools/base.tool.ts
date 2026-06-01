import { z } from 'zod';
import type { ToolDefinition, ToolResult } from '@ai-platform/shared-types';

/**
 * Base tool class — extend this to create agent tools.
 * Zod schema provides automatic parameter validation.
 */
export abstract class BaseTool<TInput extends z.ZodTypeAny = z.ZodTypeAny> {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly schema: TInput;

  abstract _execute(input: z.infer<TInput>): Promise<string>;

  async execute(rawInput: unknown): Promise<ToolResult> {
    const parsed = this.schema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        id: `${this.name}-${Date.now()}`,
        name: this.name,
        content: '',
        error: `Invalid input: ${parsed.error.message}`,
      };
    }

    try {
      const content = await this._execute(parsed.data as z.infer<TInput>);
      return { id: `${this.name}-${Date.now()}`, name: this.name, content };
    } catch (err) {
      return {
        id: `${this.name}-${Date.now()}`,
        name: this.name,
        content: '',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  toDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description,
      parameters: this.schema._def as Record<string, unknown>,
    };
  }
}
