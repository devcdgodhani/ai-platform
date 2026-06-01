import { type Logger } from 'pino';
/**
 * Creates a child logger scoped to a specific context (e.g. 'api:chat').
 * JSON in production, pretty-printed in development.
 */
export declare function createLogger(context: string): Logger;
export type { Logger };
//# sourceMappingURL=logger.factory.d.ts.map