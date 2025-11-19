import handler from "@tanstack/react-start/server-entry";
import { handleWorkerRouteDirect } from "@/core/worker/direct-handler";

console.log("[server-entry]: using custom server entry in 'src/server.ts'");

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/worker/')) {
      const directResponse = await handleWorkerRouteDirect(request, env, ctx);
      if (directResponse) {
        return directResponse;
      }
    }

    const response = await handler.fetch(request, {
      context: { fromFetch: true },
    });

    if (response.status === 404 && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return response;
  },
};
