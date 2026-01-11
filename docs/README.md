# ARUS Documentation

Welcome to the ARUS framework documentation.

## Overview

ARUS is a high-performance, explicit backend framework for TypeScript that treats HTTP requests as data flowing through functions.

## Getting Started

See the [main README](../README.md) for quick start guides and philosophy.

## Architecture & Design

- [Architecture](architecture.md) - Detailed system architecture
- [Design Decisions](design.md) - Key design rationale and trade-offs
- [Benchmarks](benchmark.md) - Performance results and methodology

## Packages

### Core Packages
- [@arus/core](packages/core.md) - Core runtime primitives
- [@arus/common](packages/common.md) - Shared utilities and types

### Adapters
- [@arus/adapter-http](adapters/http.md) - Node.js HTTP adapter
- [@arus/adapter-fetch](adapters/fetch.md) - Fetch API adapter
- [@arus/adapter-express](adapters/express.md) - Express adapter
- [@arus/adapter-nest](adapters/nest.md) - NestJS adapter

## Development

- [Contributing](contributing.md) - How to contribute to ARUS
- [Benchmarks](../benchmarks/README.md) - Performance testing setup