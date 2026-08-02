-- Hero product flag for homepage carousel (used by admin + queries)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_hero_product BOOLEAN NOT NULL DEFAULT false;
