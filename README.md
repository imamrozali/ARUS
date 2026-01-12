---

## ARUS

> **Explicit. Predictable. Near the V8 HTTP performance ceiling.**

ARUS is a minimal backend framework for TypeScript that treats HTTP requests as **data flowing through plain functions**.
It is designed for developers who want **full control, high performance, and zero magic**.

No decorators.
No dependency injection.
No reflection.
No middleware waterfalls.

Just a straight execution pipeline.

---

## Why ARUS?

Most backend frameworks trade performance and predictability for abstraction and convenience.

ARUS makes the opposite trade:

- ✅ Explicit control over request flow
- ✅ Stable performance characteristics
- ✅ Simple mental model
- ✅ Near–V8-limit performance for sync-heavy workloads
- ❌ No hidden behavior
- ❌ No implicit DI or decorators
- ❌ No plugin magic

ARUS sits **between Fastify and NestJS**:

- Closer to Fastify in performance
- Closer to NestJS in structure
- Simpler than both in execution model

---

## Core Philosophy

**Request = Data**

A request enters the system, becomes a mutable `Context`, and flows through a linear pipeline of handlers.

Each handler:

- Receives the same `Context`
- Mutates only what it owns
- Has no hidden side effects

Think of it as an **assembly line**, not a call stack.

---

## Mental Model

```
Transport
   ↓
Adapter
   ↓
Context creation
   ↓
Pipeline (handlers run in order)
   ↓
Response translation
   ↓
Transport response
```

There are:

- No middleware chains
- No branching execution paths
- No implicit async behavior

---

## Packages

- [`@arus/core`](./packages/core) - Core runtime primitives
- [`@arus/common`](./packages/common) - Shared utilities and types
- [`@arus/adapter-http`](./packages/adapter-http) - Node.js HTTP adapter
- [`@arus/adapter-fetch`](./packages/adapter-fetch) - Fetch API adapter
- [`@arus/adapter-express`](./packages/adapter-express) - Express adapter
- [`@arus/adapter-nest`](./packages/adapter-nest) - NestJS adapter

## Documentation

See [docs/](./docs) for detailed package documentation.

---

## Core Concepts

### Context

A mutable object created per request.

```ts
interface Context<Req = unknown, Res = unknown, State = {}> {
  request: Req;
  response: Res;
  state: State;
  error?: Error;
}
```

**Conventions (important):**

- `request`: treat as **read-only**
- `response`: **write-only**
- `state`: user-owned mutable space
- `error`: set to short-circuit execution

---

### Handler

A plain function.

```ts
type Handler<C extends Context = Context> = (ctx: C) => void | Promise<void>;
```

No decorators.
No injection.
No wrapping.

---

### Pipeline

A precompiled, linear execution unit.

```ts
const pipeline = new Pipeline([authHandler, businessLogic, responseHandler]);
```

- Async detection happens **once at startup**
- Sync pipelines run without `await`
- Early exit on `ctx.error`

---

### Error Model

ARUS uses a **simple error short-circuit model**.

```ts
throw new ArusError("Invalid input", "VALIDATION_FAILED", 400);
```

- Errors stop the pipeline
- No bubbling
- No middleware error chains
- Stack traces preserved

---

## Routing

Routing is **static and O(1)**.

```ts
router.addRoute({
  method: "GET",
  path: "/health",
  pipeline,
});
```

### Constraints (by design)

- ❌ No path params
- ❌ No wildcards
- ❌ No regex matching
- ✅ Exact match only

Why?
Because predictable routing is faster, simpler, and safer.

If you need dynamic paths, parse them inside handlers.

---

## Runtime Support

ARUS is **runtime-agnostic**.

Supported:

- ✅ Node.js
- ✅ Bun
- ✅ Deno
- ✅ Cloudflare Workers

This is achieved by keeping the core free of any transport or runtime dependencies.

---

## Performance Philosophy

ARUS is designed to operate **near the V8 HTTP performance ceiling**, not to win micro-benchmarks at all costs.

Key design choices:

- Sync-first hot paths
- Stable object shapes
- No per-request metadata allocation
- No reflection or runtime scanning
- Indexed loops (no iterators)

In practice:

- ARUS performs **significantly faster than Express**
- ARUS operates **close to high-performance frameworks** like Fastify for simple workloads
- Some micro-optimizations are intentionally avoided in favor of explicitness

> ARUS prioritizes _predictability_ over absolute peak throughput.

---

## What ARUS Is Not

ARUS is **not**:

- A Fastify plugin ecosystem replacement
- A decorator-heavy framework
- A batteries-included solution
- Beginner-friendly magic

If you want:

- Automatic validation
- DI containers
- Decorators
- Convention-over-configuration

You may prefer NestJS or Fastify.

---

## Who ARUS Is For

ARUS is ideal for:

- Performance-conscious teams
- Developers who understand Node/V8 fundamentals
- Infrastructure-heavy systems
- APIs where predictability matters more than convenience

---

## Quick Start

### Hello World with Node.js HTTP

```bash
npm install @arus/core @arus/adapter-http
```

```typescript
import { createServer } from 'http';
import { Pipeline, Context } from '@arus/core';
import { HttpAdapter } from '@arus/adapter-http';

type MyContext = Context<{ url: string; method: string }, { body: string }>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = 'Hello, ARUS!';
  }
]);

const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => {
  adapter.handle(req, res);
});

server.listen(3000, () => {
  console.log('ARUS server on port 3000');
});
```

### Hello World with Fetch (Cloudflare Workers)

```typescript
import { Pipeline, Context } from '@arus/core';
import { FetchAdapter } from '@arus/adapter-fetch';

type MyContext = Context<{ url: string; method: string }, { body: string }>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = 'Hello, ARUS!';
  }
]);

const adapter = new FetchAdapter(pipeline);

export default {
  fetch(request: Request): Promise<Response> {
    return adapter.handle(request);
  }
};
```

## Benchmarks

ARUS achieves within ±5% of Fastify's hello-world latency and ±8% for JSON responses.

See [benchmarks](./benchmarks) for details.

## Documentation

- [Architecture](docs/architecture.md) - System design and layers
- [Design Decisions](docs/design.md) - Key choices and trade-offs
- [Benchmarks](docs/benchmark.md) - Performance results
- [Contributing](docs/contributing.md) - Development guidelines
- [Package Docs](docs/) - Detailed package documentation

## Contributing

ARUS is designed for production use. Contributions welcome for adapters, docs, or optimizations.

## License

MIT
