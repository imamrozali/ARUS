# @arus/adapter-express

Express.js adapter.

## Installation

```bash
npm install @arus/core @arus/adapter-express express
```

## Usage

```typescript
import express from 'express';
import { Pipeline } from '@arus/core';
import { ExpressAdapter } from '@arus/adapter-express';

const pipeline = new Pipeline([handler]);
const adapter = new ExpressAdapter(pipeline);

const app = express();
app.use('/api', (req, res) => adapter.handle(req, res));
```

## API

- `ExpressAdapter(pipeline)`
- `handle(req, res)`

See [main README](../../README.md) for full example.