"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebEnv = getWebEnv;
const zod_1 = require("zod");
const webEnvSchema = zod_1.z.object({
    VITE_API_URL: zod_1.z.string().url().default('http://localhost:3000/api/v1'),
    VITE_SOCKET_URL: zod_1.z.string().url().default('http://localhost:3000'),
    VITE_APP_NAME: zod_1.z.string().default('AI Platform'),
});
function getWebEnv() {
    const result = webEnvSchema.safeParse({
        VITE_API_URL: import.meta.env['VITE_API_URL'],
        VITE_SOCKET_URL: import.meta.env['VITE_SOCKET_URL'],
        VITE_APP_NAME: import.meta.env['VITE_APP_NAME'],
    });
    if (!result.success) {
        throw new Error(`Invalid web env: ${result.error.message}`);
    }
    return result.data;
}
//# sourceMappingURL=web.env.js.map