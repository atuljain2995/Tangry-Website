import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth/session';
import { getDb, schema } from '@/lib/db';
import { getRecipe } from '@/lib/data/recipes';

const { recipeRatings, recipeRatingTotals } = schema;

// ─── GET /api/recipe-ratings?slug=xxx ────────────────────────────────────────
// Public — returns the aggregate plus recent comments for a recipe.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const db = getDb();
  try {
    const [[totalsRow], ratings] = await Promise.all([
      db
        .select({
          rating_avg: recipeRatingTotals.rating_avg,
          rating_count: recipeRatingTotals.rating_count,
        })
        .from(recipeRatingTotals)
        .where(eq(recipeRatingTotals.recipe_slug, slug))
        .limit(1),
      db
        .select({
          id: recipeRatings.id,
          user_name: recipeRatings.user_name,
          rating: recipeRatings.rating,
          comment: recipeRatings.comment,
          created_at: recipeRatings.created_at,
        })
        .from(recipeRatings)
        .where(eq(recipeRatings.recipe_slug, slug))
        .orderBy(desc(recipeRatings.created_at))
        .limit(20),
    ]);

    return NextResponse.json({
      average: Number(totalsRow?.rating_avg ?? 0),
      count: totalsRow?.rating_count ?? 0,
      ratings,
    });
  } catch (error) {
    // Treat a DB failure as "no ratings" rather than a 500 so recipe pages still render.
    console.error('GET /api/recipe-ratings:', error);
    return NextResponse.json({ average: 0, count: 0, ratings: [] });
  }
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

  const now = new Date().toISOString();
  const values = {
    user_name: user.name || 'Anonymous',
    rating: ratingNum,
    comment: cleanComment,
    updated_at: now,
  };
  try {
    await getDb()
      .insert(recipeRatings)
      .values({ recipe_slug: slug.trim(), user_id: user.id, ...values })
      .onConflictDoUpdate({
        target: [recipeRatings.recipe_slug, recipeRatings.user_id],
        set: values,
      });
  } catch (error) {
    console.error('POST /api/recipe-ratings:', error);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
