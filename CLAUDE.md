# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server on port 3000
- `pnpm build:stage` - Build for staging environment
- `pnpm build:prod` - Build for production environment
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest

### Deployment
- `pnpm deploy:stage` - Build and deploy to Cloudflare Workers (stage environment)
- `pnpm deploy:prod` - Build and deploy to Cloudflare Workers (production environment)
- `pnpm cf-typegen` - Generate TypeScript types for Cloudflare environment variables

### Shadcn Components
- `pnpx shadcn@latest add <component>` - Add new Shadcn components (use latest version)

### Infrastructure (Terraform)
- `cd infra && terraform init` - Initialize Terraform
- `cd infra && terraform plan` - Preview infrastructure changes
- `cd infra && terraform apply` - Apply infrastructure changes (requires terraform.tfvars with credentials)

## Architecture

This is a TanStack Start application - a type-safe, client-first, full-stack React framework built on top of:

### Core Stack
- **TanStack Router**: File-based routing with type-safe navigation
- **TanStack Query**: Server state management with SSR integration
- **React 19**: Latest React with concurrent features
- **Vite**: Build tool and dev server
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS v4**: Utility-first styling with CSS variables

### Project Structure
- `src/routes/` - File-based routes (auto-generates `routeTree.gen.ts`)
- `src/components/` - Reusable React components  
- `src/integrations/tanstack-query/` - Query client setup and providers
- `src/lib/utils.ts` - Utility functions (includes clsx/tailwind-merge)
- `src/utils/seo.ts` - SEO helper functions
- Path aliases: `@/*` maps to `src/*`

### Key Architecture Patterns

**Router Setup**: The router is created via `getRouter()` in `src/router.tsx` which integrates TanStack Query context and SSR. Routes are auto-generated from the file system.

**Query Integration**: TanStack Query is pre-configured with SSR support through `setupRouterSsrQueryIntegration`. The query client is accessible in route contexts.

**Root Layout**: `src/routes/__root.tsx` defines the HTML document structure, includes devtools, and provides navigation links. It uses `createRootRouteWithContext` for type-safe context passing.

**Styling**: Uses Tailwind CSS v4 with the Vite plugin. Shadcn components are configured with "new-york" style, Zinc base color, and CSS variables enabled.

#### Adding new shadcn component

`pnpx shadcn@latest add <component>`

This will automatically install the component with the correct configuration into src/components/ui/.

**TypeScript**: Strict mode with additional linting rules (`noUnusedLocals`, `noUnusedParameters`, etc.). Uses modern ESNext module resolution.

### Cloudflare Integration

**Multi-Environment Setup**: The project supports two deployment environments (stage and prod) configured in `wrangler.jsonc`:
- **Stage**: `stage.tkow.net` - Protected by Cloudflare Access
- **Production**: `tkow.net`
- Each environment has separate worker names and environment variables

**Custom Server Entry** (`src/server.ts`): Implements a hybrid routing strategy:
- `/worker/*` endpoints - Direct handler bypass (see `src/core/worker/direct-handler.ts`)
- `/_server/*` endpoints - TanStack Start server functions
- `/api/*` endpoints - TanStack Start server routes (full framework routing)
- All other routes - TanStack Start SSR + static assets

**Direct Handler System** (`src/core/worker/direct-handler.ts`): Bypasses TanStack Start for maximum performance:
- **Auto-discovers** handlers from route files in `src/routes/worker/`
- **No manual routing** - Imports route definitions directly
- **True bypass** - Skips TanStack Start's routing layer entirely
- **Performance** - Eliminates framework overhead for `/worker/*` routes
- Routes are defined using standard `createFileRoute()` pattern
- To add new routes: Create route file + add to `workerRoutes` array

**Worker Routes** (`src/routes/worker/`): High-performance API endpoints with direct bypass:
- `/worker/health` - Health check with environment info and geolocation (GET)
- `/worker/echo` - Echo endpoint for testing (POST only)
- These routes bypass TanStack Start via the direct handler system
- Defined using `createFileRoute()` with `server.handlers` for HTTP methods
- Access Cloudflare env via `import { env } from "cloudflare:workers"`
- Use `json()` helper from `@tanstack/react-start` for responses

**API Routes** (`src/routes/api/`): Standard API endpoints through TanStack Start:
- `/api/status` - Status endpoint (example route through framework)
- These routes go through TanStack Start's full routing layer
- Use for routes that need framework features (middleware, context, etc.)

**Server Functions Pattern**: TanStack Start server functions use a composable middleware pattern:
1. Create middleware with `createMiddleware()` in `src/core/middleware/`
2. Define base function with middleware chain using `createServerFn().middleware([])`
3. Add Zod input validation with `.inputValidator()`
4. Implement handler with access to validated data, middleware context, and Cloudflare env
5. Example: `src/core/functions/example-functions.ts`

**Cloudflare Environment Variables**:
- Access via `import { env } from "cloudflare:workers"`
- Type-safe with generated types (run `pnpm cf-typegen`)
- Configured per environment in `wrangler.jsonc`

### Infrastructure & Security

**Terraform Setup** (`infra/`): Manages Cloudflare Access protection for the stage environment:
- `access.tf` - Configures Zero Trust Access with email OTP authentication
- Protects both custom domain (`stage.tkow.net`) and workers.dev subdomain
- Email allowlist managed via `allowed_emails` variable in `terraform.tfvars`
- `main.tf` - Provider configuration using API token from tfvars
- `variables.tf` - Configuration variables (zone_id, account_id, allowed_emails, etc.)

**Important**: Production environment has no Access protection by design.

### Development Notes
- Demo files (prefixed with `demo`) can be safely deleted
- The project uses pnpm as the package manager
- Devtools are included for both Router and Query in development
- Routes support loaders, error boundaries, and not-found components
- File-based routing automatically generates type-safe route definitions
- Theme support with light/dark modes via ThemeProvider in `__root.tsx`
- add to memory Adding New Components