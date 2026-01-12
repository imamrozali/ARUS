// db.ts - Unified database interface

import { Adapter } from './adapter';
import { TableSchema, CollectionSchema } from './schema';
import { Query } from './query';

export class DB {
  constructor(private adapter: Adapter) {}

  async connect(): Promise<void> {
    await this.adapter.connect();
  }

  async disconnect(): Promise<void> {
    await this.adapter.disconnect();
  }

  select<T extends TableSchema | CollectionSchema>(schema: T): Query<T> {
    return new Query(this.adapter, schema).select();
  }

  insert<T extends TableSchema | CollectionSchema>(schema: T, data: any): Query<T> {
    return new Query(this.adapter, schema).insert(data);
  }

  insertMany<T extends TableSchema | CollectionSchema>(schema: T, data: any[]): Promise<any> {
    // Batch insert using transaction
    return this.transaction(async (db) => {
      for (const item of data) {
        await db.insert(schema, item).execute();
      }
    });
  }

  update<T extends TableSchema | CollectionSchema>(schema: T, data: any): Query<T> {
    return new Query(this.adapter, schema).update(data);
  }

  delete<T extends TableSchema | CollectionSchema>(schema: T): Query<T> {
    return new Query(this.adapter, schema).delete();
  }

  async transaction<T>(fn: (db: DB) => Promise<T>): Promise<T> {
    return this.adapter.transaction(async (trx) => fn(new DB(trx)));
  }
}