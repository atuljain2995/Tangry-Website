// Test database connection
// Run: npx tsx scripts/test-db-connection.ts

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local before importing anything else
config({ path: resolve(process.cwd(), '.env.local') });

// Now import after env vars are loaded
import { createClient } from '@supabase/supabase-js';

// Create client with loaded env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Fetch products
    console.log('Test 1: Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug')
      .limit(5);

    if (productsError) {
      console.error('❌ Products fetch failed:', productsError.message);
      console.error('Error details:', JSON.stringify(productsError, null, 2));
      return false;
    }

    console.log('✅ Products fetched successfully:');
    console.log(products);
    console.log('');

    // Test 2: Count products
    console.log('Test 2: Counting products...');
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count failed:', countError.message);
      return false;
    }

    console.log(`✅ Total products in database: ${count}`);
    console.log('');

    // Test 3: Check email subscribers table
    console.log('Test 3: Checking email_subscribers table...');
    const { error: subscribersError } = await supabase
      .from('email_subscribers')
      .select('count');

    if (subscribersError) {
      console.log('⚠️  email_subscribers table might not exist yet');
    } else {
      console.log('✅ email_subscribers table exists');
    }
    console.log('');

    // Test 4: Check orders table
    console.log('Test 4: Checking orders table...');
    const { error: ordersError } = await supabase
      .from('orders')
      .select('count');

    if (ordersError) {
      console.log('⚠️  orders table might not exist yet');
    } else {
      console.log('✅ orders table exists');
    }
    console.log('');

    console.log('🎉 Database connection test completed!');
    console.log('');
    console.log('Summary:');
    console.log('- Supabase connection: ✅ Working');
    console.log('- Products table: ✅ Accessible');
    console.log(`- Sample data: ${products?.length || 0} products found`);

    return true;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Unexpected error:', err.message || error);
    if (err.cause) {
      console.error('Error cause:', err.cause);
    }
    console.log('');
    console.log('Environment check:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check if NEXT_PUBLIC_SUPABASE_URL is set in .env.local');
    console.log('2. Check if NEXT_PUBLIC_SUPABASE_ANON_KEY is set in .env.local');
    console.log('3. Verify migrations have been run in Supabase SQL Editor');
    console.log('4. Check if tables exist in Supabase Table Editor');
    console.log('5. Check your internet connection');
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

