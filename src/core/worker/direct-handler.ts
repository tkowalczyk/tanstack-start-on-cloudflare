import { Route as HealthRoute } from '@/routes/worker/health';
import { Route as EchoRoute } from '@/routes/worker/echo';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

const workerRoutes = [
  { path: '/worker/health', route: HealthRoute },
  { path: '/worker/echo', route: EchoRoute },
];

function getHandler(route: any, method: HttpMethod) {
  const serverConfig = route.options?.server;
  if (!serverConfig) return null;

  const handlers = typeof serverConfig.handlers === 'function'
    ? serverConfig.handlers({ createHandlers: (h: any) => h })
    : serverConfig.handlers;

  const handler = handlers?.[method];
  if (!handler) return null;

  return typeof handler === 'function' ? handler : handler.handler;
}

async function executeHandler(
  handlerFn: Function,
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  try {
    return await handlerFn({
      request,
      params: {},
      context: { env, ctx },
    });
  } catch (error) {
    console.error('[direct-handler] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleWorkerRouteDirect(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {
  const url = new URL(request.url);
  const method = request.method as HttpMethod;

  const matchedRoute = workerRoutes.find(({ path }) => url.pathname === path);
  if (!matchedRoute) return null;

  const handler = getHandler(matchedRoute.route, method);
  if (!handler) {
    return new Response('Method not allowed', { status: 405 });
  }

  return executeHandler(handler, request, env, ctx);
}
