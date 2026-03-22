-- Rename category label from "Ready to Eat Powders" to "Ready to Eat" (matches PRODUCT_CATEGORIES.title)
UPDATE public.products
SET category = 'Ready to Eat'
WHERE category = 'Ready to Eat Powders';
