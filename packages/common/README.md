# @arus/common

Shared utilities, helpers, constants, and types for ARUS packages.

## Installation

```bash
npm install @arus/common
```

## Usage

```typescript
import {
  normalizePath,
  isAsyncFunction,
  safeStringify,
  SUPPORTED_METHODS,
  DEFAULT_HEADERS,
  type HttpMethod,
  type Headers
} from '@arus/common';

// Normalize paths
const path = normalizePath('/users/'); // '/users'

// Check async functions
const isAsync = isAsyncFunction(async () => {}); // true

// Safe JSON stringify
const json = safeStringify({ data: 'value' }); // '{"data":"value"}'

// Use constants
console.log(SUPPORTED_METHODS); // ['GET', 'POST', ...]
console.log(DEFAULT_HEADERS); // { 'Content-Type': 'text/plain', ... }

// Type safety
const headers: Headers = { 'Authorization': 'Bearer token' };
const method: HttpMethod = 'GET';
```

## API Reference

### Helpers

- `normalizePath(path: string): string` - Removes trailing slashes, ensures at least '/'
- `isAsyncFunction(fn: unknown): boolean` - Checks if function is async
- `safeStringify(obj: unknown): string` - JSON.stringify with error handling

### Constants

- `SUPPORTED_METHODS: readonly HttpMethod[]` - Standard HTTP methods
- `DEFAULT_HEADERS: Record<string, string>` - Common default headers

### Types

- `HttpMethod` - Union of HTTP method strings
- `Headers` - Record for header values (string or string[])
- `JsonSerializable` - Types safe for JSON serialization

## Contributing

This package provides lightweight utilities. Keep it dependency-free and focused on shared needs.