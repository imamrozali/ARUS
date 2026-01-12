// orm-benchmark.js - Benchmark ARUS ORM vs Drizzle vs Raw SQL (SQLite)

import { DB, SqliteAdapter, table } from '@arusjs/orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';

// Schema for ARUS
const usersTable = table('users', {
  id: { type: 'number', primary: true },
  name: { type: 'string' },
  email: { type: 'string' },
  age: { type: 'number' }
});

// Schema for Drizzle
const usersDrizzle = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  age: integer('age')
});

// Setup
const dbFile = './temp.db';
const arusDb = new DB(new SqliteAdapter(dbFile));
const sqliteDb = new Database(dbFile);
const drizzleDb = drizzle(sqliteDb);

// Benchmark function
async function benchmark(name, fn, iterations = 1000) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  const end = Date.now();
  console.log(`${name}: ${end - start}ms for ${iterations} iterations`);
}

// Prepare data
await arusDb.connect();
sqliteDb.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, age INTEGER)');
sqliteDb.exec('DELETE FROM users');

console.log('Running ORM Benchmarks...\n');

// Pre-insert 1000 rows for SELECT test
for (let i = 0; i < 1000; i++) {
  sqliteDb.prepare('INSERT INTO users (name, email, age) VALUES (?, ?, ?)').run(`User${i}`, `user${i}@example.com`, i % 50);
}

// Benchmark INSERT
console.log('=== INSERT Benchmarks ===');
await benchmark('ARUS ORM Insert', async () => {
  await arusDb.insert(usersTable, { name: 'John', email: 'john@example.com', age: 25 }).execute();
});

await benchmark('Drizzle Insert', async () => {
  await drizzleDb.insert(usersDrizzle).values({ name: 'John', email: 'john@example.com', age: 25 }).run();
});

await benchmark('Raw SQL Insert', async () => {
  sqliteDb.prepare('INSERT INTO users (name, email, age) VALUES (?, ?, ?)').run('John', 'john@example.com', 25);
});

console.log('\n=== SELECT Benchmarks ===');
await benchmark('ARUS ORM Select All', async () => {
  await arusDb.select(usersTable).execute();
});

await benchmark('Drizzle Select All', async () => {
  await drizzleDb.select().from(usersDrizzle).all();
});

await benchmark('Raw SQL Select All', async () => {
  sqliteDb.prepare('SELECT * FROM users').all();
});

console.log('\n=== SELECT WHERE Benchmarks ===');
await benchmark('ARUS ORM Select Where', async () => {
  await arusDb.select(usersTable).where({ age: 25 }).execute();
});

await benchmark('Drizzle Select Where', async () => {
  await drizzleDb.select().from(usersDrizzle).where(eq(usersDrizzle.age, 25)).all();
});

await benchmark('Raw SQL Select Where', async () => {
  sqliteDb.prepare('SELECT * FROM users WHERE age = ?').all(25);
});

await arusDb.disconnect();
sqliteDb.close();
import fs from 'fs';
fs.unlinkSync(dbFile);
console.log('\nBenchmark complete.');