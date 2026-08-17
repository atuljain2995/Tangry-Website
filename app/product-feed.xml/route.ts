import { getAllProducts } from '@/lib/db/queries';
import { getDisplayCompareAtPrice } from '@/lib/utils/database';

const SITE_URL = 'https://www.tangryspices.com';

// Google product taxonomy: Food, Beverages & Tobacco > Food Items > Seasonings & Spices
const GOOGLE_CATEGORY = '2660';

export const revalidate = 3600;

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absolute(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

/**
 * Variant names in the DB are inconsistent ("50 g", "50gram", "50", "Default"),
 * so size comes from the numeric weight and the name is only a fallback.
 */
function buildTitle(productName: string, variantName: string, weightGrams: number): string {
  let size = '';
  if (weightGrams >= 1000) {
    size = `${Number((weightGrams / 1000).toFixed(2))}kg`;
  } else if (weightGrams > 0) {
    size = `${weightGrams}g`;
  } else {
    const cleaned = variantName.trim();
    const isPlaceholder =
      !cleaned ||
      cleaned.toLowerCase() === 'default' ||
      productName.toLowerCase().includes(cleaned.toLowerCase());
    size = isPlaceholder ? '' : cleaned;
  }

  const parts = ['Tangry Spices', productName];
  if (size && !productName.toLowerCase().includes(size.toLowerCase())) parts.push(size);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Google Merchant Center feed — one <item> per variant, since each size is a
 * separately purchasable offer. Variants of a product share an item_group_id.
 */
export async function GET() {
  const products = await getAllProducts();
  const items: string[] = [];

  for (const product of products) {
    const link = `${SITE_URL}/products/${product.slug}`;
    const images = product.images.map(absolute);
    const primaryImage = images[0];

    // Merchant Center rejects items without an image, so skip rather than send a broken row.
    if (!primaryImage) continue;

    const additional = images
      .slice(1, 11)
      .map((img) => `      <g:additional_image_link>${esc(img)}</g:additional_image_link>`)
      .join('\n');

    for (const variant of product.variants) {
      const price = Number(variant.price);
      if (!Number.isFinite(price) || price <= 0) continue;

      const available = variant.isAvailable && variant.stock > 0;
      const compareAt = getDisplayCompareAtPrice(price, variant.compareAtPrice, product.discountEnabled);

      // When a sale is running, compare-at is the list price and the live price is the sale price.
      const listPrice = compareAt ?? price;
      const salePrice = compareAt ? price : null;

      const title = buildTitle(product.name, variant.name, variant.weight);

      items.push(
        [
          '    <item>',
          `      <g:id>${esc(variant.sku || variant.id)}</g:id>`,
          `      <g:item_group_id>${esc(product.id)}</g:item_group_id>`,
          `      <g:title>${esc(title.slice(0, 150))}</g:title>`,
          `      <g:description>${esc(product.description.slice(0, 5000))}</g:description>`,
          `      <g:link>${esc(link)}</g:link>`,
          `      <g:image_link>${esc(primaryImage)}</g:image_link>`,
          additional,
          `      <g:availability>${available ? 'in_stock' : 'out_of_stock'}</g:availability>`,
          `      <g:price>${listPrice.toFixed(2)} INR</g:price>`,
          salePrice !== null ? `      <g:sale_price>${salePrice.toFixed(2)} INR</g:sale_price>` : '',
          '      <g:condition>new</g:condition>',
          '      <g:brand>Tangry Spices</g:brand>',
          `      <g:mpn>${esc(variant.sku || variant.id)}</g:mpn>`,
          // No barcodes on these SKUs; Google requires this to be explicit.
          '      <g:identifier_exists>no</g:identifier_exists>',
          `      <g:google_product_category>${GOOGLE_CATEGORY}</g:google_product_category>`,
          `      <g:product_type>${esc(product.category)}</g:product_type>`,
          variant.weight > 0
            ? `      <g:shipping_weight>${variant.weight} g</g:shipping_weight>`
            : '',
          '    </item>',
        ]
          .filter(Boolean)
          .join('\n'),
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Tangry Spices — Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Authentic Rajasthani masalas, ready powders and pickles from Jaipur.</description>
${items.join('\n')}
  </channel>
</rss>
`;

  // getAllProducts() returns [] when Supabase is unreachable. Serving an empty but
  // valid feed would make Merchant Center delist every product, so fail loudly
  // instead and let Google keep the last good fetch.
  if (items.length === 0) {
    return new Response('Product feed temporarily unavailable', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
