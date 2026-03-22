-- Remove third-party "Eazy Chef" (or "Easy Chef") branded products and legacy Paneer Tikka Masala mix.
-- Run in Supabase SQL Editor if those rows still appear on the storefront or in admin.

BEGIN;

DELETE FROM reviews WHERE product_id IN (
  SELECT id FROM products
  WHERE name ILIKE '%eazy chef%'
     OR name ILIKE '%easy chef%'
     OR name ILIKE '%easychef%'
     OR slug IN ('paneer-tikka-masala-mix', 'paneer-tikka-masala')
);

-- product_variants and product_images CASCADE from products when FK is ON DELETE CASCADE
DELETE FROM products
WHERE name ILIKE '%eazy chef%'
   OR name ILIKE '%easy chef%'
   OR name ILIKE '%easychef%'
   OR slug IN ('paneer-tikka-masala-mix', 'paneer-tikka-masala');

COMMIT;
