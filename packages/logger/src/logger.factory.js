"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
const isDev = process.env['NODE_ENV'] !== 'production';
const baseOptions = {
    level: process.env['LOG_LEVEL'] ?? 'info',
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
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
function createLogger(context) {
    return (0, pino_1.default)(baseOptions).child({ context });
}
//# sourceMappingURL=logger.factory.js.map