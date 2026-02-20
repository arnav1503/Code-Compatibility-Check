import { z } from 'zod';

export const api = {
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({
        message: z.string()
      }),
      responses: {
        200: z.object({
          response: z.string()
        }),
        400: z.object({ message: z.string() }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ChatInput = z.infer<typeof api.chat.send.input>;
export type ChatResponse = z.infer<typeof api.chat.send.responses[200]>;
