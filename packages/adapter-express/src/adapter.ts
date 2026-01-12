import { Request, Response } from 'express';
import type { Context, Pipeline } from '@arus/core';
import { executePipeline } from '@arus/core';

export interface ExpressRequest {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body: any;
}

export interface ExpressResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body?: any;
}

type ExpressContext = Context<ExpressRequest, ExpressResponse>;

export class ExpressAdapter {
  private pipeline: Pipeline<ExpressContext>;

  constructor(pipeline: Pipeline<ExpressContext>) {
    this.pipeline = pipeline;
  }

  async handle(req: Request, res: Response): Promise<void> {
    const ctx: Context<ExpressRequest, ExpressResponse> = {
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