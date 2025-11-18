/**
 * Cloudflare Workers entry point
 * Handles routing between worker endpoints and TanStack Start
 */
import handler from "@tanstack/react-start/server-entry";
import { handleWorkerEndpoint } from "@/core/worker/handlers";

console.log("[server-entry]: using custom server entry in 'src/server.ts'");

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Worker endpoints (bypass TanStack Start)
    if (url.pathname.startsWith('/worker/')) {
      return handleWorkerEndpoint(url.pathname, request, env);
    }

    // TanStack Start (server functions + SSR)
    const response = await handler.fetch(request, {
      context: { fromFetch: true },
    });

    // Fallback to static assets on 404
    if (response.status === 404 && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return response;
  },
};
