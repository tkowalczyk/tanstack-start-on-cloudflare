import { useWorkerEndpoints } from '@/hooks/useWorkerEndpoints';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, Server, AlertCircle, PlayCircle } from 'lucide-react';

/**
 * Worker Endpoints Demo Component
 * Demonstrates direct Cloudflare Worker endpoints that bypass TanStack Start
 */
export function WorkerDemo() {
  const { healthMutation, echoMutation, result, error, isPending } = useWorkerEndpoints();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <Badge variant="outline" className="text-xs">
            <Server className="w-3 h-3 mr-1" />
            Worker
          </Badge>
        </div>
        <CardTitle className="text-2xl">Worker Endpoints</CardTitle>
        <CardDescription className="text-base">
          Direct Cloudflare Worker handlers that bypass TanStack Start entirely. Perfect for
          health checks, webhooks, and edge computing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => healthMutation.mutate()}
            disabled={isPending}
            variant="default"
            className="group"
          >
            {healthMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4 mr-2" />
            )}
            Health Check
          </Button>
          <Button
            onClick={() => echoMutation.mutate('Hello from client!')}
            disabled={isPending}
            variant="secondary"
          >
            {echoMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4 mr-2" />
            )}
            Echo Test
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Result Display */}
        {result != null && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Response:</p>
            <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2) ?? ''}</pre>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Path:</strong> <code>/worker/health</code>, <code>/worker/echo</code>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Handler:</strong> <code>src/core/worker/handlers.ts</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
