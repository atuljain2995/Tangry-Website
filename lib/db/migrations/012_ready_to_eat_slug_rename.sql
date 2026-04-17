-- Rename product category slug from "ready-powders" to "ready-to-eat".
UPDATE public.product_categories
SET slug = 'ready-to-eat'
WHERE slug = 'ready-powders';