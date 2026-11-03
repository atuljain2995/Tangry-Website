import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Vercel's Neon integration names it NEONDB_DATABASE_URL.
const connectionString = process.env.DATABASE_URL || process.env.NEONDB_DATABASE_URL;

export const isDatabaseConfigured = Boolean(connectionString);

// Lazy so importing this module (e.g. during build without env) doesn't throw.
let instance: ReturnType<typeof create> | null = null;

function create() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add your Neon connection string to .env.local.');
  }
  return drizzle({ client: neon(connectionString), schema });
}

export function getDb() {
  instance ??= create();
  return instance;
}

export { schema };
