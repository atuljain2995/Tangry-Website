import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

const ALLOWED_METRICS = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']);
const ALLOWED_RATINGS = new Set(['good', 'needs-improvement', 'poor']);
const ALLOWED_NAV_TYPES = new Set([
  'navigate',
  'reload',
  'back-forward',
  'prerender',
  'back-forward-cache',
  '',
]);

// ── POST /api/vitals ──────────────────────────────────────────────────────────
// Public endpoint — receives CWV beacons from the browser.
// No auth required: data comes from real page loads, not user accounts.
// Payload validated strictly to prevent junk writes.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { url, name, value, rating, id, delta, navigationType } = body as Record<string, unknown>;

  // ── Validate metric name ────────────────────────────────────────────────────
  if (typeof name !== 'string' || !ALLOWED_METRICS.has(name)) {
    return NextResponse.json({ error: 'Invalid metric name' }, { status: 400 });
  }

  // ── Validate numeric value ──────────────────────────────────────────────────
  const numValue = Number(value);
  if (!Number.isFinite(numValue) || numValue < 0) {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
  }

  // ── Validate rating ─────────────────────────────────────────────────────────
  if (typeof rating !== 'string' || !ALLOWED_RATINGS.has(rating)) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
  }

  // ── Validate and sanitise URL ───────────────────────────────────────────────
  // Accept only relative paths from our own origin; strip query strings and
  // fragments to avoid high-cardinality pollution in the table.
  const rawUrl = typeof url === 'string' ? url.trim() : '';
  if (!rawUrl.startsWith('/') || rawUrl.length > 512) {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  const cleanUrl = rawUrl.split('?')[0].split('#')[0];

  // ── Optional fields ─────────────────────────────────────────────────────────
  const numDelta = typeof delta === 'number' && Number.isFinite(delta) ? delta : null;
  const metricId = typeof id === 'string' && id.length <= 120 ? id : null;
  const navType =
    typeof navigationType === 'string' && ALLOWED_NAV_TYPES.has(navigationType)
      ? navigationType || null
      : null;

  // ── Insert ──────────────────────────────────────────────────────────────────
  const { error } = await supabaseAdmin.from('cwv_readings').insert({
    url: cleanUrl,
    metric_name: name,
    value: numValue,
    rating,
    metric_id: metricId,
    delta: numDelta,
    navigation_type: navType,
  } as never);

  if (error) {
    // Log but return 200 — a beacon failure should never surface as an error to the browser.
    console.error('cwv_readings insert:', error);
  }

  return new NextResponse(null, { status: 204 });
}
