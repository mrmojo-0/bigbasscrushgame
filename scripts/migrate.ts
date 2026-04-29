import { execSync } from 'child_process';

console.log('Applying D1 migrations locally...');
try {
  execSync('wrangler d1 migrations apply DB --local', { stdio: 'inherit' });
  console.log('Migrations complete.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
