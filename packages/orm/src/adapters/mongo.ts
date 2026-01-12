import { MongoClient, Db } from "mongodb";

export interface Adapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute(query: string, params?: any[]): Promise<any>;
  transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T>;
}

export class MongoAdapter implements Adapter {
  private client: MongoClient;
  private db: Db;

  constructor(uri: string, dbName: string) {
    this.client = new MongoClient(uri);
    this.db = this.client.db(dbName);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async execute(collection: string, operation: any): Promise<any> {
    const coll = this.db.collection(collection);
    if (operation.find) return coll.find(operation.find).toArray();
    if (operation.insert) return coll.insertMany(operation.insert);
    if (operation.update)
      return coll.updateMany(operation.update.filter, operation.update.update);
    if (operation.delete) return coll.deleteMany(operation.delete);
    if (operation.aggregate)
      return coll.aggregate(operation.aggregate).toArray();
    throw new Error("Unsupported operation");
  }

  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    const session = this.client.startSession();
    try {
      return await session.withTransaction(async () =>
        fn(new MongoTransactionAdapter(this.db, session))
      );
    } finally {
      session.endSession();
    }
  }
}

class MongoTransactionAdapter implements Adapter {
  constructor(private db: Db, private session: any) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async execute(collection: string, operation: any): Promise<any> {
    const coll = this.db.collection(collection);
    const options = { session: this.session };
    if (operation.find) return coll.find(operation.find, options).toArray();
    if (operation.insert) return coll.insertMany(operation.insert, options);
    if (operation.update)
      return coll.updateMany(
        operation.update.filter,
        operation.update.update,
        options
      );
    if (operation.delete) return coll.deleteMany(operation.delete, options);
    if (operation.aggregate)
      return coll.aggregate(operation.aggregate, options).toArray();
    throw new Error("Unsupported operation");
  }
  async transaction<T>(fn: (trx: Adapter) => Promise<T>): Promise<T> {
    throw new Error("Nested transactions not supported in MongoDB");
  }
}
