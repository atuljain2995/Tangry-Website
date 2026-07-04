// Check products with missing images (would fallback to logo-512.png)
// Run: npx tsx scripts/check-product-images.ts

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local before importing anything else
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductImages() {
  console.log('🔍 Checking products for missing images...\n');
  console.log('Products without real images will fallback to logo-512.png\n');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, images')
      .order('name');

    if (productsError) {
      console.error('❌ Failed to fetch products:', productsError.message);
      process.exit(1);
    }

    // Get all product images from product_images table
    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select('product_id, url, alt_text');

    if (imagesError) {
      console.error('❌ Failed to fetch product_images:', imagesError.message);
      process.exit(1);
    }

    // Group images by product_id
    const imagesByProductId = new Map<string, any[]>();
    productImages?.forEach((img) => {
      const existing = imagesByProductId.get(img.product_id) || [];
      existing.push(img);
      imagesByProductId.set(img.product_id, existing);
    });

    console.log(`📦 Total products: ${products?.length || 0}`);
    console.log(`🖼️  Total product images in product_images table: ${productImages?.length || 0}\n`);

    // Find products with missing images
    const productsWithoutImages: any[] = [];
    const productsWithImages: any[] = [];
    const productsWithLogoFallback: any[] = [];

    products?.forEach((product) => {
      const productImagesCount = imagesByProductId.get(product.id)?.length || 0;
      const legacyImages = product.images as string[] | null;
      const legacyImagesCount = legacyImages?.length || 0;

      // Check if any images contain logo-512.png
      const hasLogoFallback =
        legacyImages?.some((img) => img?.includes('logo-512.png')) ||
        imagesByProductId.get(product.id)?.some((img) => img.url?.includes('logo-512.png'));

      if (hasLogoFallback) {
        productsWithLogoFallback.push({
          name: product.name,
          slug: product.slug,
          productImagesCount,
          legacyImagesCount,
          images: imagesByProductId.get(product.id) || [],
          legacyImages: legacyImages || [],
        });
      } else if (productImagesCount === 0 && legacyImagesCount === 0) {
        productsWithoutImages.push({
          name: product.name,
          slug: product.slug,
        });
      } else {
        productsWithImages.push({
          name: product.name,
          slug: product.slug,
          productImagesCount,
          legacyImagesCount,
        });
      }
    });

    // Report
    console.log('=' .repeat(60));
    console.log('PRODUCTS WITHOUT ANY IMAGES (will use logo-512.png fallback):');
    console.log('=' .repeat(60));
    if (productsWithoutImages.length === 0) {
      console.log('✅ None! All products have at least one image.');
    } else {
      productsWithoutImages.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (/${p.slug})`);
      });
    }

    console.log('\n');
    console.log('=' .repeat(60));
    console.log('PRODUCTS EXPLICITLY USING logo-512.png:');
    console.log('=' .repeat(60));
    if (productsWithLogoFallback.length === 0) {
      console.log('✅ None found.');
    } else {
      productsWithLogoFallback.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (/${p.slug})`);
        console.log(`   - product_images entries: ${p.productImagesCount}`);
        console.log(`   - legacy images column: ${p.legacyImagesCount}`);
        if (p.images.length > 0) {
          console.log(`   - URLs: ${p.images.map((img: any) => img.url).join(', ')}`);
        }
        if (p.legacyImages.length > 0) {
          console.log(`   - Legacy URLs: ${p.legacyImages.join(', ')}`);
        }
      });
    }

    console.log('\n');
    console.log('=' .repeat(60));
    console.log('PRODUCTS WITH REAL IMAGES:');
    console.log('=' .repeat(60));
    productsWithImages.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.productImagesCount} images (legacy: ${p.legacyImagesCount})`);
    });

    console.log('\n');
    console.log('=' .repeat(60));
    console.log('SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Products with real images: ${productsWithImages.length}`);
    console.log(`⚠️  Products without any images: ${productsWithoutImages.length}`);
    console.log(`❌ Products with logo-512.png: ${productsWithLogoFallback.length}`);

    if (productsWithoutImages.length > 0 || productsWithLogoFallback.length > 0) {
      console.log('\n⚠️  ACTION REQUIRED: Add real product images to fix SEO issues.');
      console.log('   Products without images will show logo-512.png which:');
      console.log('   - Blocks rich results eligibility');
      console.log('   - Fails Google Shopping requirements');
      console.log('   - Hurts visual search optimization');
    } else {
      console.log('\n🎉 All products have real images. No logo-512.png fallback issues!');
    }

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

checkProductImages();
