/**
 * One-off: build the app schema on an empty Neon database by replaying the
 * schema-changing Supabase migrations, then strip the Supabase-only RLS bits.
 * Usage: npx tsx scripts/neon/bootstrap-schema.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

config({ path: '.env.local', quiet: true });
neonConfig.webSocketConstructor = ws;

// Data-only migrations (seeds, catalog renames, SEO copy) are skipped: data comes from the import.
const SCHEMA_MIGRATIONS = [
  '001_initial_schema.sql',
  '002b_create_variants_tables.sql',
  '004_contact_inquiries.sql',
  '005_inhouse_auth.sql',
  '009_product_categories.sql',
  '010_drop_products_subcategory.sql',
  '011_user_avatar.sql',
  '013_review_rating_sync_trigger.sql',
  '014_cwv_readings.sql',
  '015_admin_rebuild_requests.sql',
  '016_first_order_coupon.sql',
  '017_order_review_requests.sql',
  '022_is_hero_product.sql',
  '023_product_discount_enabled.sql',
  '024_checkout_phone_otp.sql',
  '025_checkout_email_otp.sql',
  '026_checkout_verified_emails.sql',
  '027_recipe_ratings.sql',
  '028_product_variant_cleanup.sql',
];

// RLS policies rely on Supabase's auth.uid()/roles; the app connects as the owner, so drop them.
function stripSupabaseOnly(sql: string): string {
  return sql
    .replace(/^\s*(CREATE|DROP)\s+POLICY[\s\S]*?;/gim, '')
    .replace(/^\s*ALTER\s+TABLE\s+\S+\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY\s*;/gim, '')
    .replace(/^\s*GRANT\s[\s\S]*?\bTO\s+(anon|authenticated|service_role)[\s\S]*?;/gim, '');
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const { rows } = await pool.query(
    "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'",
  );
  if (rows[0].n > 0) throw new Error('Target database is not empty; refusing to bootstrap.');

  for (const file of SCHEMA_MIGRATIONS) {
    process.stdout.write(`→ ${file} ... `);
    await pool.query(stripSupabaseOnly(readFileSync(join('lib/db/migrations', file), 'utf8')));
    console.log('ok');
  }
  await pool.query('DROP TABLE IF EXISTS product_variants_backup_028');

  // Seeds inside schema migrations (e.g. the 016 coupon) would clash with the data import.
  await pool.query(`
    DO $$ DECLARE r record; BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('TRUNCATE public.%I CASCADE', r.tablename);
      END LOOP;
    END $$;`);

  console.log('Schema ready.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
