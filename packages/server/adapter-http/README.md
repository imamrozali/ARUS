# @arusjs/adapter-http

Node.js HTTP adapter for ARUSJS framework. Provides native Node.js HTTP/HTTPS server integration.

## Installation

```bash
npm install @arusjs/core @arusjs/adapter-http
```

## Usage

```typescript
import { createServer } from "http";
import { Pipeline, Context } from "@arusjs/core";
import {
  HttpAdapter,
  type HttpRequest,
  type HttpResponse,
} from "@arusjs/adapter-http";

type MyContext = Context<HttpRequest, HttpResponse>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = `Hello from ${ctx.request.method} ${ctx.request.url}`;
    ctx.response.statusCode = 200;
  },
]);

const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => {
  adapter.handle(req, res);
});

server.listen(3000, () => {
  console.log("ARUSJS HTTP server on port 3000");
});
```

## API Reference

### Classes

- `HttpAdapter` - Main adapter class
  - `constructor(pipeline: Pipeline<Context<HttpRequest, HttpResponse>>)`
  - `handle(req: IncomingMessage, res: ServerResponse): Promise<void>`

### Types

- `HttpRequest` - Request shape: { url, method, headers, body? }
- `HttpResponse` - Response shape: { statusCode, headers, body? }

## Notes

- Body parsing omitted for simplicity; handle in handlers
- Headers include potential undefined values from Node.js
- Error responses are basic JSON; customize in handlers
