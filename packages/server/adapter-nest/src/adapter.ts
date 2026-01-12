import { Injectable } from "@nestjs/common";
import type { Context, Pipeline } from "@arusjs/core";
import { executePipeline } from "@arusjs/core";

export interface NestRequest {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body: any;
}

export interface NestResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body?: any;
}

type NestContext = Context<NestRequest, NestResponse>;

@Injectable()
export class NestAdapter {
  private pipeline: Pipeline<NestContext>;

  constructor(pipeline: Pipeline<NestContext>) {
    this.pipeline = pipeline;
  }

  async handle(req: any, res: any): Promise<void> {
    const ctx: Context<NestRequest, NestResponse> = {
      request: {
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body,
      },
      response: {
        statusCode: 200,
        headers: {},
        body: undefined,
      },
      state: {},
    };

    await executePipeline(this.pipeline, ctx);

    res.status(ctx.response.statusCode).set(ctx.response.headers);
    if (ctx.response.body) {
      res.send(ctx.response.body);
    } else {
      res.end();
    }

    if (ctx.error) {
      res.status(500).json({ error: ctx.error.message });
    }
  }
}
