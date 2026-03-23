-- One-time alignment for databases that already ran the old 002/003 seed.
-- Run in Supabase SQL editor (or psql) after backup if you have live orders tied to old SKUs.

BEGIN;

DELETE FROM reviews WHERE product_id IN (
  SELECT id FROM products WHERE slug IN (
    'garam-masala',
    'paneer-tikka-masala-mix',
    'red-chilli-powder',
    'biryani-masala',
    'turmeric-powder',
    'dabeli-masala',
    'gun-powder-podi',
    'vada-pav-chutney',
    'pav-bhaji-masala'
  )
);

DELETE FROM products WHERE slug IN (
  'garam-masala',
  'paneer-tikka-masala-mix',
  'red-chilli-powder',
  'biryani-masala',
  'turmeric-powder',
  'dabeli-masala',
  'gun-powder-podi',
  'vada-pav-chutney',
  'pav-bhaji-masala'
);

INSERT INTO products (
  slug, name, description, category, images, variants, features, ingredients,
  tags, meta_title, meta_description, keywords, is_featured, is_new, is_best_seller,
  rating, review_count, min_order_quantity
) VALUES
(
  'dabeli-masala',
  'Dabeli Masala',
  'Authentic dabeli masala blended in Jaipur. Warm, tangy, and balanced for stuffed buns and potato filling.',
  'Spices & Masalas',
  ARRAY['/products/dabeli-masala.jpg'],
  '[]'::jsonb,
  ARRAY['Small-batch blended in Jaipur', 'No artificial colours', 'FSSAI licensed facility', 'Sealed for freshness'],
  ARRAY['Coriander', 'Cumin', 'Dry mango', 'Red chilli', 'Cloves', 'Cinnamon', 'Salt', 'Spices'],
  ARRAY['featured', 'masala', 'jaipur'],
  'Dabeli Masala | Authentic blend from Jaipur | Tangry',
  'Buy Tangry Dabeli Masala online—Jaipur-made blend for street-style dabeli. FSSAI licensed.',
  ARRAY['dabeli masala', 'buy dabeli masala', 'jaipur masala', 'tangry'],
  true, false, true,
  4.8, 186, 1
),
(
  'turmeric-powder',
  'Turmeric Powder',
  'Bright, aromatic turmeric (haldi)—essential for everyday cooking. Packed in Jaipur under FSSAI supervision.',
  'Essentials',
  ARRAY['/products/turmeric-powder.jpg'],
  '[]'::jsonb,
  ARRAY['Lab-checked batches', 'Vibrant colour', 'Finely ground', 'Sealed pack'],
  ARRAY['100% Turmeric'],
  ARRAY['essential', 'haldi', 'jaipur'],
  'Turmeric Powder (Haldi) | Tangry Essentials | Jaipur',
  'Pure turmeric powder from Tangry, packed in Jaipur. Shop 100g and 200g packs.',
  ARRAY['turmeric powder', 'haldi', 'buy turmeric online', 'tangry'],
  true, false, true,
  4.9, 412, 1
),
(
  'gun-powder-podi',
  'Gun Powder (Podi Masala)',
  'South Indian–style podi with lentils, chillies, and curry leaves—sprinkle on idli, dosa, or rice.',
  'Ready to Eat',
  ARRAY['/products/gun-powder-podi.jpg'],
  '[]'::jsonb,
  ARRAY['Crunchy lentil base', 'Adjustable heat', 'Resealable pack'],
  ARRAY['Urad dal', 'Chana dal', 'Red chilli', 'Curry leaves', 'Salt', 'Spices'],
  ARRAY['podi', 'gun powder', 'featured'],
  'Gun Powder Podi Masala | Tangry Ready Powders',
  'Tangry Gun Powder (podi)—sprinkle on idli, dosa, or rice. Order online from Jaipur.',
  ARRAY['gun powder masala', 'podi', 'idli podi', 'tangry'],
  true, true, false,
  4.7, 96, 1
),
(
  'vada-pav-chutney',
  'Vada Pav Chutney',
  'Dry garlic-coconut chutney style mix for Mumbai-style vada pav—tangy, garlicky, and addictive.',
  'Ready to Eat',
  ARRAY['/products/vada-pav-chutney.jpg'],
  '[]'::jsonb,
  ARRAY['Garlic-forward', 'Pairs with batata vada', 'Dry sprinkle format', 'Consistent grind'],
  ARRAY['Garlic', 'Coconut', 'Peanuts', 'Red chilli', 'Salt', 'Spices'],
  ARRAY['chutney', 'street food', 'new'],
  'Vada Pav Chutney Powder | Tangry',
  'Dry vada pav chutney mix from Tangry—perfect with batata vada and pav.',
  ARRAY['vada pav chutney', 'dry garlic chutney', 'tangry'],
  false, true, true,
  4.8, 74, 1
),
(
  'pav-bhaji-masala',
  'Pav Bhaji Masala',
  'Rich, red pav bhaji masala for bhaji that tastes like your favourite corner stall.',
  'Spices & Masalas',
  ARRAY['/products/pav-bhaji-masala.jpg'],
  '[]'::jsonb,
  ARRAY['Bold colour & aroma', 'Works with mixed vegetables', 'Small-batch Jaipur blend'],
  ARRAY['Coriander', 'Cumin', 'Fennel', 'Black pepper', 'Dry mango', 'Kashmiri chilli', 'Salt', 'Spices'],
  ARRAY['pav bhaji', 'masala', 'bestseller'],
  'Pav Bhaji Masala | Jaipur blend | Tangry',
  'Shop Tangry Pav Bhaji Masala—200g pack, blended in Jaipur.',
  ARRAY['pav bhaji masala', 'buy pav bhaji masala online', 'tangry'],
  true, false, true,
  4.8, 268, 1
);

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-DBL-200', 89.00, 105.00, 280, 200, true FROM products WHERE slug = 'dabeli-masala'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-TUR-100', 52.00, 62.00, 800, 100, true FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-TUR-200', 98.00, 118.00, 550, 200, true FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-GUN-100', 78.00, 92.00, 220, 100, true FROM products WHERE slug = 'gun-powder-podi'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-VPC-200', 115.00, 135.00, 180, 200, true FROM products WHERE slug = 'vada-pav-chutney'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-PBV-200', 95.00, 112.00, 310, 200, true FROM products WHERE slug = 'pav-bhaji-masala'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, '/products/dabeli-masala.jpg', 'Dabeli Masala — Tangry', 0 FROM products p WHERE slug = 'dabeli-masala'
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, '/products/turmeric-powder.jpg', 'Turmeric Powder — Tangry', 0 FROM products p WHERE slug = 'turmeric-powder'
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, '/products/gun-powder-podi.jpg', 'Gun Powder Podi — Tangry', 0 FROM products p WHERE slug = 'gun-powder-podi'
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, '/products/vada-pav-chutney.jpg', 'Vada Pav Chutney — Tangry', 0 FROM products p WHERE slug = 'vada-pav-chutney'
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT p.id, '/products/pav-bhaji-masala.jpg', 'Pav Bhaji Masala — Tangry', 0 FROM products p WHERE slug = 'pav-bhaji-masala'
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

COMMIT;
