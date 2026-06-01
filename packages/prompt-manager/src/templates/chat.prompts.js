"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatPrompts = registerChatPrompts;
const prompt_registry_1 = require("../registry/prompt.registry");
const chatPrompts = [
    {
        name: 'chat.default',
        version: '1.0.0',
        description: 'Default conversational AI assistant',
        system: `You are a helpful, accurate, and concise AI assistant.
Always respond in a clear and structured manner.
If you don't know something, say so honestly.`,
        userTemplate: '{{message}}',
        variables: ['message'],
    },
    {
        name: 'chat.rag',
        version: '1.0.0',
        description: 'RAG-augmented chat with context injection',
        system: `You are a helpful AI assistant. Answer questions based on the provided context.
If the context doesn't contain enough information, say so and answer from your general knowledge.
Always cite the relevant parts of the context when answering.`,
        userTemplate: `Context:
---
{{context}}
---

Question: {{message}}`,
        variables: ['context', 'message'],
    },
    {
        name: 'chat.sql-agent',
        version: '1.0.0',
        description: 'SQL agent prompt for database query generation',
        system: `You are an expert SQL engineer. Generate correct, optimized SQL queries.
Schema: {{schema}}
Database: {{dialect}}
Rules: Only SELECT queries. No mutations. Limit results to 100 rows unless specified.`,
        userTemplate: '{{message}}',
        variables: ['schema', 'dialect', 'message'],
    },
];
function registerChatPrompts() {
    chatPrompts.forEach((p) => prompt_registry_1.PromptRegistry.register(p));
}
//# sourceMappingURL=chat.prompts.js.map