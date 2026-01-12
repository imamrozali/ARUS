# @arusjs/core

Core runtime primitives for ARUSJS framework.

## Installation

```bash
npm install @arusjs/core
```

## Overview

The core package provides the fundamental building blocks:

- `Context` - Mutable request context
- `Handler` - Request processing functions
- `Pipeline` - Execution container
- `ArusError` - Structured error class
- `Router` - Static route matching

## Design Constraints

- **Explicitness First**: Everything predictable, no hidden behavior
- **Performance Target**: Within ±5% Fastify
- **Runtime Agnostic**: No Node dependencies
- **Linear Execution**: Sequential handler flow
- **Sync Hot Path**: Async detection at startup

## Routing Limitations

Static O(1) routing only. No params, wildcards, or regex.

## Common Mistakes

- Async handlers must be `async function`
- Context mutability conventions
- Error handling via `ctx.error`

See [main README](../../README.md) for examples.
