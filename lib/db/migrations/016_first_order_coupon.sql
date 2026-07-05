-- First-order coupon support for Tangry Spices
-- Adds a `first_order_only` flag to coupons and seeds the TANGRY10 first-order code.
-- Enforcement for logged-in customers happens in validateCouponAndGetDiscount()
-- (blocked when the user already has a non-cancelled order).

ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS first_order_only BOOLEAN NOT NULL DEFAULT false;

INSERT INTO coupons (
    code, description, discount_type, discount_value, min_order_value, max_discount,
    valid_from, valid_until, is_active, first_order_only
) VALUES (
    'TANGRY10',
    'First-order discount — 10% off your first Tangry order',
    'percentage',
    10,
    299,
    150,
    NOW(),
    NOW() + INTERVAL '365 days',
    true,
    true
)
ON CONFLICT (code) DO UPDATE
  SET description      = EXCLUDED.description,
      discount_type    = EXCLUDED.discount_type,
      discount_value   = EXCLUDED.discount_value,
      min_order_value  = EXCLUDED.min_order_value,
      max_discount     = EXCLUDED.max_discount,
      valid_until      = EXCLUDED.valid_until,
      is_active        = EXCLUDED.is_active,
      first_order_only = EXCLUDED.first_order_only;
