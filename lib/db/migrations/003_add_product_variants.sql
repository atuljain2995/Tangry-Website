-- Migration: Add product variants for existing products
-- Run this after running 002_seed_products.sql

-- Insert variants for Garam Masala
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '50g',
    'EVR-GM-50',
    45.00,
    55.00,
    500,
    50,
    true
FROM products WHERE slug = 'garam-masala';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '100g',
    'EVR-GM-100',
    85.00,
    105.00,
    450,
    100,
    true
FROM products WHERE slug = 'garam-masala';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '200g',
    'EVR-GM-200',
    165.00,
    195.00,
    300,
    200,
    true
FROM products WHERE slug = 'garam-masala';

-- Insert variants for Turmeric Powder
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '50g',
    'EVR-TUR-50',
    30.00,
    40.00,
    800,
    50,
    true
FROM products WHERE slug = 'turmeric-powder';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '100g',
    'EVR-TUR-100',
    55.00,
    70.00,
    750,
    100,
    true
FROM products WHERE slug = 'turmeric-powder';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '200g',
    'EVR-TUR-200',
    105.00,
    135.00,
    600,
    200,
    true
FROM products WHERE slug = 'turmeric-powder';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '500g',
    'EVR-TUR-500',
    245.00,
    295.00,
    200,
    500,
    true
FROM products WHERE slug = 'turmeric-powder';

-- Insert variants for Eazy Chef - Paneer Tikka Masala
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '50g',
    'EVR-EC-PTM-50',
    65.00,
    NULL,
    300,
    50,
    true
FROM products WHERE slug = 'eazy-chef-paneer-tikka-masala';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '100g',
    'EVR-EC-PTM-100',
    120.00,
    NULL,
    250,
    100,
    true
FROM products WHERE slug = 'eazy-chef-paneer-tikka-masala';

-- Insert variants for Red Chilli Powder
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '100g',
    'EVR-RCP-100',
    55.00,
    65.00,
    900,
    100,
    true
FROM products WHERE slug = 'red-chilli-powder';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '200g',
    'EVR-RCP-200',
    105.00,
    125.00,
    700,
    200,
    true
FROM products WHERE slug = 'red-chilli-powder';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '500g',
    'EVR-RCP-500',
    245.00,
    295.00,
    300,
    500,
    true
FROM products WHERE slug = 'red-chilli-powder';

-- Insert variants for Biryani Masala
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '50g',
    'EVR-BM-50',
    50.00,
    60.00,
    400,
    50,
    true
FROM products WHERE slug = 'biryani-masala';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '100g',
    'EVR-BM-100',
    95.00,
    115.00,
    350,
    100,
    true
FROM products WHERE slug = 'biryani-masala';

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT 
    id,
    '200g',
    'EVR-BM-200',
    185.00,
    220.00,
    250,
    200,
    true
FROM products WHERE slug = 'biryani-masala';

-- Verify the inserts
SELECT 
    p.name,
    COUNT(pv.id) as variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;

