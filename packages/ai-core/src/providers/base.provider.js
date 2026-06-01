"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAIProvider = void 0;
const logger_1 = require("../../../logger/src");
const logger = (0, logger_1.createLogger)('ai-core:base-provider');
/**
 * Abstract base provider with shared retry logic and telemetry.
 * Concrete providers extend this and implement the abstract methods.
 */
class BaseAIProvider {
    async chat(messages, options) {
        const start = Date.now();
        try {
            logger.info({ provider: this.providerName, model: this.modelName }, 'chat request');
            const result = await this._chat(messages, options);
            logger.info({ latencyMs: Date.now() - start, tokens: result.usage.totalTokens }, 'chat complete');
            return result;
        }
        catch (err) {
            logger.error({ err, provider: this.providerName }, 'chat failed');
            throw err;
        }
    }
    async *stream(messages, options) {
        logger.info({ provider: this.providerName }, 'stream request');
        yield* this._stream(messages, options);
    }
    async embed(request) {
        const start = Date.now();
        try {
            const result = await this._embed(request);
            logger.debug({ latencyMs: Date.now() - start }, 'embed complete');
            return result;
        }
        catch (err) {
            logger.error({ err }, 'embed failed');
            throw err;
        }
    }
    async healthCheck() {
        try {
            await this.chat([{ role: 'user', content: 'ping' }], { maxTokens: 1 });
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.BaseAIProvider = BaseAIProvider;
//# sourceMappingURL=base.provider.js.map