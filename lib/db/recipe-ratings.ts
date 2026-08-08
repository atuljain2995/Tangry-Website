import { supabaseAdmin } from '@/lib/db/supabase';

export type RecipeRatingSummary = { average: number; count: number };

// Generated Database types omit `Relationships`, so supabase-js widens rows to
// `never`. Cast at the boundary, matching the pattern in lib/db/queries.ts.
type TotalsRow = { rating_avg: number; rating_count: number };

/**
 * Aggregate rating for a recipe. Returns null when nobody has rated it yet, so
 * callers can omit `aggregateRating` from JSON-LD rather than emitting zeroes.
 */
export async function getRecipeRating(slug: string): Promise<RecipeRatingSummary | null> {
  const { data, error } = await supabaseAdmin
    .from('recipe_rating_totals')
    .select('rating_avg, rating_count')
    .eq('recipe_slug', slug)
    .maybeSingle();

  const row = data as unknown as TotalsRow | null;
  if (error || !row || !row.rating_count) return null;

  return { average: Number(row.rating_avg), count: row.rating_count };
}
