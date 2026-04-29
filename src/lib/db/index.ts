import { resolve } from 'path';
import { mkdirSync } from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Resolve the database path from the project root
const dbPath = resolve(process.cwd(), 'data', 'database.sqlite');

// Ensure the data directory exists
mkdirSync(resolve(process.cwd(), 'data'), { recursive: true });

// Create the SQLite connection
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
sqlite.pragma('journal_mode = WAL');

// Enable foreign key constraint enforcement
sqlite.pragma('foreign_keys = ON');

// Create the Drizzle ORM instance with schema
export const db = drizzle(sqlite, { schema });

export default db;
