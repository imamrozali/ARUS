# ARUS Design Decisions

This document explains the key design decisions that shaped ARUS, including alternatives considered and trade-offs made.

## Core Philosophy: Explicit Data Flow

### Decision: Treat HTTP as Data Flow
**Rationale**: HTTP requests are fundamentally data transformations. By modeling them as explicit data flow through functions, we achieve predictability and performance.

**Alternatives Considered**:
- **Middleware Chains**: Like Express/Koa - rejected for unclear execution order
- **Decorator Systems**: Like NestJS - rejected for runtime overhead
- **Plugin Architecture**: Like Fastify - rejected for implicit dependencies

**Trade-offs**:
- More verbose than magic frameworks
- Less "batteries included"
- Better for advanced users who need control

## Architecture: Runtime-Agnostic Core

### Decision: Separate Core from Transports
**Rationale**: Enable multi-runtime support without compromising core performance.

**Implementation**:
- Core has zero Node.js imports
- Adapters handle transport-specific logic
- Clean separation of concerns

**Alternatives**:
- **Node.js Only**: Simpler but limits ecosystem
- **Abstract Transport Layer**: Adds complexity without benefit

**Benefits**:
- Works in Node.js, Bun, Deno, Workers
- Core remains lean and focused
- Easy adapter development

## Performance: V8-Optimized Hot Path

### Decision: Sync-First Pipeline with Explicit Async
**Rationale**: Most handlers are sync; optimize for common case while supporting async.

**Implementation**:
- Async detection at startup via `constructor.name`
- Separate sync/async execution paths
- Dev-time validation for mismatches

**Alternatives**:
- **Always Async**: Like Fastify - slower for sync workloads
- **Dynamic Detection**: Runtime overhead
- **Force Sync**: Limits functionality

**Optimizations Applied**:
- Indexed loops (no iterators)
- Stable object shapes
- No per-request allocations in hot path
- Error short-circuiting

## Type System: Strict Generics with User Control

### Decision: Generic Context but Simple Handler Types
**Rationale**: Allow transport-specific typing while keeping handler API simple.

**Implementation**:
```typescript
interface Context<Req, Res, State>
type Handler<C extends Context> = (ctx: C) => void | Promise<void>
class Pipeline<C extends Context>
```

**Alternatives**:
- **No Generics**: Too loose, poor DX
- **Complex Inheritance**: Over-engineering
- **Any Types**: Unsafe

**Benefits**:
- Type-safe across adapters
- User controls specificity
- Compiler catches mismatches

## Error Handling: Short-Circuit with Structured Errors

### Decision: Context-Based Error Propagation
**Rationale**: Avoid exception overhead while preserving stack traces.

**Implementation**:
- `ctx.error` stops pipeline execution
- ArusError for structured errors
- Adapter handles serialization

**Alternatives**:
- **Exceptions**: Overhead, unclear boundaries
- **Middleware Chains**: Complex error flow
- **Promises**: Async complications

**Benefits**:
- Predictable error flow
- No hidden try-catch
- Preserves error context

## Routing: Static O(1) Hash Map

### Decision: Exact Match Only, No Params
**Rationale**: Predictable routing is faster and safer than dynamic parsing.

**Implementation**:
- Hash map: `${method} ${path}`
- Exact string matching
- Handlers handle dynamic logic

**Alternatives**:
- **Regex Routes**: Complex, slower
- **Trie Structures**: Overkill for typical apps
- **Param Parsing**: Runtime overhead

**Trade-offs**:
- Less convenient for dynamic routes
- More predictable performance
- Easier debugging

## Context Design: Mutable Per-Request Container

### Decision: Single Mutable Object
**Rationale**: Simple mental model, efficient for V8, clear ownership.

**Conventions**:
- `request`: Read-only by convention
- `response`: Write-only
- `state`: User-owned

**Alternatives**:
- **Immutable Updates**: Functional style, more allocations
- **Separate Objects**: Complex parameter passing
- **Global State**: Thread safety issues

**Benefits**:
- Intuitive for imperative code
- Zero-copy where possible
- Clear data flow

## Adapter Pattern: Transport Translation Layer

### Decision: Adapters Handle All Transport Logic
**Rationale**: Keep core clean, enable multi-runtime support.

**Contract**:
- Translate transport request → Context
- Execute pipeline
- Translate Context → transport response
- Handle async boundaries

**Benefits**:
- Core stays transport-agnostic
- Easy to add new runtimes
- Transport-specific optimizations possible

## Development Experience: Advanced User Focus

### Decision: Prioritize Power Users Over Beginners
**Rationale**: Framework for teams that understand performance trade-offs.

**Features**:
- Explicit async handling
- Manual serialization
- Convention-based safety

**Alternatives**:
- **Rails-Style Magic**: Hides complexity
- **Extensive Defaults**: Configuration overhead
- **Guard Rails**: More constraints

**Target Audience**:
- Performance-conscious developers
- Infrastructure teams
- API gateway builders

## Build System: Independent Package Builds

### Decision: Each Package Builds Separately
**Rationale**: Enable independent publishing and development.

**Implementation**:
- Monorepo with independent builds
- Local file dependencies for development
- Separate TypeScript configs

**Alternatives**:
- **Single Build**: Coupled releases
- **Transpiled Monolith**: Complex tooling

**Benefits**:
- Faster iteration
- Independent versioning
- NPM publishing ready

## Trade-off Summary

### What ARUS Gains
- **Performance**: Near V8 limits
- **Predictability**: Explicit execution
- **Flexibility**: Multi-runtime support
- **Maintainability**: Simple architecture

### What ARUS Sacrifices
- **Convenience**: More boilerplate
- **Features**: Fewer built-ins
- **Beginner-Friendliness**: Steeper learning curve
- **Ecosystem**: Smaller initial library

### Justification
These trade-offs are intentional. ARUS targets the sweet spot between raw performance (like Fastify) and clean architecture (like NestJS), serving developers who need both speed and control.

The design decisions create a framework that stays out of your way while delivering consistent, high-performance HTTP processing across JavaScript runtimes.