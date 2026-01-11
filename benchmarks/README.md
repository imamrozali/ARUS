# ARUS Benchmark Guide

## Setup
1. Install dependencies: `cd benchmarks && npm install`
2. Run servers in separate terminals:
   - `node hello-world.js` (ARUS on 3000)
   - `node fastify-hello.js` (Fastify on 3001)
   - `node express-hello.js` (Express on 3002)

## Run Benchmarks
Use autocannon:
- `npx autocannon -c 100 -d 30 http://localhost:3000` (ARUS)
- `npx autocannon -c 100 -d 30 http://localhost:3001` (Fastify)
- `npx autocannon -c 100 -d 30 http://localhost:3002` (Express)

## Metrics to Record
- Avg latency
- P99 latency
- Requests/sec
- Errors (must be 0)
- CPU usage
- Memory usage

## Expected Results
ARUS should be within ±5% of Fastify for hello-world, slightly higher for JSON due to serialization.

## Red Flags
- Latency spikes: Check for allocations
- GC pauses: Avoid polymorphism
- Async path triggered: Verify handler declarations