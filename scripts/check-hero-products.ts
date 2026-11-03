import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

async function main() {
  const db = connectNeon();
  const { rows: data } = await db.query(
    'SELECT id, name, slug, category, is_hero_product, is_featured, is_best_seller FROM products ORDER BY name',
  );
  await db.end();

  console.log('\nAll products (is_hero_product status):');
  console.log('-'.repeat(80));
  for (const p of data) {
    const hero = p.is_hero_product ? 'HERO' : '  - ';
    const feat = p.is_featured ? 'Featured' : '';
    const best = p.is_best_seller ? 'BestSeller' : '';
    console.log(
      `${hero}  |  ${String(p.name || '').padEnd(30)}  |  ${String(p.category || '').padEnd(12)}  |  ${feat} ${best}`,
    );
  }
  console.log('-'.repeat(80));
  const heroCount = data.filter((p) => p.is_hero_product).length;
  console.log(`\nTotal: ${data.length} products, ${heroCount} marked as hero`);
}

main();
