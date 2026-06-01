"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptRegistry = void 0;
/**
 * Central registry for all prompt templates.
 * Key format: `name:version` — allows A/B testing by version.
 */
class PromptRegistry {
    static store = new Map();
    static register(template) {
        const key = `${template.name}:${template.version}`;
        this.store.set(key, template);
        // Also register as "latest" for convenience
        this.store.set(`${template.name}:latest`, template);
    }
    static get(name, version = 'latest') {
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
    static compile(name, vars, version = 'latest') {
        const template = this.get(name, version);
        // Validate required variables
        for (const required of template.variables) {
            if (!(required in vars)) {
                throw new Error(`Missing required variable "${required}" for prompt "${name}"`);
            }
        }
        const interpolate = (str) => str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
        return {
            system: interpolate(template.system),
            user: interpolate(template.userTemplate),
        };
    }
    static list() {
        return [...this.store.values()];
    }
}
exports.PromptRegistry = PromptRegistry;
//# sourceMappingURL=prompt.registry.js.map