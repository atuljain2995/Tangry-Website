import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

// Lazy so importing this module (e.g. during build without env) doesn't throw.
let instance: ReturnType<typeof create> | null = null;

function create() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add your Neon connection string to .env.local.');
  }
  return drizzle({ client: neon(process.env.DATABASE_URL), schema });
}

export function getDb() {
  instance ??= create();
  return instance;
}

export { schema };
