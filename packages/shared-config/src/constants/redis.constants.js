"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_TTL = exports.REDIS_KEYS = void 0;
exports.REDIS_KEYS = {
    chat: (userId, conversationId) => `chat:${userId}:${conversationId}`,
    session: (userId) => `session:${userId}`,
    refreshToken: (userId, family) => `rt:${userId}:${family}`,
    rateLimit: (userId, route) => `rl:${userId}:${route}`,
    aiCache: (hash) => `ai:cache:${hash}`,
    userProfile: (userId) => `user:profile:${userId}`,
};
exports.REDIS_TTL = {
    CONVERSATION_HISTORY: 86_400, // 24 hours
    USER_SESSION: 604_800, // 7 days
    AI_RESPONSE_CACHE: 3_600, // 1 hour
    RATE_LIMIT_WINDOW: 60, // 1 minute
    USER_PROFILE: 300, // 5 minutes
};
//# sourceMappingURL=redis.constants.js.map