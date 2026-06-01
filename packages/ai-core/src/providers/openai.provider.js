"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
const shared_types_1 = require("../../../shared-types/src");
const base_provider_1 = require("./base.provider");
class OpenAIProvider extends base_provider_1.BaseAIProvider {
    providerName = shared_types_1.ModelProvider.OPENAI;
    modelName;
    client;
    constructor(apiKey, model = 'gpt-4o') {
        super();
        this.client = new openai_1.default({ apiKey });
        this.modelName = model;
    }
    async _chat(messages, options) {
        const response = await this.client.chat.completions.create({
            model: options?.model ?? this.modelName,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 4096,
        });
        const choice = response.choices[0];
        if (!choice)
            throw new Error('No completion choice returned');
        return {
            id: response.id,
            content: choice.message.content ?? '',
            model: response.model,
            provider: shared_types_1.ModelProvider.OPENAI,
            usage: {
                promptTokens: response.usage?.prompt_tokens ?? 0,
                completionTokens: response.usage?.completion_tokens ?? 0,
                totalTokens: response.usage?.total_tokens ?? 0,
            },
            finishReason: choice.finish_reason ?? 'stop',
        };
    }
    async *_stream(messages, options) {
        const stream = await this.client.chat.completions.create({
            model: options?.model ?? this.modelName,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 4096,
            stream: true,
        });
        let index = 0;
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta.content ?? '';
            const done = chunk.choices[0]?.finish_reason != null;
            yield { id: chunk.id, delta, index: index++, done };
            if (done)
                break;
        }
    }
    async _embed(request) {
        const input = Array.isArray(request.text) ? request.text : [request.text];
        const response = await this.client.embeddings.create({
            model: request.model ?? 'text-embedding-3-small',
            input,
        });
        return {
            embeddings: response.data.map((d) => d.embedding),
            model: response.model,
            usage: {
                promptTokens: response.usage.prompt_tokens,
                completionTokens: 0,
                totalTokens: response.usage.total_tokens,
            },
        };
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.provider.js.map