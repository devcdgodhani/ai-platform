import { z } from 'zod';
declare const webEnvSchema: z.ZodObject<{
    VITE_API_URL: z.ZodDefault<z.ZodString>;
    VITE_SOCKET_URL: z.ZodDefault<z.ZodString>;
    VITE_APP_NAME: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    VITE_API_URL: string;
    VITE_SOCKET_URL: string;
    VITE_APP_NAME: string;
}, {
    VITE_API_URL?: string | undefined;
    VITE_SOCKET_URL?: string | undefined;
    VITE_APP_NAME?: string | undefined;
}>;
export type WebEnv = z.infer<typeof webEnvSchema>;
export declare function getWebEnv(): WebEnv;
export {};
//# sourceMappingURL=web.env.d.ts.map