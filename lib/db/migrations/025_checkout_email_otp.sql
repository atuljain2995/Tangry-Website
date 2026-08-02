-- Email OTP for guest COD checkout (replaces phone/SMS OTP table if present)

DROP TABLE IF EXISTS checkout_phone_otps;

CREATE TABLE IF NOT EXISTS checkout_email_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verify_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_email_otps_email_created
    ON checkout_email_otps (email, created_at DESC);

COMMENT ON TABLE checkout_email_otps IS
    'Short-lived OTP hashes for guest COD email verification at checkout';
