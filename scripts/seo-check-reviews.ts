/**
 * One-off: check review/rating coverage across all products (low review
 * counts suppress AggregateRating rich-snippet stars in SERPs).
 * Run: npx tsx scripts/seo-check-reviews.ts
 */
import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

async function main() {
  const db = connectNeon();
  const { rows: data } = await db.query(
    'SELECT slug, name, rating, review_count FROM products ORDER BY review_count DESC',
  );
  await db.end();

  const withReviews = data.filter((p) => Number(p.review_count) > 0).length;
  console.log(`Products with reviews: ${withReviews} / ${data.length}`);
  console.log(JSON.stringify(data, null, 2));
}

main();
