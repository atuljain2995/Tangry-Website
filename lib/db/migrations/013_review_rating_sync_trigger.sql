-- Migration 013: Auto-sync products.rating and products.review_count from the reviews table
-- This trigger fires after any INSERT, UPDATE, or DELETE on the reviews table,
-- keeping the denormalized aggregate columns accurate without query-time joins.

CREATE OR REPLACE FUNCTION sync_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  -- For DELETE, use OLD; for INSERT/UPDATE, use NEW
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE products
  SET
    rating       = COALESCE((
                     SELECT ROUND(AVG(rating)::numeric, 2)
                     FROM reviews
                     WHERE product_id = target_product_id
                   ), 0),
    review_count = (
                     SELECT COUNT(*)
                     FROM reviews
                     WHERE product_id = target_product_id
                   ),
    updated_at   = NOW()
  WHERE id = target_product_id;

  RETURN NULL; -- AFTER trigger; return value is ignored
END;
$$ LANGUAGE plpgsql;

-- Drop trigger first to allow re-running this migration idempotently
DROP TRIGGER IF EXISTS trg_sync_product_rating ON reviews;

CREATE TRIGGER trg_sync_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION sync_product_rating();

-- Backfill: recalculate rating + review_count for all products from existing review data
UPDATE products p
SET
  rating       = COALESCE((
                   SELECT ROUND(AVG(r.rating)::numeric, 2)
                   FROM reviews r
                   WHERE r.product_id = p.id
                 ), 0),
  review_count = (
                   SELECT COUNT(*)
                   FROM reviews r
                   WHERE r.product_id = p.id
                 );
