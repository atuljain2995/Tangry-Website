-- Product variants for Tangry catalog (run after 002_seed_products.sql and 002b_create_variants_tables.sql)

-- Dabeli Masala 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-DBL-200', 89.00, 105.00, 280, 200, true
FROM products WHERE slug = 'dabeli-masala'
ON CONFLICT (sku) DO NOTHING;

-- Turmeric 100g / 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-TUR-100', 52.00, 62.00, 800, 100, true
FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-TUR-200', 98.00, 118.00, 550, 200, true
FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

-- Gun Powder 100g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-GUN-100', 78.00, 92.00, 220, 100, true
FROM products WHERE slug = 'gun-powder-podi'
ON CONFLICT (sku) DO NOTHING;

-- Vada Pav Chutney 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-VPC-200', 115.00, 135.00, 180, 200, true
FROM products WHERE slug = 'vada-pav-chutney'
ON CONFLICT (sku) DO NOTHING;

-- Pav Bhaji Masala 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-PBV-200', 95.00, 112.00, 310, 200, true
FROM products WHERE slug = 'pav-bhaji-masala'
ON CONFLICT (sku) DO NOTHING;

SELECT p.name, COUNT(pv.id) AS variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;
