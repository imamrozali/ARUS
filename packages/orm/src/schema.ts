// schema.ts - Type-safe schema definitions for SQL & NoSQL

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';

export interface ColumnDef<T = any> {
  type: DataType;
  primary?: boolean;
  default?: T;
  nullable?: boolean;
}

export interface TableSchema<T = any> {
  name: string;
  columns: Record<keyof T, ColumnDef>;
}

export interface CollectionSchema<T = any> {
  name: string;
  fields: Record<keyof T, ColumnDef>;
}

export function table<T extends Record<string, any>>(name: string, columns: { [K in keyof T]: ColumnDef<T[K]> }): TableSchema<T> {
  return { name, columns };
}

export function collection<T extends Record<string, any>>(name: string, fields: { [K in keyof T]: ColumnDef<T[K]> }): CollectionSchema<T> {
  return { name, fields };
}

// Type helpers
export type InferType<T extends ColumnDef> = T['type'] extends 'string' ? string :
  T['type'] extends 'number' ? number :
  T['type'] extends 'boolean' ? boolean :
  T['type'] extends 'date' ? Date :
  T['type'] extends 'object' ? Record<string, any> :
  T['type'] extends 'array' ? any[] :
  any;

export type InferRow<T extends TableSchema> = { [K in keyof T['columns']]: InferType<T['columns'][K]> };
export type InferDoc<T extends CollectionSchema> = { [K in keyof T['fields']]: InferType<T['fields'][K]> };