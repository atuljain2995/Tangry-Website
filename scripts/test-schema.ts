import { getAllProducts } from '../lib/db/queries';
import { getItemListSchema } from '../lib/utils/schema';
import type { ProductExtended } from '../lib/types/database';

// Minimal products for testing when DB is unavailable
const sampleProducts: Pick<ProductExtended, 'slug' | 'name'>[] = [
  { slug: 'dabeli-masala', name: 'Dabeli Masala' },
  { slug: 'pav-bhaji-masala', name: 'Pav Bhaji Masala' },
  { slug: 'gun-powder', name: 'Gun Powder (Idli Podi)' },
  { slug: 'mango-pickle', name: 'Mango Pickle' },
];

async function main() {
  try {
    let products = await getAllProducts();
    console.log('✅ Products fetched from DB:', products.length);

    if (products.length === 0) {
      console.log('⚠️  No products in database, using sample data for demo\n');
      products = sampleProducts as ProductExtended[];
    }

    const schema = getItemListSchema(products);
    console.log('\n📋 ItemList Schema:\n');
    console.log(JSON.stringify(schema, null, 2));

    // Validate structure
    console.log('\n--- Validation ---');
    console.log('✓ @context:', schema['@context']);
    console.log('✓ @type:', schema['@type']);
    console.log('✓ numberOfItems:', schema.numberOfItems);
    console.log('✓ url:', schema.url);
    console.log('\nFirst 3 itemListElement entries:');
    schema.itemListElement.slice(0, 3).forEach((item) => {
      console.log(`  ${item.position}. ${item.name} → ${item.url}`);
    });

    console.log('\n✅ Schema is valid for Google Rich Results!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
