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
 * and compares them with API endpoints that go through TanStack Start
 */
export function WorkerDemo() {
  const {
    healthMutation,
    echoMutation,
    workerResult,
    workerError,
    workerPending,
    apiStatusMutation,
    apiResult,
    apiError,
    apiPending,
  } = useWorkerEndpoints();

  const [workerCopied, setWorkerCopied] = useState(false);
  const [apiCopied, setApiCopied] = useState(false);
  const [isWorkerResponseOpen, setIsWorkerResponseOpen] = useState(true);
  const [isApiResponseOpen, setIsApiResponseOpen] = useState(true);
  const [workerMetadata, setWorkerMetadata] = useState<ResponseMetadata | null>(null);
  const [apiMetadata, setApiMetadata] = useState<ResponseMetadata | null>(null);
  const [workerStartTime, setWorkerStartTime] = useState<number | null>(null);
  const [apiStartTime, setApiStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (workerResult) {
      setIsWorkerResponseOpen(true);
      if (workerStartTime) {
        const responseTime = Date.now() - workerStartTime;
        setWorkerMetadata({
          timestamp: new Date().toLocaleString(),
          responseTime,
        });
      }
    }
  }, [workerResult, workerStartTime]);

  useEffect(() => {
    if (apiResult) {
      setIsApiResponseOpen(true);
      if (apiStartTime) {
        const responseTime = Date.now() - apiStartTime;
        setApiMetadata({
          timestamp: new Date().toLocaleString(),
          responseTime,
        });
      }
    }
  }, [apiResult, apiStartTime]);

  const handleWorkerCopy = async () => {
    if (workerResult) {
      await navigator.clipboard.writeText(JSON.stringify(workerResult, null, 2));
      setWorkerCopied(true);
      setTimeout(() => setWorkerCopied(false), 2000);
    }
  };

  const handleApiCopy = async () => {
    if (apiResult) {
      await navigator.clipboard.writeText(JSON.stringify(apiResult, null, 2));
      setApiCopied(true);
      setTimeout(() => setApiCopied(false), 2000);
    }
  };

  const handleHealthCheck = () => {
    setWorkerStartTime(Date.now());
    healthMutation.mutate();
  };

  const handleEchoTest = () => {
    setWorkerStartTime(Date.now());
    echoMutation.mutate('Hello from client!');
  };

  const handleApiStatus = () => {
    setApiStartTime(Date.now());
    apiStatusMutation.mutate();
  };

  const formatJSON = (data: unknown) => {
    return JSON.stringify(data, null, 2);
  };

  const getEndpointType = (result: unknown) => {
    if (!result) return null;
    if ('status' in (result as Record<string, unknown>)) return 'Health Check';
    if ('echoed' in (result as Record<string, unknown>)) return 'Echo Response';
    return 'Response';
  };

  const getLocationInfo = (result: unknown) => {
    if (result && typeof result === 'object' && 'colo' in result) {
      return (result as { colo: string; city?: string }).colo;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Worker Endpoints (Direct Bypass) */}
      <Card className="group hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/15">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">
              <Server className="w-3 h-3 mr-1" />
              Direct Bypass
            </Badge>
          </div>
          <CardTitle className="text-2xl">Worker Endpoints</CardTitle>
          <CardDescription className="text-base">
            Direct Cloudflare Worker handlers that bypass TanStack Start entirely. Maximum
            performance for health checks, webhooks, and edge computing.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleHealthCheck}
              disabled={workerPending}
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
              disabled={workerPending}
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
          {workerError && (
            <Alert className="border-destructive/50 bg-destructive/10 animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-medium">
                <strong>Error:</strong> {workerError.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {workerResult != null && (
            <div className="space-y-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <Collapsible open={isWorkerResponseOpen} onOpenChange={setIsWorkerResponseOpen}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isWorkerResponseOpen ? 'rotate-180' : ''
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <p className="text-sm font-semibold text-foreground">Response</p>
                    {getEndpointType(workerResult) && (
                      <Badge variant="secondary" className="text-xs">
                        {getEndpointType(workerResult)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWorkerCopy}
                    className="h-8 gap-2 transition-colors"
                  >
                    {workerCopied ? (
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
                      {formatJSON(workerResult)}
                    </pre>
                  </div>

                  {/* Response Metadata */}
                  {workerMetadata && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
                      {workerMetadata.timestamp && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{workerMetadata.timestamp}</span>
                        </div>
                      )}
                      {workerMetadata.responseTime && (
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5" />
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {workerMetadata.responseTime}ms
                          </span>
                        </div>
                      )}
                      {getLocationInfo(workerResult) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{getLocationInfo(workerResult)}</span>
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
                  src/core/worker/direct-handler.ts
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints (TanStack Start) */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 transition-all duration-300 group-hover:bg-blue-500/15">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <Badge variant="outline" className="text-xs border-blue-500/50">
              <Code2 className="w-3 h-3 mr-1" />
              TanStack Start
            </Badge>
          </div>
          <CardTitle className="text-2xl">API Endpoints</CardTitle>
          <CardDescription className="text-base">
            Standard API endpoints that go through TanStack Start's full routing layer. Framework
            features like middleware, context, and SSR integration available.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action Button */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleApiStatus}
              disabled={apiPending}
              variant="default"
              className="min-w-[140px] transition-all bg-blue-600 hover:bg-blue-700"
            >
              {apiStatusMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4 mr-2" />
              )}
              Status Check
            </Button>
          </div>

          {/* Error Display */}
          {apiError && (
            <Alert className="border-destructive/50 bg-destructive/10 animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-medium">
                <strong>Error:</strong> {apiError.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {apiResult != null && (
            <div className="space-y-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <Collapsible open={isApiResponseOpen} onOpenChange={setIsApiResponseOpen}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isApiResponseOpen ? 'rotate-180' : ''
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <p className="text-sm font-semibold text-foreground">Response</p>
                    <Badge variant="secondary" className="text-xs">
                      Status Check
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleApiCopy}
                    className="h-8 gap-2 transition-colors"
                  >
                    {apiCopied ? (
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
                      {formatJSON(apiResult)}
                    </pre>
                  </div>

                  {/* Response Metadata */}
                  {apiMetadata && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
                      {apiMetadata.timestamp && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{apiMetadata.timestamp}</span>
                        </div>
                      )}
                      {apiMetadata.responseTime && (
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5" />
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {apiMetadata.responseTime}ms
                          </span>
                        </div>
                      )}
                      {getLocationInfo(apiResult) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{getLocationInfo(apiResult)}</span>
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
                <p className="text-xs font-semibold text-foreground">Endpoint</p>
                <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  GET /api/status
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3">
              <Server className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">Routing</p>
                <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground break-all">
                  TanStack Start (full framework)
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Note */}
      {workerMetadata?.responseTime && apiMetadata?.responseTime && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <AlertDescription className="w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="whitespace-nowrap">Performance Comparison:</strong>
              <span className="whitespace-nowrap">
                Worker endpoint (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  {workerMetadata.responseTime}ms
                </span>
                )
              </span>
              <span className="whitespace-nowrap">
                vs API endpoint (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {apiMetadata.responseTime}ms
                </span>
                )
              </span>
              <span className="whitespace-nowrap">
                ={' '}
                <span className="font-semibold">
                  {((apiMetadata.responseTime / workerMetadata.responseTime) * 100 - 100).toFixed(0)}%{' '}
                  {apiMetadata.responseTime > workerMetadata.responseTime ? 'slower' : 'faster'}
                </span>
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
