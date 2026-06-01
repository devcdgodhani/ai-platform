export const REDIS_KEYS = {
  chat: (userId: string, conversationId: string) => `chat:${userId}:${conversationId}`,
  session: (userId: string) => `session:${userId}`,
  refreshToken: (userId: string, family: string) => `rt:${userId}:${family}`,
  rateLimit: (userId: string, route: string) => `rl:${userId}:${route}`,
  aiCache: (hash: string) => `ai:cache:${hash}`,
  userProfile: (userId: string) => `user:profile:${userId}`,
} as const;

export const REDIS_TTL = {
  CONVERSATION_HISTORY: 86_400,    // 24 hours
  USER_SESSION: 604_800,           // 7 days
  AI_RESPONSE_CACHE: 3_600,        // 1 hour
  RATE_LIMIT_WINDOW: 60,           // 1 minute
  USER_PROFILE: 300,               // 5 minutes
} as const;
