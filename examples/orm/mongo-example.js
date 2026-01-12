// examples/orm/mongo-example.js - Complete ARUS ORM Example with MongoDB

import { collection, DB, MongoAdapter, transaction } from '@arusjs/orm';
import { createPipeline } from '@arusjs/core';

// Define schema
const users = collection('users', {
  _id: { type: 'string', primary: true },
  name: { type: 'string' },
  email: { type: 'string' },
  age: { type: 'number' }
});

const posts = collection('posts', {
  _id: { type: 'string', primary: true },
  userId: { type: 'string' },
  title: { type: 'string' },
  content: { type: 'string' }
});

// Setup DB (in-memory MongoDB simulation - use real URI for production)
const db = new DB(new MongoAdapter('mongodb://localhost:27017', 'arus_example'));
await db.connect();

console.log('=== ARUS ORM MongoDB Example ===\n');

// 1. Insert data
console.log('Inserting users...');
await db.insert(users, { _id: '1', name: 'Alice', email: 'alice@example.com', age: 25 }).execute();
await db.insert(users, { _id: '2', name: 'Bob', email: 'bob@example.com', age: 30 }).execute();
await db.insert(users, { _id: '3', name: 'Charlie', email: 'charlie@example.com', age: 35 }).execute();

console.log('Inserting posts...');
await db.insert(posts, { _id: '1', userId: '1', title: 'Hello World', content: 'My first post' }).execute();
await db.insert(posts, { _id: '2', userId: '2', title: 'ORM Test', content: 'Testing ARUS ORM' }).execute();

// 2. Select queries
console.log('\n=== Select Queries ===');
const allUsers = await db.select(users).execute();
console.log('All users:', allUsers);

const adultUsers = await db.select(users).where({ age: { $gte: 30 } }).execute();
console.log('Adult users:', adultUsers);

const userWithId = await db.select(users).where({ _id: '1' }).execute();
console.log('User with ID 1:', userWithId);

// 3. Update
console.log('\nUpdating user...');
await db.update(users, { age: 26 }).where({ _id: '1' }).execute();
const updatedUser = await db.select(users).where({ _id: '1' }).execute();
console.log('Updated Alice:', updatedUser);

// 4. Delete
console.log('\nDeleting post...');
await db.delete(posts).where({ title: 'ORM Test' }).execute();
const remainingPosts = await db.select(posts).execute();
console.log('Remaining posts:', remainingPosts);

// 5. Transactions
console.log('\n=== Transactions ===');
await transaction(db, async (trx) => {
  console.log('Starting transaction...');
  await trx.insert(users, { _id: '4', name: 'Dave', email: 'dave@example.com', age: 40 }).execute();
  await trx.insert(posts, { _id: '3', userId: '4', title: 'Transactional Post', content: 'Inside transaction' }).execute();
  console.log('Transaction committed.');
});

// Verify transaction
const newUsers = await db.select(users).execute();
console.log('Users after transaction:', newUsers.length);

// 6. ARUSJS Pipeline Integration
console.log('\n=== ARUSJS Pipeline Integration ===');

const pipeline = createPipeline([
  async (ctx) => {
    console.log('Pipeline: Fetching users...');
    ctx.users = await ctx.db.select(users).execute();
  },
  async (ctx) => {
    console.log('Pipeline: Processing users...');
    ctx.adultUsers = ctx.users.filter(u => u.age >= 30);
  }
]);

const result = await pipeline.execute({ db });
console.log('Pipeline result - Adult users:', result.adultUsers);

// Cleanup
await db.disconnect();
console.log('\nExample completed successfully!');