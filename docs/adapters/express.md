# @arusjs/adapter-express

Express.js adapter.

## Installation

```bash
npm install @arusjs/core @arusjs/adapter-express express
```

## Usage

```typescript
import express from "express";
import { Pipeline } from "@arusjs/core";
import { ExpressAdapter } from "@arusjs/adapter-express";

const pipeline = new Pipeline([handler]);
const adapter = new ExpressAdapter(pipeline);

const app = express();
app.use("/api", (req, res) => adapter.handle(req, res));
```

## API

- `ExpressAdapter(pipeline)`
- `handle(req, res)`

See [main README](../../README.md) for full example.
