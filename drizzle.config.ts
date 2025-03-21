import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL is not defined in the environment variables');
}

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.VITE_DATABASE_URL || '',
  },
}); 