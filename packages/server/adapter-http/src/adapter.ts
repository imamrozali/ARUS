import { IncomingMessage, ServerResponse } from "http";
import type { Context, Pipeline } from "@arusjs/core";
import { executePipeline } from "@arusjs/core";

export interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: Buffer;
}

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body?: string | Buffer;
}

type HttpContext = Context<HttpRequest, HttpResponse>;

export class HttpAdapter {
  private pipeline: Pipeline<HttpContext>;

  constructor(pipeline: Pipeline<HttpContext>) {
    this.pipeline = pipeline;
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const ctx: Context<HttpRequest, HttpResponse> = {
      request: {
        url: req.url || "/",
        method: req.method || "GET",
        headers: req.headers,
        body: undefined, // Stream handling omitted for simplicity
      },
      response: {
        statusCode: 200,
        headers: {},
        body: undefined,
      },
      state: {},
    };

    await executePipeline(this.pipeline, ctx);

    if (ctx.error) {
      // Basic error handling
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: ctx.error.message }));
      return;
    }

    res.writeHead(ctx.response.statusCode, ctx.response.headers);
    if (ctx.response.body) {
      res.end(ctx.response.body);
    } else {
      res.end();
    }
  }
}
