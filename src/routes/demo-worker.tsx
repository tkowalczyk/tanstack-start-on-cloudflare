import { createFileRoute } from '@tanstack/react-router';
import { WorkerDemo } from '@/components/demo/worker-demo';
import { Badge } from '@/components/ui/badge';
import { Code2 } from 'lucide-react';

export const Route = createFileRoute('/demo-worker')({
  component: DemoWorker,
});

function DemoWorker() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <HeroSection />
      <DemoSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative px-6 lg:px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="secondary" className="mb-4">
          <Code2 className="w-3 h-3 mr-2" />
          Interactive Example
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Worker Endpoints
          <span className="block text-primary">Demo</span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Direct Cloudflare Worker endpoints that bypass TanStack Start for maximum performance
          and edge computing capabilities.
        </p>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section className="px-6 lg:px-8 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <WorkerDemo />
      </div>
    </section>
  );
}
