// adapter.ts - Common adapter interface

export interface Adapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(queryOrCollection: string, paramsOrOperation?: any[]): Promise<any>;
  transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T>;
}