-- Emails that completed COD checkout OTP once; skip re-verification on future guest COD orders.

CREATE TABLE IF NOT EXISTS checkout_verified_emails (
    email TEXT PRIMARY KEY,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE checkout_verified_emails IS
    'Guest checkout emails verified via OTP; trusted for subsequent COD orders';
