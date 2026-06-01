"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIProvider = void 0;
const shared_types_1 = require("../../../shared-types/src");
const base_provider_1 = require("./base.provider");
/**
 * Mock provider for local development and testing.
 * No API keys required. Simulates realistic streaming behavior.
 */
class MockAIProvider extends base_provider_1.BaseAIProvider {
    providerName = shared_types_1.ModelProvider.MOCK;
    modelName = 'mock-model-v1';
    async _chat(messages, _options) {
        const lastMessage = messages[messages.length - 1]?.content ?? '';
        return {
            id: `mock-${Date.now()}`,
            content: `[MOCK] Echo: "${lastMessage.slice(0, 50)}"`,
            model: this.modelName,
            provider: shared_types_1.ModelProvider.MOCK,
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            finishReason: 'stop',
        };
    }
    async *_stream(messages, _options) {
        const lastMessage = messages[messages.length - 1]?.content ?? '';
        const response = `[MOCK STREAM] You said: "${lastMessage.slice(0, 50)}"`;
        const words = response.split(' ');
        for (let i = 0; i < words.length; i++) {
            await new Promise((r) => setTimeout(r, 50));
            yield {
                id: `mock-stream-${i}`,
                delta: (i === 0 ? '' : ' ') + words[i],
                index: i,
                done: false,
            };
        }
        yield { id: 'mock-stream-done', delta: '', index: words.length, done: true };
    }
    async _embed(request) {
        const texts = Array.isArray(request.text) ? request.text : [request.text];
        return {
            embeddings: texts.map(() => Array.from({ length: 1536 }, () => Math.random())),
            model: 'mock-embedding-v1',
            usage: { promptTokens: 10, completionTokens: 0, totalTokens: 10 },
        };
    }
}
exports.MockAIProvider = MockAIProvider;
//# sourceMappingURL=mock.provider.js.map