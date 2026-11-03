import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gte, inArray, isNotNull, isNull, lte } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { sendReviewRequestEmail } from '@/lib/email/review-request';

const { orders, products: productsT } = schema;

export const dynamic = 'force-dynamic';

// Ask for a review between 3 and 5 days after delivery.
const MIN_DAYS_AFTER_DELIVERY = 3;
const MAX_DAYS_AFTER_DELIVERY = 5;
// Safety cap so a backlog can't trigger a huge email burst in one run.
const MAX_ORDERS_PER_RUN = 100;

type EligibleOrder = {
  id: string;
  order_number: string;
  user_email: string;
  items: unknown;
};

type OrderItemLike = { productId?: unknown; productName?: unknown };

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  // If no secret is configured, refuse rather than run unauthenticated.
  if (!secret) return false;

  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;

  // Also allow ?secret= for manual/testing triggers.
  const qsSecret = req.nextUrl.searchParams.get('secret');
  return qsSecret === secret;
}

function extractProductIds(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  const ids: string[] = [];
  for (const raw of items) {
    if (raw && typeof raw === 'object') {
      const pid = (raw as OrderItemLike).productId;
      if (typeof pid === 'string' && pid.trim()) ids.push(pid);
    }
  }
  return ids;
}

/**
 * GET /api/cron/review-requests
 * Sends post-purchase review requests for orders delivered 3–5 days ago that
 * haven't been asked yet. Protected by CRON_SECRET (Vercel Cron sends it as a
 * Bearer token). Idempotent: each order is stamped review_request_sent_at.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = new Date(now - MAX_DAYS_AFTER_DELIVERY * 86_400_000).toISOString();
  const windowEnd = new Date(now - MIN_DAYS_AFTER_DELIVERY * 86_400_000).toISOString();

  const db = getDb();
  let eligible: EligibleOrder[];
  try {
    eligible = (await db
      .select({
        id: orders.id,
        order_number: orders.order_number,
        user_email: orders.user_email,
        items: orders.items,
      })
      .from(orders)
      .where(
        and(
          eq(orders.order_status, 'delivered'),
          isNull(orders.review_request_sent_at),
          isNotNull(orders.delivered_at),
          gte(orders.delivered_at, windowStart),
          lte(orders.delivered_at, windowEnd),
        ),
      )
      .limit(MAX_ORDERS_PER_RUN)) as unknown as EligibleOrder[];
  } catch (error) {
    console.error('review-requests cron: fetch failed', error);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }

  if (eligible.length === 0) {
    return NextResponse.json({ processed: 0, sent: 0 });
  }

  // Resolve product slugs/names for all products referenced across eligible orders.
  const allProductIds = Array.from(new Set(eligible.flatMap((o) => extractProductIds(o.items))));
  const slugById = new Map<string, { slug: string; name: string }>();
  if (allProductIds.length > 0) {
    const rows = await db
      .select({ id: productsT.id, slug: productsT.slug, name: productsT.name })
      .from(productsT)
      .where(inArray(productsT.id, allProductIds));
    for (const p of rows) {
      slugById.set(p.id, { slug: p.slug, name: p.name });
    }
  }

  let sent = 0;
  for (const order of eligible) {
    const productIds = extractProductIds(order.items);
    const products = productIds
      .map((id) => slugById.get(id))
      .filter((p): p is { slug: string; name: string } => Boolean(p?.slug));

    let emailed = false;
    if (order.user_email?.trim() && products.length > 0) {
      try {
        emailed = await sendReviewRequestEmail({
          to: order.user_email,
          orderNumber: order.order_number,
          products,
        });
      } catch (err) {
        console.error('review-requests cron: email failed for', order.order_number, err);
      }
    }

    // Stamp the order regardless of email success (missing address/products, or
    // Resend not configured) so we don't retry indefinitely on the next run.
    try {
      await db
        .update(orders)
        .set({ review_request_sent_at: new Date().toISOString() })
        .where(eq(orders.id, order.id));
    } catch (stampError) {
      console.error('review-requests cron: stamp failed for', order.order_number, stampError);
      continue;
    }
    if (emailed) sent += 1;
  }

  return NextResponse.json({ processed: eligible.length, sent });
}
