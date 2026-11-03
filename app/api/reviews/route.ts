import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth/session';
import { getDb, schema } from '@/lib/db';

const { reviews, products, orders } = schema;

const publicReviewColumns = {
  id: reviews.id,
  user_name: reviews.user_name,
  rating: reviews.rating,
  title: reviews.title,
  comment: reviews.comment,
  is_verified_purchase: reviews.is_verified_purchase,
  created_at: reviews.created_at,
};

// ─── GET /api/reviews?productId=xxx ──────────────────────────────────────────
// Public — fetches all reviews for a product, newest first.
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  try {
    const rows = await getDb()
      .select(publicReviewColumns)
      .from(reviews)
      .where(eq(reviews.product_id, productId))
      .orderBy(desc(reviews.created_at));
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────
// Auth-required — submits a new review for a product.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to leave a review' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { productId, rating, title, comment } = body as Record<string, unknown>;

  // ── Input validation ──────────────────────────────────────────────────────
  if (typeof productId !== 'string' || !productId.trim()) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: 'Rating must be an integer between 1 and 5' },
      { status: 400 },
    );
  }
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) {
    return NextResponse.json(
      { error: 'Title must be between 3 and 120 characters' },
      { status: 400 },
    );
  }
  if (typeof comment !== 'string' || comment.trim().length < 10 || comment.trim().length > 1500) {
    return NextResponse.json(
      { error: 'Review must be between 10 and 1500 characters' },
      { status: 400 },
    );
  }

  // ── Verify product exists ─────────────────────────────────────────────────
  const db = getDb();
  const pid = productId.trim();
  const product = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, pid))
    .limit(1)
    .then(([row]) => row)
    .catch(() => undefined);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // ── Prevent duplicate reviews from the same user ──────────────────────────
  const existing = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.product_id, pid), eq(reviews.user_id, user.id)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
  }

  // ── Check verified purchase ───────────────────────────────────────────────
  // orders.items is a JSONB array of CartItem objects; check if any delivered/completed
  // order for this user contains this productId.
  let isVerifiedPurchase = false;
  try {
    const matching = await db
      .select({ id: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.user_id, user.id),
          inArray(orders.order_status, ['delivered', 'completed']),
          sql`${orders.items} @> ${JSON.stringify([{ productId: pid }])}::jsonb`,
        ),
      )
      .limit(1);

    isVerifiedPurchase = matching.length > 0;
  } catch {
    // Non-fatal — proceed without verified flag
    isVerifiedPurchase = false;
  }

  // ── Insert review ─────────────────────────────────────────────────────────
  let inserted;
  try {
    [inserted] = await db
      .insert(reviews)
      .values({
        product_id: pid,
        user_id: user.id,
        user_name: user.name || 'Anonymous',
        rating: ratingNum,
        title: title.trim(),
        comment: comment.trim(),
        is_verified_purchase: isVerifiedPurchase,
      })
      .returning(publicReviewColumns);
  } catch (insertError) {
    console.error('POST /api/reviews insert:', insertError);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
}
