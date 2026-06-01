import type { PromptTemplate } from '../interfaces/prompt.interface';
import { PromptRegistry } from '../registry/prompt.registry';

const chatPrompts: PromptTemplate[] = [
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

export function registerChatPrompts(): void {
  chatPrompts.forEach((p) => PromptRegistry.register(p));
}
