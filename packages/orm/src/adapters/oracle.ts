// adapters/oracle.ts - Oracle adapter using oracledb

import oracledb from 'oracledb';

export interface Adapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(query: string, params?: any[]): Promise<any>;
  transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T>;
}

export class OracleAdapter implements Adapter {
  private pool: oracledb.Pool | null = null;
  private config: oracledb.PoolAttributes;

  constructor(config: oracledb.PoolAttributes) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.pool = await oracledb.createPool(this.config);
  }

  async disconnect(): Promise<void> {
    if (this.pool) await this.pool.close();
  }

  async execute(query: string, params: any[] = []): Promise<any> {
    const conn = await this.pool!.getConnection();
    try {
      return (await conn.execute(query, params)).rows;
    } finally {
      await conn.close();
    }
  }

  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    const connection = await this.pool!.getConnection();
    try {
      // Oracle transactions
      const result = await fn(new OracleTransactionAdapter(connection));
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.close();
    }
  }
}

class OracleTransactionAdapter implements Adapter {
  constructor(private connection: oracledb.Connection) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async execute(query: string, params: any[] = []): Promise<any> {
    const result = await this.connection.execute(query, params);
    return result.rows;
  }
  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    throw new Error('Nested transactions not supported in Oracle');
  }
}