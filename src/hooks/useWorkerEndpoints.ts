import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook for worker endpoint mutations
 * Handles health check and echo endpoint calls
 */
export function useWorkerEndpoints() {
  // Health check mutation
  const healthMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/worker/health');
      if (!response.ok) throw new Error('Health check failed');
      return response.json();
    },
    onMutate: () => {
      echoMutation.reset();
    },
    onSuccess: (data) => {
      console.log('[Client] Health check success:', data);
    },
    onError: (error) => {
      console.error('[Client] Health check error:', error);
    },
  });

  // Echo mutation
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
    },
    onSuccess: (data) => {
      console.log('[Client] Echo success:', data);
    },
    onError: (error) => {
      console.error('[Client] Echo error:', error);
    },
  });

  // Combined state
  const result = healthMutation.data || echoMutation.data;
  const error = healthMutation.error || echoMutation.error;
  const isPending = healthMutation.isPending || echoMutation.isPending;

  return {
    healthMutation,
    echoMutation,
    result,
    error,
    isPending,
  };
}
