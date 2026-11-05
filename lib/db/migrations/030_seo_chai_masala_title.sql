-- Chai masala meta rewrite ahead of the Dec–Jan search peak (Google Trends, Nov 2026).
-- The product page appends " | Tangry Spices" to meta_title, so keep meta_title under ~45 chars.

UPDATE products SET
  meta_title = 'Chai Masala Powder 50g – ₹120, Jaipur',
  meta_description = 'Kadak masala chai at home: dry ginger, cardamom, clove & black pepper blend from Jaipur. 50g for ₹120, ¼ tsp per brew. Free delivery above ₹500.',
  updated_at = NOW()
WHERE slug = 'chai-masala';

-- Rollback:
-- UPDATE products SET meta_title = 'Chai Masala — Buy Online, Jaipur',
--   meta_description = 'Tangry chai masala for kadak tea, milk and desserts. Warm spice blend from Jaipur. From ₹120. FSSAI licensed. Free shipping on orders ₹500+.',
--   updated_at = NOW() WHERE slug = 'chai-masala';
