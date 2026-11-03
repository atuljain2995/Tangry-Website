// Check products with missing images (would fallback to logo-512.png)
// Run: npx tsx scripts/check-product-images.ts

import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();
const db = connectNeon();

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
};

type ProductImageRow = {
  product_id: string;
  url: string;
  alt_text: string | null;
};

type ProductSummary = {
  name: string;
  slug: string;
  productImagesCount?: number;
  legacyImagesCount?: number;
  images?: ProductImageRow[];
  legacyImages?: string[];
};

async function checkProductImages() {
  console.log('🔍 Checking products for missing images...\n');
  console.log('Products without real images will fallback to logo-512.png\n');

  try {
    const { rows: products } = await db.query(
      'SELECT id, name, slug, images FROM products ORDER BY name',
    );
    const { rows: productImages } = await db.query(
      'SELECT product_id, url, alt_text FROM product_images',
    );

    // Group images by product_id
    const imagesByProductId = new Map<string, ProductImageRow[]>();
    (productImages as unknown as ProductImageRow[]).forEach((img) => {
      const existing = imagesByProductId.get(img.product_id) || [];
      existing.push(img);
      imagesByProductId.set(img.product_id, existing);
    });

    console.log(`📦 Total products: ${products?.length || 0}`);
    console.log(`🖼️  Total product images in product_images table: ${productImages?.length || 0}\n`);

    // Find products with missing images
    const productsWithoutImages: ProductSummary[] = [];
    const productsWithImages: ProductSummary[] = [];
    const productsWithLogoFallback: ProductSummary[] = [];

    (products as unknown as ProductRow[]).forEach((product) => {
      const productImagesCount = imagesByProductId.get(product.id)?.length || 0;
      const legacyImages = product.images;
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
    console.log('='.repeat(60));
    console.log('PRODUCTS WITHOUT ANY IMAGES (will use logo-512.png fallback):');
    console.log('='.repeat(60));
    if (productsWithoutImages.length === 0) {
      console.log('✅ None! All products have at least one image.');
    } else {
      productsWithoutImages.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (/${p.slug})`);
      });
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('PRODUCTS EXPLICITLY USING logo-512.png:');
    console.log('='.repeat(60));
    if (productsWithLogoFallback.length === 0) {
      console.log('✅ None found.');
    } else {
      productsWithLogoFallback.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (/${p.slug})`);
        console.log(`   - product_images entries: ${p.productImagesCount}`);
        console.log(`   - legacy images column: ${p.legacyImagesCount}`);
        if (p.images && p.images.length > 0) {
          console.log(`   - URLs: ${p.images.map((img) => img.url).join(', ')}`);
        }
        if (p.legacyImages && p.legacyImages.length > 0) {
          console.log(`   - Legacy URLs: ${p.legacyImages.join(', ')}`);
        }
      });
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('PRODUCTS WITH REAL IMAGES:');
    console.log('='.repeat(60));
    productsWithImages.forEach((p, i) => {
      console.log(
        `${i + 1}. ${p.name} - ${p.productImagesCount} images (legacy: ${p.legacyImagesCount})`,
      );
    });

    console.log('\n');
    console.log('='.repeat(60));
    console.log('SUMMARY:');
    console.log('='.repeat(60));
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
  } finally {
    await db.end();
  }
}

checkProductImages();
