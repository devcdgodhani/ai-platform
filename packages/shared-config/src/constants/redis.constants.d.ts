export declare const REDIS_KEYS: {
    readonly chat: (userId: string, conversationId: string) => string;
    readonly session: (userId: string) => string;
    readonly refreshToken: (userId: string, family: string) => string;
    readonly rateLimit: (userId: string, route: string) => string;
    readonly aiCache: (hash: string) => string;
    readonly userProfile: (userId: string) => string;
};
export declare const REDIS_TTL: {
    readonly CONVERSATION_HISTORY: 86400;
    readonly USER_SESSION: 604800;
    readonly AI_RESPONSE_CACHE: 3600;
    readonly RATE_LIMIT_WINDOW: 60;
    readonly USER_PROFILE: 300;
};
//# sourceMappingURL=redis.constants.d.ts.map