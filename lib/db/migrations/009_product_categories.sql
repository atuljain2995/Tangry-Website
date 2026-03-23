-- Canonical product categories in the database; products reference them via category_id.
-- Denormalized products.category (title) is kept in sync by trigger for existing queries/filters.

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL UNIQUE,
  chip_label TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_sort ON product_categories (sort_order, title);

INSERT INTO product_categories (slug, title, chip_label, description, sort_order)
VALUES
  (
    'spices-masalas',
    'Spices & Masalas',
    'Masalas & spices',
    'Regional blends from our Jaipur kitchen—dabeli, pav bhaji, sambhar, chole, rajma, pani puri, and more.',
    1
  ),
  (
    'ready-powders',
    'Ready to Eat',
    NULL,
    'Gun powder (podi), chaat masala, vada pav chutney, bhuna jeera, and everyday finishing spices.',
    2
  ),
  (
    'essentials',
    'Essentials',
    NULL,
    'Pure turmeric and whole jeera (cumin)—the base of every Indian kitchen.',
    3
  ),
  (
    'pickles',
    'Pickles',
    NULL,
    'Traditional lemon, mango, garlic, ker, karonda, mixed veg, and more—homestyle recipes from Rajasthan.',
    4
  )
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES product_categories (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

UPDATE products p
SET category_id = c.id
FROM product_categories c
WHERE p.category IS NOT NULL
  AND TRIM(p.category) = c.title
  AND p.category_id IS NULL;

-- Keep products.category (title) aligned when category_id is set
CREATE OR REPLACE FUNCTION sync_products_category_title()
RETURNS TRIGGER AS $$
DECLARE
  cat_title TEXT;
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    SELECT pc.title INTO STRICT cat_title FROM product_categories pc WHERE pc.id = NEW.category_id;
    NEW.category := cat_title;
  ELSE
    NEW.category := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_sync_category ON products;
CREATE TRIGGER trg_products_sync_category
  BEFORE INSERT OR UPDATE OF category_id ON products
  FOR EACH ROW
  EXECUTE FUNCTION sync_products_category_title();

-- Supabase: allow storefront to read categories (service role bypasses RLS for admin writes)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_categories_select_all" ON product_categories;
CREATE POLICY "product_categories_select_all" ON product_categories
  FOR SELECT
  USING (true);

GRANT SELECT ON product_categories TO anon, authenticated;
