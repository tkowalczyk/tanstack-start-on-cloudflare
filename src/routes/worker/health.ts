import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';

export const Route = createFileRoute('/worker/health')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return json(
          {
            status: 'ok',
            timestamp: Date.now(),
            message: 'Worker endpoint is healthy',
            env: env.MY_VAR,
            lat: request.cf?.latitude,
            lon: request.cf?.longitude,
          },
          { status: 200 }
        );
      },
    },
  },
});
