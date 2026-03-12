-- In-house auth: password storage and sessions (no Supabase Auth)
-- Run after 001_initial_schema.sql

-- Add password hash column to users (nullable for existing rows; required for new signups)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Sessions table: one row per login, cookie stores session token
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Optional: clean expired sessions (run periodically or in app)
-- DELETE FROM sessions WHERE expires_at < NOW();
