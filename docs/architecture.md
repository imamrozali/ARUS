# ARUSJS Architecture

## Overview

ARUSJS is built on a layered architecture that separates concerns while maintaining high performance and explicitness.

## Core Layers

### 1. Runtime Kernel (packages/core)

The heart of ARUSJS - transport-agnostic execution engine.

**Components:**

- **Context**: Mutable data container per request
- **Handler**: Pure functions that process Context
- **Pipeline**: Compiled execution sequence
- **Router**: O(1) static route lookup
- **Error Boundary**: Structured error handling

**Principles:**

- Zero transport knowledge
- Stable object shapes for V8 optimization
- Explicit async detection
- Linear execution flow

### 2. Shared Utilities (packages/common)

Common helpers used across packages.

**Components:**

- Path utilities
- Type guards
- HTTP constants
- Safe serialization

### 3. Transport Adapters

Runtime-specific bridges to transport layers.

**Common Pattern:**

```
Transport Request → Adapter Translation → Context Creation → Pipeline Execution → Response Translation → Transport Response
```

**Adapters:**

- **HTTP**: Node.js native HTTP/HTTPS
- **Fetch**: Web API (Bun/Deno/Workers)
- **Express**: Framework integration
- **NestJS**: DI container integration

## Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Transport     │ -> │    Adapter      │ -> │     Context     │
│   (HTTP/Fetch)  │    │  (Translation)  │    │   (Mutable)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pre-hooks     │ -> │   Pipeline      │ -> │   Post-hooks    │
│   (Sync only)   │    │   (Handlers)    │    │   (Sync only)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Response      │ <- │   Translation   │ <- │   Context       │
│   (Transport)   │    │   (Adapter)     │    │   (Final)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Performance Characteristics

### Hot Path Optimizations

- **Sync Detection**: Determined at startup, avoids runtime checks
- **Indexed Loops**: No iterator overhead
- **Stable Shapes**: V8 inline caching friendly
- **No Allocations**: In request path where possible

### Memory Model

- **Per-Request Context**: Isolated mutable state
- **Shared Pipelines**: Compiled once, reused
- **Static Routes**: Hash map lookup, no regex

### Async Handling

- **Explicit Declaration**: `async function` required
- **Dev-Time Validation**: Catches sync/async mismatches
- **Boundary Clarity**: Clear sync/async separation

## Error Architecture

### Error Types

- **ArusError**: Structured application errors
- **Native Errors**: Preserved stack traces
- **Transport Errors**: Adapter-specific handling

### Propagation

- **Short-Circuit**: `ctx.error` stops pipeline
- **No Bubbling**: Handlers don't throw
- **Adapter Responsibility**: Error serialization

## Type System

### Generic Constraints

- **Context Generics**: `Context<Req, Res, State>`
- **Handler Generics**: `Handler<C extends Context>`
- **Pipeline Generics**: `Pipeline<C extends Context>`

### Type Safety

- **Strict Mode**: No implicit any
- **Runtime Agnostic**: No platform-specific types in core
- **Adapter Types**: Transport-specific extensions

## Runtime Support

### Agnostic Design

- **Core**: Pure TypeScript, no runtime deps
- **Adapters**: Bridge to specific runtimes
- **Conditional Logic**: Feature detection where needed

### Supported Runtimes

- **Node.js**: Full HTTP/HTTPS support
- **Bun**: Fetch API integration
- **Deno**: Standard library compatibility
- **Cloudflare Workers**: Fetch API native

## Security Considerations

### Input Validation

- **Adapter Responsibility**: Sanitize transport inputs
- **Handler Assumption**: Trust Context data
- **Error Leaks**: Prevent sensitive data in responses

### Resource Protection

- **Timeout Handling**: Adapter-level timeouts
- **Memory Limits**: Context size constraints
- **Rate Limiting**: External to core

## Extensibility

### Adding Adapters

1. Define transport-specific types
2. Implement request/response translation
3. Handle async boundaries
4. Provide error serialization

### Adding Handlers

- Pure functions only
- Explicit Context mutation
- Async declaration when needed
- Error handling via ctx.error

## Trade-offs

### Explicitness vs Convenience

- **Pros**: Predictable, debuggable, performant
- **Cons**: More boilerplate than magic frameworks
- **Balance**: DX focused on advanced users

### Performance vs Features

- **Pros**: Near V8 limits, low overhead
- **Cons**: Fewer built-in features
- **Balance**: Core focus, ecosystem growth

This architecture enables ARUSJS to deliver consistent, high-performance HTTP processing across multiple JavaScript runtimes while maintaining explicit control and predictability.
