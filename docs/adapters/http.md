# @arus/adapter-http

Node.js HTTP adapter.

## Installation

```bash
npm install @arus/core @arus/adapter-http
```

## Usage

```typescript
import { createServer } from 'http';
import { Pipeline, Context } from '@arus/core';
import { HttpAdapter } from '@arus/adapter-http';

const pipeline = new Pipeline([handler]);
const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => adapter.handle(req, res));
server.listen(3000);
```

## API

- `HttpAdapter(pipeline)`
- `handle(req, res)`

See [main README](../../README.md) for full example.