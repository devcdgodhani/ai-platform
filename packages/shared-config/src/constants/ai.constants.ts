import { ModelProvider } from '@ai-platform/shared-types';

export const AI_CONSTANTS = {
  PROVIDERS: {
    [ModelProvider.OPENAI]: {
      models: {
        CHAT: 'gpt-4o',
        CHAT_MINI: 'gpt-4o-mini',
        EMBEDDING: 'text-embedding-3-small',
        EMBEDDING_LARGE: 'text-embedding-3-large',
      },
      maxTokens: {
        'gpt-4o': 128_000,
        'gpt-4o-mini': 128_000,
      },
      embeddingDimensions: {
        'text-embedding-3-small': 1536,
        'text-embedding-3-large': 3072,
      },
    },
    [ModelProvider.ANTHROPIC]: {
      models: {
        CHAT: 'claude-3-5-sonnet-20241022',
        CHAT_FAST: 'claude-3-haiku-20240307',
      },
      maxTokens: {
        'claude-3-5-sonnet-20241022': 200_000,
        'claude-3-haiku-20240307': 200_000,
      },
    },
  },
  DEFAULTS: {
    TEMPERATURE: 0.7,
    MAX_TOKENS: 4096,
    CHUNK_SIZE: 512,
    CHUNK_OVERLAP: 50,
    RETRIEVAL_TOP_K: 5,
    RETRIEVAL_MIN_SCORE: 0.7,
  },
} as const;
