/**
 * Copy images still hosted on Supabase Storage to Cloudflare R2 and rewrite their URLs in Neon.
 * Run after the data import, from a network that can reach supabase.co:
 *   npx tsx scripts/neon/copy-images-to-r2.ts [--dry-run]
 * Requires DATABASE_URL and the R2_* variables in .env.local.
 */
import { connectNeon, loadEnv } from '../lib/db-backup';
import { uploadProductImage } from '../../lib/storage/upload';

loadEnv();

const dryRun = process.argv.includes('--dry-run');
const SUPABASE_PUBLIC = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/[^/]+\/(.+)$/;

const TARGETS = [
  { table: 'product_images', column: 'url' },
  { table: 'users', column: 'avatar_url' },
] as const;

async function main() {
  const db = connectNeon();
  const copied = new Map<string, string>();
  let failures = 0;

  for (const { table, column } of TARGETS) {
    const { rows } = await db.query(
      `SELECT id, ${column} AS url FROM ${table} WHERE ${column} LIKE 'https://%.supabase.co/storage/%'`,
    );
    console.log(`${table}.${column}: ${rows.length} Supabase URLs`);

    for (const row of rows) {
      const url = String(row.url);
      const key = url.match(SUPABASE_PUBLIC)?.[1];
      if (!key) {
        console.warn('  skip (not a public object URL):', url);
        continue;
      }
      if (dryRun) {
        console.log('  would copy', key);
        continue;
      }

      let newUrl = copied.get(url);
      if (!newUrl) {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`  fetch failed (${res.status}):`, url);
          failures++;
          continue;
        }
        const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
        const uploaded = await uploadProductImage(
          Buffer.from(await res.arrayBuffer()),
          decodeURIComponent(key),
          contentType,
        );
        if (!uploaded) {
          console.error('  R2 upload failed (check R2_* env):', key);
          failures++;
          continue;
        }
        newUrl = uploaded;
        copied.set(url, newUrl);
      }

      await db.query(`UPDATE ${table} SET ${column} = $1 WHERE id = $2`, [newUrl, row.id]);
      console.log('  ✓', key);
    }
  }

  await db.end();
  if (failures) {
    console.error(`\n${failures} image(s) failed; re-run to retry.`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
