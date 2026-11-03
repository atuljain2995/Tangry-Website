-- CTR rewrites for product pages with page-one rankings but low clicks (GSC, Aug–Nov 2026).
-- The product page appends " | Tangry Spices" to meta_title, so keep meta_title under ~45 chars.

UPDATE products SET
  meta_title = 'Tangy Peri Peri Masala Pouch 50g – ₹75',
  meta_description = 'Tangy chilli-garlic peri peri masala in a 50g pouch, ₹75. Shake on fries, corn, popcorn & paneer. Made in Jaipur, FSSAI certified. Free delivery above ₹500.',
  updated_at = NOW()
WHERE slug = 'peri-peri-masala';

UPDATE products SET
  meta_title = 'Hari Mirch Achar – Green Chilli Pickle, Jaipur',
  meta_description = 'Homestyle hari mirch achar from Jaipur: sharp green chilli heat with a mustard-forward tang. Pairs with paratha, dal chawal & thali. Free delivery above ₹500.',
  updated_at = NOW()
WHERE slug = 'green-chilli-pickle';

-- Rollback (values from backups/db-export-latest.json):
-- UPDATE products SET meta_title = 'Tangy Peri Peri Masala — Buy Online | Tangry Spices, Jaipur',
--   meta_description = 'Shop Tangry''s tangy peri peri masala for fries, corn, popcorn & grills. Bold chilli-garlic heat, made in Jaipur. FSSAI licensed. Free shipping on orders ₹500+.',
--   updated_at = NOW() WHERE slug = 'peri-peri-masala';
-- UPDATE products SET meta_title = 'Green Chilli Pickle — Buy Online, Jaipur',
--   meta_description = 'Spicy green chilli pickle from Tangry Spices, Jaipur. Homestyle Rajasthani side for paratha and dal chawal. FSSAI licensed. Free shipping ₹500+.',
--   updated_at = NOW() WHERE slug = 'green-chilli-pickle';
