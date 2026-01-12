import { Pool, PoolConfig } from "pg";
import { Adapter } from "../adapter";

export class PostgresAdapter implements Adapter {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async connect(): Promise<void> {
    // Pool handles connections
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  async execute(query: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await fn(new PostgresTransactionAdapter(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

class PostgresTransactionAdapter implements Adapter {
  constructor(private client: any) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async execute(query: string, params: any[] = []): Promise<any> {
    const result = await this.client.query(query, params);
    return result.rows;
  }
  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    // Nested transactions via SAVEPOINT
    await this.client.query("SAVEPOINT sp1");
    try {
      const result = await fn(this);
      await this.client.query("RELEASE SAVEPOINT sp1");
      return result;
    } catch (error) {
      await this.client.query("ROLLBACK TO SAVEPOINT sp1");
      throw error;
    }
  }
}
