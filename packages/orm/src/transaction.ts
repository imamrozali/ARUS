// transaction.ts - Transaction wrapper

import { DB } from './db';

export async function transaction<T>(db: DB, fn: (db: DB) => Promise<T>): Promise<T> {
  return db.transaction(fn);
}