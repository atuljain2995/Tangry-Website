-- Post-purchase review-request support for Tangry Spices
-- Tracks when an order was delivered and when a review-request email was sent,
-- so the cron job (/api/cron/review-requests) can ask for reviews 3–5 days
-- after delivery without double-sending.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS review_request_sent_at TIMESTAMP WITH TIME ZONE;

-- Backfill delivered_at for orders already marked delivered so they become
-- eligible for a (single) review request.
UPDATE orders
  SET delivered_at = COALESCE(delivered_at, updated_at)
  WHERE order_status = 'delivered' AND delivered_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_orders_review_request
  ON orders (delivered_at)
  WHERE review_request_sent_at IS NULL;
