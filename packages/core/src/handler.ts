import type { Context } from './context';

export type Handler<C extends Context = Context> = (ctx: C) => void | Promise<void>;