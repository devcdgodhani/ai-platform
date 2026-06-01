"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_CONFIG = void 0;
const shared_types_1 = require("../../../shared-types/src");
exports.QUEUE_CONFIG = {
    [shared_types_1.QueueName.AI_INFERENCE]: {
        concurrency: 5,
        attempts: 3,
        backoff: 2000,
    },
    [shared_types_1.QueueName.EMBEDDINGS]: {
        concurrency: 3,
        attempts: 5,
        backoff: 1000,
    },
    [shared_types_1.QueueName.DOCUMENT_PROCESSING]: {
        concurrency: 2,
        attempts: 3,
        backoff: 5000,
    },
    [shared_types_1.QueueName.NOTIFICATIONS]: {
        concurrency: 10,
        attempts: 3,
        backoff: 500,
    },
};
//# sourceMappingURL=queue.constants.js.map