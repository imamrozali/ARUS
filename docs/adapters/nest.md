# @arusjs/adapter-nest

NestJS adapter.

## Installation

```bash
npm install @arusjs/core @arusjs/adapter-nest @nestjs/core @nestjs/common reflect-metadata
```

## Usage

```typescript
import { Injectable } from "@nestjs/common";
import { Pipeline } from "@arusjs/core";
import { NestAdapter } from "@arusjs/adapter-nest";

@Injectable()
export class ArusService {
  private adapter = new NestAdapter(new Pipeline([handler]));

  handle(req, res) {
    return this.adapter.handle(req, res);
  }
}
```

## API

- `NestAdapter(pipeline)`
- `handle(req, res)`

See [main README](../../README.md) for full example.
