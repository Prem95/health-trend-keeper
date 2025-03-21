import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, migrationClient } from '../src/lib/db.js';

// Log the migration process
console.log('Starting database migrations...');

// Run migrations
migrate(db, { migrationsFolder: 'drizzle/migrations' })
  .then(() => {
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
  })
  .finally(async () => {
    await migrationClient.end();
  }); 