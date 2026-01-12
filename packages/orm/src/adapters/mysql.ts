import mysql from "mysql2/promise";

export interface Adapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(query: string, params?: any[]): Promise<any>;
  transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T>;
}

export class MysqlAdapter implements Adapter {
  private pool: mysql.Pool;

  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  async execute(query: string, params: any[] = []): Promise<any> {
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fn(new MysqlTransactionAdapter(connection));
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

class MysqlTransactionAdapter implements Adapter {
  constructor(private connection: mysql.Connection) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async execute(query: string, params: any[] = []): Promise<any> {
    const [rows] = await this.connection.execute(query, params);
    return rows;
  }
  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    throw new Error("Nested transactions not supported in MySQL");
  }
}
