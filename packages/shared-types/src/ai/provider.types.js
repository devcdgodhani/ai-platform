"use strict";
// ─── AI Provider Types ─────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRole = exports.ModelProvider = void 0;
var ModelProvider;
(function (ModelProvider) {
    ModelProvider["OPENAI"] = "openai";
    ModelProvider["ANTHROPIC"] = "anthropic";
    ModelProvider["MOCK"] = "mock";
})(ModelProvider || (exports.ModelProvider = ModelProvider = {}));
var MessageRole;
(function (MessageRole) {
    MessageRole["USER"] = "user";
    MessageRole["ASSISTANT"] = "assistant";
    MessageRole["SYSTEM"] = "system";
    MessageRole["TOOL"] = "tool";
})(MessageRole || (exports.MessageRole = MessageRole = {}));
//# sourceMappingURL=provider.types.js.map