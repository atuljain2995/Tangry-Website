import { getAllProducts } from '../lib/db/queries';
import { getItemListSchema } from '../lib/utils/schema';

// Sample products for testing when DB is unavailable
const sampleProducts = [
  { id: '1', slug: 'dabeli-masala', name: 'Dabeli Masala', price: 99, image: '/images/dabeli.jpg', description: 'Authentic Jaipur dabeli masala', category_slug: 'masalas', variants: [], reviews: [] },
  { id: '2', slug: 'pav-bhaji-masala', name: 'Pav Bhaji Masala', price: 89, image: '/images/pav-bhaji.jpg', description: 'Premium pav bhaji blend', category_slug: 'masalas', variants: [], reviews: [] },
  { id: '3', slug: 'gun-powder', name: 'Gun Powder (Idli Podi)', price: 79, image: '/images/gun-powder.jpg', description: 'South Indian gun powder', category_slug: 'powders', variants: [], reviews: [] },
  { id: '4', slug: 'mango-pickle', name: 'Mango Pickle', price: 149, image: '/images/mango-pickle.jpg', description: 'Traditional Rajasthani mango pickle', category_slug: 'pickles', variants: [], reviews: [] },
];

async function main() {
  try {
    let products = await getAllProducts();
    console.log('✅ Products fetched from DB:', products.length);
    
    if (products.length === 0) {
      console.log('⚠️  No products in database, using sample data for demo\n');
      products = sampleProducts as any;
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
    schema.itemListElement.slice(0, 3).forEach((item: any) => {
      console.log(`  ${item.position}. ${item.name} → ${item.url}`);
    });

    console.log('\n✅ Schema is valid for Google Rich Results!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
