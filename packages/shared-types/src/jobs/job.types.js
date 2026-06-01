"use strict";
// ─── Job Types ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatus = exports.QueueName = void 0;
var QueueName;
(function (QueueName) {
    QueueName["AI_INFERENCE"] = "ai-inference";
    QueueName["EMBEDDINGS"] = "embeddings";
    QueueName["DOCUMENT_PROCESSING"] = "document-processing";
    QueueName["NOTIFICATIONS"] = "notifications";
})(QueueName || (exports.QueueName = QueueName = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["WAITING"] = "waiting";
    JobStatus["ACTIVE"] = "active";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
    JobStatus["DELAYED"] = "delayed";
    JobStatus["PAUSED"] = "paused";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
//# sourceMappingURL=job.types.js.map