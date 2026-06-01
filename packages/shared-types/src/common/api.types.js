"use strict";
// ─── Common Types ────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // Auth
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    // Validation
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    // Resources
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["CONFLICT"] = "CONFLICT";
    // AI
    ErrorCode["AI_PROVIDER_ERROR"] = "AI_PROVIDER_ERROR";
    ErrorCode["AI_RATE_LIMITED"] = "AI_RATE_LIMITED";
    ErrorCode["AI_CONTEXT_TOO_LONG"] = "AI_CONTEXT_TOO_LONG";
    // Jobs
    ErrorCode["JOB_FAILED"] = "JOB_FAILED";
    ErrorCode["JOB_NOT_FOUND"] = "JOB_NOT_FOUND";
    // Server
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=api.types.js.map