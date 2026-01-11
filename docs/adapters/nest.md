# @arus/adapter-nest

NestJS adapter.

## Installation

```bash
npm install @arus/core @arus/adapter-nest @nestjs/core @nestjs/common reflect-metadata
```

## Usage

```typescript
import { Injectable } from '@nestjs/common';
import { Pipeline } from '@arus/core';
import { NestAdapter } from '@arus/adapter-nest';

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