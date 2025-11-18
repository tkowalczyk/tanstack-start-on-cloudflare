import { useState, useEffect } from 'react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Loader2,
  Zap,
  Server,
  AlertCircle,
  PlayCircle,
  Copy,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponseMetadata {
  timestamp: string;
  responseTime?: number;
}

/**
 * Worker Endpoints Demo Component
 * Demonstrates direct Cloudflare Worker endpoints that bypass TanStack Start
 */
export function WorkerDemo() {
  const { healthMutation, echoMutation, result, error, isPending } = useWorkerEndpoints();
  const [copied, setCopied] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(true);
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (result) {
      setIsResponseOpen(true);
      if (startTime) {
        const responseTime = Date.now() - startTime;
        setMetadata({
          timestamp: new Date().toLocaleString(),
          responseTime,
        });
      }
    }
  }, [result, startTime]);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHealthCheck = () => {
    setStartTime(Date.now());
    healthMutation.mutate();
  };

  const handleEchoTest = () => {
    setStartTime(Date.now());
    echoMutation.mutate('Hello from client!');
  };

  const formatJSON = (data: unknown) => {
    return JSON.stringify(data, null, 2);
  };

  const getEndpointType = () => {
    if (!result) return null;
    if ('status' in (result as Record<string, unknown>)) return 'Health Check';
    if ('echo' in (result as Record<string, unknown>)) return 'Echo Response';
    return 'Response';
  };

  const getLocationInfo = () => {
    if (result && typeof result === 'object' && 'colo' in result) {
      return (result as { colo: string; city?: string }).colo;
    }
    return null;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/15">
            <Zap className="h-6 w-6 text-primary" />
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
            onClick={handleHealthCheck}
            disabled={isPending}
            variant="default"
            className="min-w-[140px] transition-all"
          >
            {healthMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4 mr-2" />
            )}
            Health Check
          </Button>
          <Button
            onClick={handleEchoTest}
            disabled={isPending}
            variant="secondary"
            className="min-w-[140px] transition-all"
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
          <Alert className="border-destructive/50 bg-destructive/10 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              <strong>Error:</strong> {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Result Display */}
        {result != null && (
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <Collapsible open={isResponseOpen} onOpenChange={setIsResponseOpen}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isResponseOpen ? 'rotate-180' : ''
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <p className="text-sm font-semibold text-foreground">Response</p>
                  {getEndpointType() && (
                    <Badge variant="secondary" className="text-xs">
                      {getEndpointType()}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <CollapsibleContent className="space-y-2">
                <div className="rounded-lg bg-muted/50 border border-border p-4 mt-2">
                  <pre className="text-xs overflow-auto font-mono leading-relaxed text-foreground break-all">
                    {formatJSON(result)}
                  </pre>
                </div>

                {/* Response Metadata */}
                {metadata && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
                    {metadata.timestamp && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{metadata.timestamp}</span>
                      </div>
                    )}
                    {metadata.responseTime && (
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" />
                        <span>{metadata.responseTime}ms</span>
                      </div>
                    )}
                    {getLocationInfo() && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{getLocationInfo()}</span>
                      </div>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Endpoints</p>
              <div className="flex flex-wrap gap-2">
                <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  GET /worker/health
                </code>
                <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  POST /worker/echo
                </code>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-3">
            <Server className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Handler</p>
              <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground break-all">
                src/core/worker/handlers.ts
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
