-- Seed reviews for GSC priority products (Task 6)
-- Edit with real customer feedback before running in production if preferred.

INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, is_verified_purchase, created_at)
SELECT p.id, NULL, v.user_name, v.rating, v.title, v.comment, v.is_verified_purchase, v.created_at
FROM (
  VALUES
    ('sweet-lemon-pickle',       'Neha R.',    5, 'Perfect with paratha',     'Sweet and tangy without being too sugary. My kids love it with dal chawal.',        true, NOW() - INTERVAL '12 days'),
    ('gun-powder-podi-masala',   'Karthik V.', 5, 'Idli game changer',        'Fresh podi with good curry-leaf aroma. Sprinkled on dosa and it tastes like home.', true, NOW() - INTERVAL '18 days'),
    ('turmeric-powder',          'Sunita P.',  5, 'Bright colour',            'Clean haldi with good colour for daily dal and sabzi. Packing feels fresh.',       true, NOW() - INTERVAL '14 days'),
    ('chaas-masala',             'Arjun D.',   4, 'Great for summer',         'Works well in chaas and shikanji. Minty and not too salty — will reorder.',        true, NOW() - INTERVAL '7 days')
) AS v(slug, user_name, rating, title, comment, is_verified_purchase, created_at)
JOIN products p ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r WHERE r.product_id = p.id AND r.user_name = v.user_name
);
