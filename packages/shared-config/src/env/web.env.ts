import { z } from 'zod';

const webEnvSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_SOCKET_URL: z.string().url().default('http://localhost:3000'),
  VITE_APP_NAME: z.string().default('AI Platform'),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export function getWebEnv(): WebEnv {
  const result = webEnvSchema.safeParse({
    // @ts-ignore: Vite replaces this at build time, TS CJS complains
    VITE_API_URL: import.meta.env['VITE_API_URL'],
    // @ts-ignore
    VITE_SOCKET_URL: import.meta.env['VITE_SOCKET_URL'],
    // @ts-ignore
    VITE_APP_NAME: import.meta.env['VITE_APP_NAME'],
  });
  if (!result.success) {
    throw new Error(`Invalid web env: ${result.error.message}`);
  }
  return result.data;
}
