-- Optional profile image URL (same storage pattern as product images: public path or CDN URL)
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
