import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';

// ─── GET /api/reviews?productId=xxx ──────────────────────────────────────────
// Public — fetches all reviews for a product, newest first.
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('id, user_name, rating, title, comment, is_verified_purchase, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
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
    return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
  }
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) {
    return NextResponse.json({ error: 'Title must be between 3 and 120 characters' }, { status: 400 });
  }
  if (typeof comment !== 'string' || comment.trim().length < 10 || comment.trim().length > 1500) {
    return NextResponse.json({ error: 'Review must be between 10 and 1500 characters' }, { status: 400 });
  }

  // ── Verify product exists ─────────────────────────────────────────────────
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', productId.trim())
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // ── Prevent duplicate reviews from the same user ──────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('product_id', productId.trim())
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
  }

  // ── Check verified purchase ───────────────────────────────────────────────
  // orders.items is a JSONB array of CartItem objects; check if any delivered/completed
  // order for this user contains this productId.
  let isVerifiedPurchase = false;
  try {
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .in('order_status', ['delivered', 'completed'])
      .filter('items', 'cs', JSON.stringify([{ productId: productId.trim() }]))
      .limit(1);

    isVerifiedPurchase = Array.isArray(orders) && orders.length > 0;
  } catch {
    // Non-fatal — proceed without verified flag
    isVerifiedPurchase = false;
  }

  // ── Insert review ─────────────────────────────────────────────────────────
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('reviews')
    .insert({
      product_id: productId.trim(),
      user_id: user.id,
      user_name: user.name || 'Anonymous',
      rating: ratingNum,
      title: title.trim(),
      comment: comment.trim(),
      is_verified_purchase: isVerifiedPurchase,
    } as never)
    .select('id, user_name, rating, title, comment, is_verified_purchase, created_at')
    .single();

  if (insertError) {
    console.error('POST /api/reviews insert:', insertError);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
}
