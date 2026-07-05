-- Seed honest customer reviews for Tangry Spices
-- ─────────────────────────────────────────────────────────────────────────────
-- IMPORTANT: Only seed reviews you have genuine permission to publish (from real
-- customers, retailers, or the founder's network). Fake reviews violate Google
-- and consumer-protection policies. Edit the rows below with real feedback before
-- running this migration.
--
-- product_id is resolved by slug so this works regardless of generated UUIDs.
-- The trg_sync_product_rating trigger (migration 013) automatically recomputes
-- products.rating and products.review_count after these inserts.
--
-- user_id is left NULL (reviews from customers not in the auth system). Set
-- is_verified_purchase = true only when you can confirm the person actually
-- bought the product.

INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, is_verified_purchase, created_at)
SELECT p.id, NULL, v.user_name, v.rating, v.title, v.comment, v.is_verified_purchase, v.created_at
FROM (
  VALUES
    -- (slug,                    reviewer name,  rating, title,                   comment,                                                                 verified, created_at)
    ('dabeli-masala',            'Priya S.',     5,      'Tastes like Jaipur',    'Made dabeli at home and it was exactly the flavour I grew up with. Will reorder.', true,  NOW() - INTERVAL '20 days'),
    ('dabeli-masala',            'Rohit M.',     4,      'Great aroma',           'Fresh, fragrant masala. A little spicy for my kids but perfect for us.',           true,  NOW() - INTERVAL '9 days'),
    ('pav-bhaji-masala',         'Anjali K.',    5,      'Restaurant-style',      'The pav bhaji came out just like the street stalls. Balanced and rich.',           true,  NOW() - INTERVAL '15 days')
    -- Add more real reviews here, one row per line, matching an existing product slug.
) AS v(slug, user_name, rating, title, comment, is_verified_purchase, created_at)
JOIN products p ON p.slug = v.slug;
