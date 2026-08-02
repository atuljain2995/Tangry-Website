import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

// ── GET /api/products/cheap-topups ────────────────────────────────────────────
// Cheapest in-stock product variants, used by the cart drawer to suggest specific
// low-price add-ons that push the order over the free-delivery threshold.
export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = Math.min(Math.max(Number(limitParam) || 6, 1), 12);

  const products = await getAllProducts();

  const topups = products
    .flatMap((p) =>
      p.variants
        .filter((v) => v.isAvailable && v.stock > 0)
        .map((v) => ({
          productId: p.id,
          slug: p.slug,
          name: p.name,
          image: p.images[0] ?? '',
          variantId: v.id,
          variantName: v.name,
          price: v.price,
        })),
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);

  return NextResponse.json(topups);
}
