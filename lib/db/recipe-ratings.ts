import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

export type RecipeRatingSummary = { average: number; count: number };

/**
 * Aggregate rating for a recipe. Returns null when nobody has rated it yet, so
 * callers can omit `aggregateRating` from JSON-LD rather than emitting zeroes.
 */
export async function getRecipeRating(slug: string): Promise<RecipeRatingSummary | null> {
  const t = schema.recipeRatingTotals;
  let row: { rating_avg: number; rating_count: number } | undefined;
  try {
    [row] = await getDb()
      .select({ rating_avg: t.rating_avg, rating_count: t.rating_count })
      .from(t)
      .where(eq(t.recipe_slug, slug))
      .limit(1);
  } catch {
    return null;
  }
  if (!row || !row.rating_count) return null;

  return { average: Number(row.rating_avg), count: row.rating_count };
}
