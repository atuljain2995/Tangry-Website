/**
 * One-off: update SEO meta fields for the peri-peri-masala product to better
 * match the "tangy peri peri masala" query GSC flagged as a quick win.
 * Run: npx tsx scripts/seo-update-peri-peri.ts
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
    .update({
      meta_title: 'Tangy Peri Peri Masala — Buy Online | Tangry Spices, Jaipur',
      meta_description:
        "Shop Tangry's tangy peri peri masala for fries, corn, popcorn & grills. Bold chilli-garlic heat, made in Jaipur. FSSAI licensed. Free shipping on orders ₹500+.",
    })
    .eq('slug', 'peri-peri-masala')
    .select('slug, meta_title, meta_description');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
