import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Skip DTS due to external types
  clean: true,
  minify: true,
  external: ['pg', 'better-sqlite3', 'mysql2', 'oracledb', 'mongodb'],
});