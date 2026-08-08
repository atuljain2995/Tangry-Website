import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/supabase';
import { getRecipe } from '@/lib/data/recipes';

// ─── GET /api/recipe-ratings?slug=xxx ────────────────────────────────────────
// Public — returns the aggregate plus recent comments for a recipe.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const [{ data: totals }, { data: ratings, error }] = await Promise.all([
    supabaseAdmin
      .from('recipe_rating_totals')
      .select('rating_avg, rating_count')
      .eq('recipe_slug', slug)
      .maybeSingle(),
    supabaseAdmin
      .from('recipe_ratings')
      .select('id, user_name, rating, comment, created_at')
      .eq('recipe_slug', slug)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  // Before migration 027 runs the tables are absent; treat that as "no ratings"
  // rather than a 500 so recipe pages still render.
  if (error) {
    console.error('GET /api/recipe-ratings:', error);
    return NextResponse.json({ average: 0, count: 0, ratings: [] });
  }

  const totalsRow = totals as unknown as { rating_avg: number; rating_count: number } | null;

  return NextResponse.json({
    average: Number(totalsRow?.rating_avg ?? 0),
    count: totalsRow?.rating_count ?? 0,
    ratings: ratings ?? [],
  });
}

// ─── POST /api/recipe-ratings ────────────────────────────────────────────────
// Auth-required — creates or updates the caller's rating for a recipe.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to rate a recipe' }, { status: 401 });
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

  const { slug, rating, comment } = body as Record<string, unknown>;

  if (typeof slug !== 'string' || !getRecipe(slug.trim())) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: 'Rating must be an integer between 1 and 5' },
      { status: 400 },
    );
  }

  let cleanComment: string | null = null;
  if (comment !== undefined && comment !== null && comment !== '') {
    if (typeof comment !== 'string' || comment.trim().length > 1500) {
      return NextResponse.json({ error: 'Comment must be under 1500 characters' }, { status: 400 });
    }
    cleanComment = comment.trim() || null;
  }

  const { error } = await supabaseAdmin.from('recipe_ratings').upsert(
    {
      recipe_slug: slug.trim(),
      user_id: user.id,
      user_name: user.name || 'Anonymous',
      rating: ratingNum,
      comment: cleanComment,
      updated_at: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    { onConflict: 'recipe_slug,user_id' },
  );

  if (error) {
    console.error('POST /api/recipe-ratings:', error);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
