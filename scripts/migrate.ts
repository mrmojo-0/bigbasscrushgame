import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '../src/lib/db';

console.log('Running database migrations...');

try {
  migrate(db, { migrationsFolder: './drizzle/migrations' });
  console.log('Migrations completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
