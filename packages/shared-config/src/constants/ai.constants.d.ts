export declare const AI_CONSTANTS: {
    readonly PROVIDERS: {
        readonly openai: {
            readonly models: {
                readonly CHAT: "gpt-4o";
                readonly CHAT_MINI: "gpt-4o-mini";
                readonly EMBEDDING: "text-embedding-3-small";
                readonly EMBEDDING_LARGE: "text-embedding-3-large";
            };
            readonly maxTokens: {
                readonly 'gpt-4o': 128000;
                readonly 'gpt-4o-mini': 128000;
            };
            readonly embeddingDimensions: {
                readonly 'text-embedding-3-small': 1536;
                readonly 'text-embedding-3-large': 3072;
            };
        };
        readonly anthropic: {
            readonly models: {
                readonly CHAT: "claude-3-5-sonnet-20241022";
                readonly CHAT_FAST: "claude-3-haiku-20240307";
            };
            readonly maxTokens: {
                readonly 'claude-3-5-sonnet-20241022': 200000;
                readonly 'claude-3-haiku-20240307': 200000;
            };
        };
    };
    readonly DEFAULTS: {
        readonly TEMPERATURE: 0.7;
        readonly MAX_TOKENS: 4096;
        readonly CHUNK_SIZE: 512;
        readonly CHUNK_OVERLAP: 50;
        readonly RETRIEVAL_TOP_K: 5;
        readonly RETRIEVAL_MIN_SCORE: 0.7;
    };
};
//# sourceMappingURL=ai.constants.d.ts.map