# ARUS ORM Examples

This directory contains complete examples for using @arusjs/orm with each supported database adapter.

## Prerequisites

Install the ORM and required database drivers:

```bash
npm install @arusjs/orm @arusjs/core
npm install pg          # PostgreSQL
npm install mysql2      # MySQL
npm install better-sqlite3  # SQLite
npm install oracledb    # Oracle
npm install mongodb     # MongoDB
```

## Running Examples

Each example is a standalone script demonstrating:

- Schema definition
- CRUD operations (Create, Read, Update, Delete)
- Transactions
- ARUSJS pipeline integration

### SQLite (File-based, no server required)

```bash
node examples/orm/sqlite-example.js
```

### MongoDB

Requires MongoDB running locally:

```bash
node examples/orm/mongo-example.js
```

### PostgreSQL

Requires PostgreSQL running locally. Update connection details in the script.

```bash
node examples/orm/postgres-example.js
```

### MySQL

Requires MySQL running locally. Update connection details in the script.

```bash
node examples/orm/mysql-example.js
```

### Oracle

Requires Oracle DB running locally. Update connection details in the script.

```bash
node examples/orm/oracle-example.js
```

## Example Structure

Each example follows the same pattern:

1. Define schemas (table/collection)
2. Setup DB connection
3. Create tables (raw SQL for demo)
4. Perform inserts
5. Run select queries (all, with conditions)
6. Update records
7. Delete records
8. Demonstrate transactions
9. Integrate with ARUSJS pipeline
10. Cleanup

## Notes

- SQLite example uses a temp file and cleans up.
- SQL examples create tables on-the-fly (in production, use migrations).
- Adjust connection strings for your environment.
- Examples are ESM-compatible.

For more details, see the ORM README in packages/orm/README.md.