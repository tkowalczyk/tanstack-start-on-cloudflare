import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';

export const Route = createFileRoute('/api/status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return json(
          {
            status: 'ok',
            timestamp: Date.now(),
            message: 'API endpoint via TanStack Start',
            env: env.MY_VAR,
            lat: request.cf?.latitude,
            lon: request.cf?.longitude,
            routing: 'TanStack Start (full framework routing)',
          },
          { status: 200 }
        );
      },
    },
  },
});
