/**
 * One-off: print the exact Product/ProductGroup JSON-LD schema for every
 * product, using the same getProductSchema() the app renders on product pages.
 * Run: npx tsx scripts/print-product-schemas.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { getProductSchema } from '../lib/utils/schema';
import type { ProductExtended, Review } from '../lib/types/database';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*, variants:product_variants(*), product_images(*)')
    .order('name', { ascending: true });

  if (productsError) {
    console.error(productsError);
    process.exit(1);
  }

  const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('*');

  if (reviewsError) {
    console.error(reviewsError);
    process.exit(1);
  }

  for (const p of products) {
    const productExtended = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      images: (p.product_images || []).map((img: { url: string }) => img.url),
      rating: p.rating,
      reviewCount: p.review_count,
      discountEnabled: p.discount_enabled,
      variants: (p.variants || []).map((v: Record<string, unknown>) => ({
        sku: v.sku,
        name: v.name,
        weight: v.weight,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        isAvailable: v.is_available,
        stock: v.stock,
      })),
    } as unknown as ProductExtended;

    const productReviews = (reviews || [])
      .filter((r) => r.product_id === p.id)
      .map(
        (r) =>
          ({
            title: r.title,
            comment: r.comment,
            createdAt: new Date(r.created_at),
            userName: r.user_name,
            rating: r.rating,
          }) as unknown as Review,
      );

    const schema = getProductSchema(productExtended, productReviews);
    console.log(`\n=== ${p.name} (${p.slug}) — ${schema['@type']} ===`);
    console.log(JSON.stringify(schema, null, 2));
  }

  console.log(`\nTotal products: ${products.length}`);
}

main();
