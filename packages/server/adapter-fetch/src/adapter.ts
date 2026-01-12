import type { Context, Pipeline } from "@arusjs/core";
import { executePipeline } from "@arusjs/core";

export interface FetchRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface FetchResponse {
  status: number;
  headers: Record<string, string>;
  body?: string;
}

type FetchContext = Context<FetchRequest, FetchResponse>;

export class FetchAdapter {
  private pipeline: Pipeline<FetchContext>;

  constructor(pipeline: Pipeline<FetchContext>) {
    this.pipeline = pipeline;
  }

  async handle(request: Request): Promise<Response> {
    const ctx: Context<FetchRequest, FetchResponse> = {
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.body ? await request.text() : undefined,
      },
      response: {
        status: 200,
        headers: {},
        body: undefined,
      },
      state: {},
    };

    await executePipeline(this.pipeline, ctx);

    const response = new Response(ctx.response.body, {
      status: ctx.response.status,
      headers: ctx.response.headers,
    });

    if (ctx.error) {
      // Simple error handling - adapters can customize this
      return new Response(JSON.stringify({ error: ctx.error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return response;
  }
}
