import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, category, is_hero_product, is_featured, is_best_seller')
    .order('name');

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('\nAll products (is_hero_product status):');
  console.log('-'.repeat(80));
  for (const p of data) {
    const hero = p.is_hero_product ? 'HERO' : '  - ';
    const feat = p.is_featured ? 'Featured' : '';
    const best = p.is_best_seller ? 'BestSeller' : '';
    console.log(`${hero}  |  ${(p.name || '').padEnd(30)}  |  ${(p.category || '').padEnd(12)}  |  ${feat} ${best}`);
  }
  console.log('-'.repeat(80));
  const heroCount = data.filter((p: any) => p.is_hero_product).length;
  console.log(`\nTotal: ${data.length} products, ${heroCount} marked as hero`);
}

main();
