import pino, { type Logger } from 'pino';

const isDev = process.env['NODE_ENV'] !== 'production';

const baseOptions: pino.LoggerOptions = {
  level: process.env['LOG_LEVEL'] ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: { pid: process.pid },
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
};

/**
 * Creates a child logger scoped to a specific context (e.g. 'api:chat').
 * JSON in production, pretty-printed in development.
 */
export function createLogger(context: string): Logger {
  return pino(baseOptions).child({ context });
}

export type { Logger };
