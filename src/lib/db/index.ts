import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type DrizzleD1 = ReturnType<typeof getDb>;

export function getDb(D1: D1Database) {
  return drizzle(D1, { schema });
}
