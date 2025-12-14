-- Seed initial products data
-- Run this after 001_initial_schema.sql

INSERT INTO products (
    slug, name, description, category, subcategory, images, variants, features, ingredients, 
    tags, meta_title, meta_description, keywords, is_featured, is_new, is_best_seller,
    rating, review_count, min_order_quantity
) VALUES
(
    'garam-masala',
    'Garam Masala',
    'A royal blend of 13 authentic spices perfect for rich curries and special occasions. Our signature Garam Masala brings the authentic taste of India to your kitchen.',
    'Blended Spices',
    'Premium Blends',
    ARRAY['/products/garam-masala-1.jpg', '/products/garam-masala-2.jpg'],
    '[
        {"id": "gm-50g", "name": "50g", "sku": "EVR-GM-50", "price": 45, "compareAtPrice": 55, "stock": 500, "weight": 50, "isAvailable": true},
        {"id": "gm-100g", "name": "100g", "sku": "EVR-GM-100", "price": 85, "compareAtPrice": 100, "stock": 300, "weight": 100, "isAvailable": true},
        {"id": "gm-200g", "name": "200g", "sku": "EVR-GM-200", "price": 160, "compareAtPrice": 190, "stock": 200, "weight": 200, "isAvailable": true}
    ]'::jsonb,
    ARRAY['Blend of 13 premium spices', 'No artificial colors or preservatives', 'Triple-washed and sun-dried', 'Perfect for curries and gravies'],
    ARRAY['Coriander', 'Cumin', 'Black Pepper', 'Cardamom', 'Cinnamon', 'Cloves', 'Bay Leaf', 'Nutmeg', 'Mace'],
    ARRAY['best-seller', 'premium', 'authentic'],
    'Buy Garam Masala Online - Authentic Indian Spice Blend | Tangry',
    'Premium Garam Masala made from 13 authentic spices. Perfect for curries, gravies & traditional dishes. Free shipping on orders above ₹499.',
    ARRAY['garam masala', 'buy garam masala online', 'indian spice blend', 'authentic garam masala'],
    true, false, true,
    4.8, 1247, 1
),
(
    'turmeric-powder',
    'Turmeric Powder',
    'Pure, organic turmeric powder with high curcumin content. Sourced from the best farms in India for authentic color and health benefits.',
    'Pure Spices',
    NULL,
    ARRAY['/products/turmeric-1.jpg', '/products/turmeric-2.jpg'],
    '[
        {"id": "tp-100g", "name": "100g", "sku": "EVR-TP-100", "price": 50, "compareAtPrice": 60, "stock": 1000, "weight": 100, "isAvailable": true},
        {"id": "tp-200g", "name": "200g", "sku": "EVR-TP-200", "price": 95, "compareAtPrice": 115, "stock": 800, "weight": 200, "isAvailable": true},
        {"id": "tp-500g", "name": "500g", "sku": "EVR-TP-500", "price": 220, "compareAtPrice": 270, "stock": 400, "weight": 500, "isAvailable": true}
    ]'::jsonb,
    ARRAY['High curcumin content (5%+)', 'Organically grown', 'Vibrant golden color', 'Anti-inflammatory properties'],
    ARRAY['100% Pure Turmeric'],
    ARRAY['organic', 'health', 'best-seller'],
    'Buy Organic Turmeric Powder Online - High Curcumin | Tangry',
    'Premium organic turmeric powder with high curcumin content. Perfect for cooking and health. Order now with free shipping!',
    ARRAY['turmeric powder', 'organic turmeric', 'haldi powder', 'buy turmeric online'],
    true, false, true,
    4.9, 2341, 1
),
(
    'eazy-chef-paneer-tikka-masala',
    'Eazy Chef - Paneer Tikka Masala',
    'Complete spice mix for restaurant-style Paneer Tikka Masala. Be a chef in minutes! Just add paneer and follow simple instructions.',
    'Eazy Chef',
    NULL,
    ARRAY['/products/eazy-chef-paneer-tikka.jpg'],
    '[
        {"id": "ec-ptm-50g", "name": "50g Pack", "sku": "EVR-EC-PTM-50", "price": 40, "stock": 600, "weight": 50, "isAvailable": true}
    ]'::jsonb,
    ARRAY['Ready in 15 minutes', 'Restaurant-style taste', 'No chopping or grinding', 'Serves 4 people'],
    ARRAY['Coriander', 'Cumin', 'Red Chilli', 'Kasuri Methi', 'Garam Masala', 'Ginger', 'Garlic', 'Tomato Powder'],
    ARRAY['new', 'quick-cook', 'easy'],
    'Eazy Chef Paneer Tikka Masala Mix - Ready in 15 Minutes | Tangry',
    'Restaurant-style Paneer Tikka Masala in just 15 minutes. Complete spice mix with easy instructions. Order now!',
    ARRAY['paneer tikka masala', 'ready to cook', 'instant masala mix', 'eazy chef'],
    true, true, false,
    4.7, 456, 1
),
(
    'red-chilli-powder',
    'Red Chilli Powder',
    'Premium red chilli powder with perfect balance of heat and color. Made from carefully selected chillies for authentic Indian taste.',
    'Pure Spices',
    NULL,
    ARRAY['/products/red-chilli-powder-1.jpg'],
    '[
        {"id": "rcp-100g", "name": "100g", "sku": "EVR-RCP-100", "price": 55, "compareAtPrice": 65, "stock": 900, "weight": 100, "isAvailable": true},
        {"id": "rcp-200g", "name": "200g", "sku": "EVR-RCP-200", "price": 105, "compareAtPrice": 125, "stock": 700, "weight": 200, "isAvailable": true},
        {"id": "rcp-500g", "name": "500g", "sku": "EVR-RCP-500", "price": 245, "compareAtPrice": 295, "stock": 300, "weight": 500, "isAvailable": true}
    ]'::jsonb,
    ARRAY['Perfect heat level', 'Rich red color', 'No artificial colors', 'Triple-washed and sun-dried'],
    NULL,
    ARRAY['essential', 'pure'],
    'Buy Red Chilli Powder Online - Premium Quality | Tangry',
    'Premium red chilli powder with perfect heat and color. No artificial colors. Free shipping on orders above ₹499.',
    ARRAY['red chilli powder', 'lal mirch powder', 'buy chilli powder', 'indian spices'],
    false, false, true,
    4.6, 1876, 1
),
(
    'biryani-masala',
    'Biryani Masala',
    'Aromatic blend of spices specially crafted for authentic biryani. Perfect for both vegetable and meat biryani.',
    'Blended Spices',
    'Rice Specialties',
    ARRAY['/products/biryani-masala-1.jpg'],
    '[
        {"id": "bm-50g", "name": "50g", "sku": "EVR-BM-50", "price": 50, "stock": 400, "weight": 50, "isAvailable": true},
        {"id": "bm-100g", "name": "100g", "sku": "EVR-BM-100", "price": 95, "stock": 250, "weight": 100, "isAvailable": true}
    ]'::jsonb,
    ARRAY['Authentic Hyderabadi blend', 'Rich aroma', 'Perfect for layering', 'Works with all rice varieties'],
    ARRAY['Coriander', 'Cumin', 'Black Pepper', 'Cardamom', 'Cinnamon', 'Cloves', 'Bay Leaf', 'Star Anise', 'Mace', 'Nutmeg'],
    ARRAY['premium', 'aromatic'],
    'Buy Biryani Masala Online - Authentic Hyderabadi Blend | Tangry',
    'Premium Biryani Masala for authentic taste. Perfect blend of aromatic spices. Order now with free shipping!',
    ARRAY['biryani masala', 'hyderabadi biryani spice', 'buy biryani masala online'],
    true, false, true,
    4.8, 923, 1
);

-- Create sample coupon
INSERT INTO coupons (
    code, description, discount_type, discount_value, min_order_value, valid_from, valid_until, is_active
) VALUES
(
    'WELCOME10',
    'Welcome discount for new customers - 10% off',
    'percentage',
    10,
    299,
    NOW(),
    NOW() + INTERVAL '90 days',
    true
),
(
    'FLAT50',
    'Flat ₹50 off on orders above ₹500',
    'fixed',
    50,
    500,
    NOW(),
    NOW() + INTERVAL '30 days',
    true
);

