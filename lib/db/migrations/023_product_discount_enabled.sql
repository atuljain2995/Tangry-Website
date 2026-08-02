-- Storefront discount display is opt-in per product (admin toggles "Show discount").
-- compare_at_price on variants is hidden until discount_enabled = true.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS discount_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN products.discount_enabled IS
  'When true, product cards and PDP show compare-at MRP and discount badges.';
