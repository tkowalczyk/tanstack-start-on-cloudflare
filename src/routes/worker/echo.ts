import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';

export const Route = createFileRoute('/worker/echo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();

        return json({
          echoed: body,
          receivedAt: Date.now(),
          env: env.MY_VAR,
          clientCity: request.cf?.city,
        });
      },
    },
  },
});
