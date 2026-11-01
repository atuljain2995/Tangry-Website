-- Move storefront data clean-up out of the frontend and into the database:
--   * consistent variant names ("50 g", "1 kg"), display order and a default variant
--   * explicit bundle flag instead of matching "pack|hamper|combo|gift" in product names
--   * per-product label facts (shelf life, preservatives, veg, storage, origin)
-- Safe to re-run.

BEGIN;

-- Backup of the rows this migration rewrites
CREATE TABLE IF NOT EXISTS product_variants_backup_028 AS
  SELECT * FROM product_variants;

-- ── Products: bundle flag + label facts ──────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_bundle BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shelf_life TEXT,
  ADD COLUMN IF NOT EXISTS no_preservatives BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS storage_instructions TEXT NOT NULL
    DEFAULT 'Store in a cool, dry place away from direct sunlight. Keep the pack sealed.',
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT NOT NULL DEFAULT 'India';

UPDATE products
SET is_bundle = true
WHERE slug IN ('kitchen-essential-pack', 'ready-to-eat-gift-hamper');

-- ── Variants: order + default ────────────────────────────────────────────────
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;

-- Bundles: descriptive names instead of "Default"
UPDATE product_variants v
SET name = CASE p.slug
             WHEN 'kitchen-essential-pack' THEN 'Combo pack'
             WHEN 'ready-to-eat-gift-hamper' THEN 'Gift hamper'
             ELSE v.name
           END
FROM products p
WHERE v.product_id = p.id AND p.is_bundle;

-- Weight-style names ("50 gram", "100g", "50", "1 Kg") -> "50 g" / "1 kg"
UPDATE product_variants v
SET name = CASE
             WHEN parsed.grams >= 1000 THEN trim(to_char(parsed.grams / 1000.0, 'FM999990.##')) || ' kg'
             ELSE parsed.grams::int || ' g'
           END
FROM (
  SELECT id,
         (substring(name FROM '^\s*(\d+(?:\.\d+)?)'))::numeric
           * CASE WHEN name ~* '^\s*\d+(\.\d+)?\s*kgs?\.?\s*$' THEN 1000 ELSE 1 END AS grams
  FROM product_variants
  WHERE name ~* '^\s*\d+(\.\d+)?\s*(g|gm|gms|gram|grams|kg|kgs)?\.?\s*$'
) AS parsed
WHERE v.id = parsed.id;

-- "Default" on single-size products -> label from stored weight (Turmeric confirmed 200 g)
UPDATE product_variants v
SET name = CASE WHEN v.weight >= 1000
                THEN trim(to_char(v.weight / 1000.0, 'FM999990.##')) || ' kg'
                ELSE v.weight || ' g' END
FROM products p
WHERE v.product_id = p.id
  AND NOT p.is_bundle
  AND v.name ~* '^\s*default\s*$'
  AND v.weight > 0;

-- Smallest pack first, and it is the default (business decision: 50 g default)
UPDATE product_variants v
SET display_order = ranked.rn,
    is_default    = (ranked.rn = 1)
FROM (
  SELECT id, row_number() OVER (PARTITION BY product_id ORDER BY weight, price) - 1 AS rn
  FROM product_variants
) AS ranked
WHERE v.id = ranked.id;

-- At most one default per product
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variants_one_default
  ON product_variants (product_id) WHERE is_default;

CREATE INDEX IF NOT EXISTS idx_product_variants_display_order
  ON product_variants (product_id, display_order);

COMMIT;

-- Review, then drop the backup when happy:
--   SELECT p.slug, v.name, v.weight, v.display_order, v.is_default
--   FROM product_variants v JOIN products p ON p.id = v.product_id ORDER BY p.slug, v.display_order;
--   DROP TABLE product_variants_backup_028;
