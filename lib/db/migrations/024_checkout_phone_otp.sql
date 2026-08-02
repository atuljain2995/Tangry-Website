-- OTP codes for guest COD checkout phone verification

CREATE TABLE IF NOT EXISTS checkout_phone_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(10) NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verify_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_phone_otps_phone_created
    ON checkout_phone_otps (phone, created_at DESC);

COMMENT ON TABLE checkout_phone_otps IS
    'Short-lived OTP hashes for guest COD mobile verification at checkout';
