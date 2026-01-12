# @arusjs/orm

Faster than Drizzle ORM, fully type-safe, pipeline-native ORM for SQL & NoSQL databases. No magic, explicit API, minimal overhead.

## Installation

```bash
npm install @arusjs/orm
```

Install optional database drivers as needed:

```bash
npm install pg          # PostgreSQL
npm install better-sqlite3  # SQLite
npm install mysql2      # MySQL
npm install oracledb    # Oracle
npm install mongodb     # MongoDB
```

## Quick Start

### Schema Definition

```typescript
import { table, collection } from '@arusjs/orm';

// SQL Table
const users = table('users', {
  id: { type: 'number', primary: true },
  name: { type: 'string' },
  email: { type: 'string' },
  created_at: { type: 'date', default: () => new Date() }
});

// MongoDB Collection
const posts = collection('posts', {
  _id: { type: 'string', primary: true },
  title: { type: 'string' },
  content: { type: 'string' },
  tags: { type: 'array' }
});
```

### Database Connection

```typescript
import { DB, PostgresAdapter, SqliteAdapter, MongoAdapter } from '@arusjs/orm';

// PostgreSQL
const db = new DB(new PostgresAdapter({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'pass'
}));

// SQLite
const db = new DB(new SqliteAdapter('./database.db'));

// MongoDB
const db = new DB(new MongoAdapter('mongodb://localhost:27017', 'mydb'));

await db.connect();
```

### Queries

```typescript
// SELECT
const allUsers = await db.select(users).execute();

// WHERE
const user = await db.select(users).where({ id: 1 }).execute();

// INSERT
await db.insert(users, { name: 'John', email: 'john@example.com' }).execute();

// UPDATE
await db.update(users, { name: 'Jane' }).where({ id: 1 }).execute();

// DELETE
await db.delete(users).where({ id: 1 }).execute();

// LIMIT & ORDER
const recentUsers = await db.select(users)
  .orderBy('created_at', 'desc')
  .limit(10)
  .execute();
```

### Transactions

```typescript
await db.transaction(async (trx) => {
  await trx.insert(users, { name: 'Alice' }).execute();
  await trx.insert(posts, { title: 'Hello' }).execute();
  // Commits if no error, rolls back on throw
});
```

### ARUSJS Pipeline Integration

```typescript
import { createPipeline } from '@arusjs/core';
import { DB } from '@arusjs/orm';

const pipeline = createPipeline([
  async (ctx) => {
    const users = await ctx.db.select(usersTable).execute();
    ctx.response = { users };
  }
]);

// In adapter
await pipeline.execute({ db, request: {}, response: {} });
```

## Supported Databases

- **PostgreSQL**: Full ACID, advanced features.
- **MySQL**: InnoDB transactions.
- **SQLite**: File-based, no server.
- **Oracle**: Enterprise-grade.
- **MongoDB**: NoSQL with transactions.

## Performance

- Zero-overhead query building.
- Direct parameterized queries.
- Optimized for ARUSJS pipelines.
- Benchmarks show faster execution than Drizzle ORM.

## API Reference

### Schema
- `table(name, columns)`: Define SQL table.
- `collection(name, fields)`: Define MongoDB collection.

### DB
- `new DB(adapter)`: Create DB instance.
- `connect()`, `disconnect()`: Manage connection.
- `select(schema)`, `insert(schema, data)`, `update(schema, data)`, `delete(schema)`: Query builders.
- `transaction(fn)`: Run transaction.

### Query
- Fluent methods: `where()`, `select()`, `insert()`, `update()`, `delete()`, `limit()`, `orderBy()`.
- `execute()`: Run query.

## License

MIT