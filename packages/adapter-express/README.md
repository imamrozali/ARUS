# @arus/adapter-express

Express.js adapter for ARUS framework. Enables gradual migration from Express to ARUS.

## Installation

```bash
npm install @arus/core @arus/adapter-express express
```

## Usage

```typescript
import express from 'express';
import { Pipeline, Context } from '@arus/core';
import { ExpressAdapter, type ExpressRequest, type ExpressResponse } from '@arus/adapter-express';

type MyContext = Context<ExpressRequest, ExpressResponse>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = `Hello from ${ctx.request.method} ${ctx.request.url}`;
    ctx.response.statusCode = 200;
  }
]);

const adapter = new ExpressAdapter(pipeline);

const app = express();

// Use as middleware
app.use('/api', (req, res, next) => {
  adapter.handle(req, res);
});

// Or handle specific routes
app.get('/arus', (req, res) => {
  adapter.handle(req, res);
});

app.listen(3000, () => {
  console.log('Express with ARUS on port 3000');
});
```

## API Reference

### Classes

- `ExpressAdapter` - Main adapter class
  - `constructor(pipeline: Pipeline<Context<ExpressRequest, ExpressResponse>>)`
  - `handle(req: Request, res: Response): Promise<void>`

### Types

- `ExpressRequest` - Request shape: { url, method, headers, body }
- `ExpressResponse` - Response shape: { statusCode, headers, body? }

## Notes

- Leverages Express middleware system for compatibility
- Body parsing handled by Express; available in ctx.request.body
- Error responses use Express res.json; customize in handlers