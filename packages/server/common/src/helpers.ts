export function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

export function isAsyncFunction(fn: unknown): boolean {
  return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}

export function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '[object Object]';
  }
}