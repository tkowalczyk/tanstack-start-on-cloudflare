import { useMutation } from '@tanstack/react-query';

export function useWorkerEndpoints() {
  // Worker Health check mutation (direct bypass)
  const healthMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/worker/health');
      if (!response.ok) throw new Error('Health check failed');
      return response.json();
    },
    onMutate: () => {
      echoMutation.reset();
      apiStatusMutation.reset();
    },
  });

  // Worker Echo mutation (direct bypass)
  const echoMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/worker/echo', {
        method: 'POST',
        body: message,
      });
      if (!response.ok) throw new Error('Echo failed');
      return response.json();
    },
    onMutate: () => {
      healthMutation.reset();
      apiStatusMutation.reset();
    },
  });

  // API Status mutation (through TanStack Start)
  const apiStatusMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('API status check failed');
      return response.json();
    },
    onMutate: () => {
      healthMutation.reset();
      echoMutation.reset();
    },
  });

  // Combined state for worker endpoints
  const workerResult = healthMutation.data || echoMutation.data;
  const workerError = healthMutation.error || echoMutation.error;
  const workerPending = healthMutation.isPending || echoMutation.isPending;

  // API endpoint state
  const apiResult = apiStatusMutation.data;
  const apiError = apiStatusMutation.error;
  const apiPending = apiStatusMutation.isPending;

  return {
    // Worker endpoints (direct bypass)
    healthMutation,
    echoMutation,
    workerResult,
    workerError,
    workerPending,

    // API endpoints (TanStack Start)
    apiStatusMutation,
    apiResult,
    apiError,
    apiPending,

    // Legacy combined state (backward compatible)
    result: workerResult,
    error: workerError,
    isPending: workerPending,
  };
}
