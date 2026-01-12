// adapters/sqlite.ts - SQLite adapter using better-sqlite3

import Database from 'better-sqlite3';
import { Adapter } from '../adapter';

export class SqliteAdapter implements Adapter {
  private db: Database.Database;
  private stmtCache = new Map<string, Database.Statement>();

  constructor(filename: string) {
    this.db = new Database(filename);
  }

  async connect(): Promise<void> {
    // Already connected
  }

  async disconnect(): Promise<void> {
    this.db.close();
  }

  async execute(query: string, params: any[] = []): Promise<any> {
    let stmt = this.stmtCache.get(query);
    if (!stmt) {
      stmt = this.db.prepare(query);
      this.stmtCache.set(query, stmt);
    }
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(params);
    } else {
      return stmt.run(params);
    }
  }

  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    const trx = this.db.transaction(() => fn(new SqliteTransactionAdapter(this.db)));
    return trx();
  }
}

class SqliteTransactionAdapter implements Adapter {
  constructor(private db: Database.Database) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async execute(query: string, params: any[] = []): Promise<any> {
    const stmt = this.db.prepare(query);
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(params);
    } else {
      return stmt.run(params);
    }
  }
  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    throw new Error('Nested transactions not supported in SQLite');
  }
}