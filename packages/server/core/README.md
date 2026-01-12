# ARUSJS Framework

A high-performance, explicit backend framework for TypeScript.

## Design Constraints

- **Explicitness First**: Everything is predictable. No decorators, no DI, no middleware chains.
- **Performance Target**: Within ±5% of Fastify in hello-world & JSON benchmarks.
- **Runtime Agnostic**: Core works in Node.js, Bun, Deno, Cloudflare Workers.
- **Linear Execution**: Requests flow through handlers sequentially. No branching.
- **Sync Hot Path**: Pipelines determine async/sync at startup for optimal performance.

## Routing Limitations

ARUSJS Router is O(1) static routing only. It does not support:

- Parameterized routes (e.g., `/users/:id`)
- Wildcards (e.g., `/files/*`)
- Regex patterns

Use static paths like `/users/123`. For dynamic routing, handle in handlers by parsing `ctx.request.url`.

Path matching is strict: `/users` ≠ `/users/`.

## Common Mistakes

- **Async Handlers**: Declare as `async function` to ensure correct pipeline execution. Sync pipelines will throw in development if a handler returns a Promise.
- **Context Mutability**: `ctx.request` is readonly by convention. `ctx.response` is write-only. `ctx.state` is user-owned.
- **Error Handling**: Errors are stored in `ctx.error`. Do not throw in handlers—set `ctx.error` instead.
- **Adapter Bodies**: FetchAdapter buffers bodies by default. For streaming, implement custom adapter.

## Benchmarks

Run `npm run bench` for autocannon comparisons with Fastify.
