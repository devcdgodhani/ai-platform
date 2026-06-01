"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const shared_types_1 = require("../../../shared-types/src");
const base_provider_1 = require("./base.provider");
class AnthropicProvider extends base_provider_1.BaseAIProvider {
    providerName = shared_types_1.ModelProvider.ANTHROPIC;
    modelName;
    client;
    constructor(apiKey, model = 'claude-3-5-sonnet-20241022') {
        super();
        this.client = new sdk_1.default({ apiKey });
        this.modelName = model;
    }
    async _chat(messages, options) {
        const systemMessages = messages.filter((m) => m.role === 'system');
        const userMessages = messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role, content: m.content }));
        const response = await this.client.messages.create({
            model: options?.model ?? this.modelName,
            max_tokens: options?.maxTokens ?? 4096,
            system: systemMessages.map((m) => m.content).join('\n') || undefined,
            messages: userMessages,
        });
        const textBlock = response.content.find((b) => b.type === 'text');
        return {
            id: response.id,
            content: textBlock?.type === 'text' ? textBlock.text : '',
            model: response.model,
            provider: shared_types_1.ModelProvider.ANTHROPIC,
            usage: {
                promptTokens: response.usage.input_tokens,
                completionTokens: response.usage.output_tokens,
                totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            },
            finishReason: response.stop_reason === 'end_turn' ? 'stop' : 'length',
        };
    }
    async *_stream(messages, options) {
        const systemMessages = messages.filter((m) => m.role === 'system');
        const userMessages = messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role, content: m.content }));
        const stream = this.client.messages.stream({
            model: options?.model ?? this.modelName,
            max_tokens: options?.maxTokens ?? 4096,
            system: systemMessages.map((m) => m.content).join('\n') || undefined,
            messages: userMessages,
        });
        let index = 0;
        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                yield { id: `anthropic-${index}`, delta: event.delta.text, index: index++, done: false };
            }
            if (event.type === 'message_stop') {
                yield { id: `anthropic-done`, delta: '', index: index++, done: true };
            }
        }
    }
    /** Anthropic does not provide embeddings — throw to force OpenAI usage */
    async _embed(_request) {
        throw new Error('Anthropic does not support embeddings. Use OpenAI provider for embeddings.');
    }
}
exports.AnthropicProvider = AnthropicProvider;
//# sourceMappingURL=anthropic.provider.js.map