/**
 * Worker endpoint handlers
 * These bypass TanStack Start and run directly on Cloudflare Workers
 */

type WorkerHandler = (request: Request, env: Env) => Promise<Response> | Response;

/**
 * Health check endpoint
 * Returns worker status and environment info
 */
export const healthHandler: WorkerHandler = (request, env) => {
  console.log('[Worker] Health check endpoint');

  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: Date.now(),
      message: 'Worker endpoint is healthy',
      env: env.MY_VAR,
      lat: request.cf?.latitude,
      lon: request.cf?.longitude,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

/**
 * Echo endpoint
 * Returns the request body back to the client
 */
export const echoHandler: WorkerHandler = async (request, env) => {
  console.log('[Worker] Echo endpoint');

  const body = await request.text();

  return new Response(
    JSON.stringify({
      echoed: body,
      receivedAt: Date.now(),
      env: env.MY_VAR,
      clientCity: request.cf?.city,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

/**
 * Router for worker endpoints
 * Maps URL paths to handler functions
 */
export async function handleWorkerEndpoint(
  pathname: string,
  request: Request,
  env: Env
): Promise<Response> {
  // Route to appropriate handler
  switch (pathname) {
    case '/worker/health':
      return healthHandler(request, env);

    case '/worker/echo':
      if (request.method === 'POST') {
        return echoHandler(request, env);
      }
      return new Response('Method not allowed', { status: 405 });

    default:
      return new Response(
        JSON.stringify({
          error: 'Worker endpoint not found',
          path: pathname,
          availableEndpoints: ['/worker/health', '/worker/echo'],
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
  }
}
