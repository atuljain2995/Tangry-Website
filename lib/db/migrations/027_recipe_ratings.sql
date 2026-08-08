-- Migration 027: Recipe ratings
-- Deliberately separate from `reviews`: a rating of a masala is not a rating of
-- a recipe, so conflating them would misrepresent both.
-- Recipes live in code (lib/data/recipes.ts), so rows key on slug rather than an FK.

CREATE TABLE IF NOT EXISTS recipe_ratings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_slug  VARCHAR(200) NOT NULL,
    user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name    VARCHAR(255) NOT NULL,
    rating       INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment      TEXT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One rating per user per recipe; re-submitting updates the existing row.
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipe_ratings_slug_user
    ON recipe_ratings (recipe_slug, user_id);

CREATE INDEX IF NOT EXISTS idx_recipe_ratings_slug
    ON recipe_ratings (recipe_slug);

CREATE INDEX IF NOT EXISTS idx_recipe_ratings_created_at
    ON recipe_ratings (created_at DESC);

-- Denormalised aggregates, read at build/ISR time for Recipe JSON-LD.
CREATE TABLE IF NOT EXISTS recipe_rating_totals (
    recipe_slug  VARCHAR(200) PRIMARY KEY,
    rating_avg   NUMERIC(3, 2) NOT NULL DEFAULT 0,
    rating_count INTEGER       NOT NULL DEFAULT 0,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION sync_recipe_rating_totals()
RETURNS TRIGGER AS $$
DECLARE
  target_slug VARCHAR(200);
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_slug := OLD.recipe_slug;
  ELSE
    target_slug := NEW.recipe_slug;
  END IF;

  INSERT INTO recipe_rating_totals (recipe_slug, rating_avg, rating_count, updated_at)
  SELECT
    target_slug,
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
    COUNT(*),
    NOW()
  FROM recipe_ratings
  WHERE recipe_slug = target_slug
  ON CONFLICT (recipe_slug) DO UPDATE
    SET rating_avg   = EXCLUDED.rating_avg,
        rating_count = EXCLUDED.rating_count,
        updated_at   = NOW();

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_recipe_rating_totals ON recipe_ratings;

CREATE TRIGGER trg_sync_recipe_rating_totals
AFTER INSERT OR UPDATE OR DELETE ON recipe_ratings
FOR EACH ROW EXECUTE FUNCTION sync_recipe_rating_totals();

-- All access goes through the service role in API routes; no anon/authenticated
-- policies are defined, so direct client access is denied by default.
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_rating_totals ENABLE ROW LEVEL SECURITY;
