-- Remove unused products.subcategory (not used on storefront or filters)
ALTER TABLE products DROP COLUMN IF EXISTS subcategory;
