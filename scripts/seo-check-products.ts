/**
 * One-off: inspect current SEO fields for target products before editing.
 * Run: npx tsx scripts/seo-check-products.ts
 */
import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

const slugs = ['peri-peri-masala', 'sweet-lemon-pickle', 'chaas-masala'];

async function main() {
  const db = connectNeon();
  const { rows } = await db.query(
    'SELECT slug, name, meta_title, meta_description, keywords, rating, review_count, description FROM products WHERE slug = ANY($1)',
    [slugs],
  );
  await db.end();
  console.log(JSON.stringify(rows, null, 2));
}

main();
