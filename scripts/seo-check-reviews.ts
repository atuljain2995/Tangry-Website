/**
 * One-off: check review/rating coverage across all products (low review
 * counts suppress AggregateRating rich-snippet stars in SERPs).
 * Run: npx tsx scripts/seo-check-reviews.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, rating, review_count')
    .order('review_count', { ascending: false });

  if (error) {
    console.error(error);
    process.exit(1);
  }

  const withReviews = data.filter((p) => p.review_count > 0).length;
  console.log(`Products with reviews: ${withReviews} / ${data.length}`);
  console.log(JSON.stringify(data, null, 2));
}

main();
