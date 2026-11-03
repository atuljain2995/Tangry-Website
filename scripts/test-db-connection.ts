// Test database connection
// Run: npm run test-db

import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

async function main(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env.local');
    return false;
  }

  const db = connectNeon();
  try {
    console.log('🔍 Testing Neon connection...\n');

    const { rows: products } = await db.query('SELECT id, name, slug FROM products LIMIT 5');
    console.log('✅ Products fetched:');
    console.log(products, '\n');

    const { rows: counts } = await db.query(
      `SELECT relname AS table, n_live_tup AS approx_rows
       FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY relname`,
    );
    console.log('✅ Tables:');
    console.table(counts);
    return true;
  } catch (error) {
    console.error('❌ Database check failed:', (error as Error).message);
    return false;
  } finally {
    await db.end();
  }
}

main().then((ok) => process.exit(ok ? 0 : 1));
