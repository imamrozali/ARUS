// query.ts - Fluent query builder

import { Adapter } from './adapter';
import { TableSchema, CollectionSchema, InferRow, InferDoc } from './schema';

export class Query<T extends TableSchema | CollectionSchema> {
  private operations: any[] = [];

  constructor(private adapter: Adapter, private schema: T) {}

  where(conditions: Record<string, any>): this {
    this.operations.push({ type: 'where', conditions });
    return this;
  }

  select(fields?: string[]): this {
    this.operations.push({ type: 'select', fields });
    return this;
  }

  insert(data: any | any[]): this {
    this.operations.push({ type: 'insert', data });
    return this;
  }

  update(data: Record<string, any>): this {
    this.operations.push({ type: 'update', data });
    return this;
  }

  delete(): this {
    this.operations.push({ type: 'delete' });
    return this;
  }

  limit(n: number): this {
    this.operations.push({ type: 'limit', n });
    return this;
  }

  orderBy(field: string, dir: 'asc' | 'desc' = 'asc'): this {
    this.operations.push({ type: 'orderBy', field, dir });
    return this;
  }

  async execute(): Promise<any> {
    // Build query based on operations and schema type
    const isSQL = 'columns' in this.schema;
    if (isSQL) {
      return this.executeSQL();
    } else {
      return this.executeMongo();
    }
  }

  private async executeSQL(): Promise<any> {
    // Build SQL query
    let query = '';
    const params: any[] = [];
    const table = this.schema.name;

    for (const op of this.operations) {
      if (op.type === 'select') {
        const fields = op.fields ? op.fields.join(', ') : '*';
        query = `SELECT ${fields} FROM ${table}`;
        break; // Process select first
      }
    }
    for (const op of this.operations) {
      if (op.type === 'where') {
        const whereClause = Object.keys(op.conditions).map(k => `${k} = ?`).join(' AND ');
        query += ` WHERE ${whereClause}`;
        params.push(...Object.values(op.conditions));
      } else if (op.type === 'limit') {
        query += ` LIMIT ${op.n}`;
      } else if (op.type === 'orderBy') {
        query += ` ORDER BY ${String(op.field)} ${op.dir.toUpperCase()}`;
      } else if (op.type === 'insert') {
        const data = Array.isArray(op.data) ? op.data : [op.data];
        const keys = Object.keys(data[0]);
        const placeholders = keys.map(() => '?').join(', ');
        query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        params.push(...data.flatMap((d: any) => Object.values(d)));
      } else if (op.type === 'update') {
        const setClause = Object.keys(op.data).map(k => `${k} = ?`).join(', ');
        query = `UPDATE ${table} SET ${setClause}`;
        params.push(...Object.values(op.data));
      } else if (op.type === 'delete') {
        query = `DELETE FROM ${table}`;
      }
    }

    if (!query) {
      throw new Error('No query generated from operations');
    }

    return this.adapter.execute(query, params);
  }

  private async executeMongo(): Promise<any> {
    // Build Mongo operation
    const collection = this.schema.name;
    let operation: any = {};

    for (const op of this.operations) {
      if (op.type === 'select' || op.type === 'find') {
        operation.find = op.conditions || {};
      } else if (op.type === 'insert') {
        operation.insert = op.data;
      } else if (op.type === 'update') {
        operation.update = { filter: op.conditions || {}, update: op.data };
      } else if (op.type === 'delete') {
        operation.delete = op.conditions || {};
      } else if (op.type === 'aggregate') {
        operation.aggregate = op.pipeline;
      }
    }

    return this.adapter.execute(collection, operation);
  }
}