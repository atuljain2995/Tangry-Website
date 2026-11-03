/**
 * One-off: print the exact Product/ProductGroup JSON-LD schema for every
 * product, using the same getProductSchema() the app renders on product pages.
 * Run: npx tsx scripts/print-product-schemas.ts
 */
import { getAllProducts, getProductReviews } from '../lib/db/queries';
import { getProductSchema } from '../lib/utils/schema';
import { loadEnv } from './lib/db-backup';

loadEnv();

async function main() {
  const products = (await getAllProducts()).sort((a, b) => a.name.localeCompare(b.name));

  for (const p of products) {
    const schema = getProductSchema(p, await getProductReviews(p.id, 100));
    console.log(`\n=== ${p.name} (${p.slug}) — ${schema['@type']} ===`);
    console.log(JSON.stringify(schema, null, 2));
  }

  console.log(`\nTotal products: ${products.length}`);
}

main();
