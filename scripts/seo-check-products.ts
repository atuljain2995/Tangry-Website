/**
 * One-off: inspect current SEO fields for target products before editing.
 * Run: npx tsx scripts/seo-check-products.ts
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

const slugs = ['peri-peri-masala', 'sweet-lemon-pickle', 'chaas-masala'];

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, meta_title, meta_description, keywords, rating, review_count, description')
    .in('slug', slugs);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
