-- Audit trail for admin-triggered rebuild requests.

CREATE TABLE IF NOT EXISTS admin_rebuild_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'failed')),
  message TEXT,
  response_status INT,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_rebuild_requests_email_time
  ON admin_rebuild_requests (admin_email, requested_at DESC);

ALTER TABLE admin_rebuild_requests ENABLE ROW LEVEL SECURITY;
