/**
 * One-off: update SEO meta fields for the peri-peri-masala product to better
 * match the "tangy peri peri masala" query GSC flagged as a quick win.
 * Run: npx tsx scripts/seo-update-peri-peri.ts
 */
import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

async function main() {
  const db = connectNeon();
  const { rows } = await db.query(
    `UPDATE products SET meta_title = $1, meta_description = $2
     WHERE slug = 'peri-peri-masala' RETURNING slug, meta_title, meta_description`,
    [
      'Tangy Peri Peri Masala — Buy Online | Tangry Spices, Jaipur',
      "Shop Tangry's tangy peri peri masala for fries, corn, popcorn & grills. Bold chilli-garlic heat, made in Jaipur. FSSAI licensed. Free shipping on orders ₹500+.",
    ],
  );
  await db.end();
  console.log(JSON.stringify(rows, null, 2));
}

main();
