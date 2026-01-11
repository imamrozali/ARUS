# @arus/adapter-fetch

Fetch API adapter for ARUS framework. Enables ARUS to run in Bun, Deno, and Cloudflare Workers.

## Installation

```bash
npm install @arus/core @arus/adapter-fetch
```

## Usage

```typescript
import { Pipeline, Context } from '@arus/core';
import { FetchAdapter, type FetchRequest, type FetchResponse } from '@arus/adapter-fetch';

type MyContext = Context<FetchRequest, FetchResponse>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = `Hello from ${ctx.request.method} ${ctx.request.url}`;
    ctx.response.status = 200;
  }
]);

const adapter = new FetchAdapter(pipeline);

// In Cloudflare Workers
export default {
  fetch(request: Request): Promise<Response> {
    return adapter.handle(request);
  }
};

// In Bun/Deno
const server = Bun.serve({
  port: 3000,
  fetch: (request) => adapter.handle(request)
});
```

## API Reference

### Classes

- `FetchAdapter` - Main adapter class
  - `constructor(pipeline: Pipeline<Context<FetchRequest, FetchResponse>>)`
  - `handle(request: Request): Promise<Response>`

### Types

- `FetchRequest` - Request shape: { url, method, headers, body? }
- `FetchResponse` - Response shape: { status, headers, body? }

## Notes

- Body is buffered on read for simplicity
- Headers are converted to/from Web API format
- Error responses are basic JSON; customize in handlers