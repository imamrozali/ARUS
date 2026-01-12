# @arusjs/adapter-fetch

Fetch API adapter for Bun, Deno, Workers.

## Installation

```bash
npm install @arusjs/core @arusjs/adapter-fetch
```

## Usage

```typescript
import { Pipeline } from "@arusjs/core";
import { FetchAdapter } from "@arusjs/adapter-fetch";

const pipeline = new Pipeline([handler]);
const adapter = new FetchAdapter(pipeline);

export default {
  fetch: (request) => adapter.handle(request),
};
```

## API

- `FetchAdapter(pipeline)`
- `handle(request)`

See [main README](../../README.md) for full example.
