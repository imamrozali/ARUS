import type { Context } from './context';
import type { Handler } from './handler';

export class Pipeline<C extends Context = Context> {
  readonly handlers: Handler<C>[];
  readonly isAsync: boolean;

  constructor(handlers: Handler<C>[]) {
    this.handlers = handlers;
    this.isAsync = handlers.some(
      h => h.constructor.name === 'AsyncFunction'
    );
  }

  async execute(ctx: C): Promise<void> {
    if (!this.isAsync) {
      for (let i = 0; i < this.handlers.length; i++) {
        const result = this.handlers[i](ctx);
        // DEV assertion: Check if sync handler unexpectedly returns Promise
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && result instanceof Promise) {
          throw new Error(`Async handler detected in sync pipeline at index ${i}`);
        }
        if (ctx.error) return;
      }
      return;
    }
    for (let i = 0; i < this.handlers.length; i++) {
      await this.handlers[i](ctx);
      if (ctx.error) return;
    }
  }
}