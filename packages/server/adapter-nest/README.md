# @arusjs/adapter-nest

NestJS adapter for ARUSJS framework. Enables ARUSJS pipelines within NestJS applications.

## Installation

```bash
npm install @arusjs/core @arusjs/adapter-nest @nestjs/core @nestjs/common reflect-metadata
```

## Usage

```typescript
import { Module } from "@nestjs/common";
import { Controller, Get } from "@nestjs/common";
import { Pipeline, Context } from "@arusjs/core";
import {
  NestAdapter,
  type NestRequest,
  type NestResponse,
} from "@arusjs/adapter-nest";

type MyContext = Context<NestRequest, NestResponse>;

const pipeline = new Pipeline<MyContext>([
  (ctx) => {
    ctx.response.body = `Hello from ${ctx.request.method} ${ctx.request.url}`;
    ctx.response.statusCode = 200;
  },
]);

@Injectable()
export class ArusService {
  private adapter = new NestAdapter(pipeline);

  async handle(req: any, res: any): Promise<void> {
    return this.adapter.handle(req, res);
  }
}

@Controller("arusjs")
export class ArusController {
  constructor(private readonly arusService: ArusService) {}

  @Get()
  async handleRequest(@Req() req, @Res() res) {
    return this.arusService.handle(req, res);
  }
}

@Module({
  controllers: [ArusController],
  providers: [ArusService],
})
export class AppModule {}
```

## API Reference

### Classes

- `NestAdapter` - Main adapter class
  - `constructor(pipeline: Pipeline<Context<NestRequest, NestResponse>>)`
  - `handle(req: any, res: any): Promise<void>`

### Types

- `NestRequest` - Request shape: { url, method, headers, body }
- `NestResponse` - Response shape: { statusCode, headers, body? }

## Notes

- Integrates with NestJS dependency injection
- Uses NestJS decorators for controller setup
- Error responses use NestJS res.json; customize in handlers
