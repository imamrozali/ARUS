import type { Context } from './context';
import type { Pipeline } from './pipeline';

export async function executePipeline<C extends Context>(
  pipeline: Pipeline<C>,
  ctx: C
): Promise<void> {
  try {
    await pipeline.execute(ctx);
  } catch (error) {
    ctx.error = error instanceof Error ? error : new Error(String(error));
  }
}