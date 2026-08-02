-- Combined fresh install for new Supabase project. Generated for Option B migration.
-- Run once in SQL Editor, then: npm run import-db

-- >>> FILE: lib/db/migrations/001_initial_schema.sql
-- Initial database schema for Tangry Spices
-- Run this in your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'retailer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('shipping', 'billing')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'IN',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    variants JSONB NOT NULL,
    features TEXT[] DEFAULT '{}',
    ingredients TEXT[],
    tags TEXT[] DEFAULT '{}',
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_best_seller);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('razorpay', 'stripe', 'cod', 'bank_transfer')),
    payment_id VARCHAR(255),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    tracking_number VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT false,
    images TEXT[],
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2),
    max_discount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applicable_products TEXT[],
    applicable_categories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

-- Email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON email_subscribers(is_active);

-- B2B Quotes table
CREATE TABLE IF NOT EXISTS b2b_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(50),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    items JSONB NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'converted')),
    estimated_total DECIMAL(10,2),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_quotes_status ON b2b_quotes(status);
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_created_at ON b2b_quotes(created_at DESC);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    product_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (drop first so re-run is safe)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_b2b_quotes_updated_at ON b2b_quotes;
CREATE TRIGGER update_b2b_quotes_updated_at BEFORE UPDATE ON b2b_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wishlists_updated_at ON wishlists;
CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own data (drop first so re-run is safe)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
CREATE POLICY "Users can view own addresses" ON addresses
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addresses" ON addresses;
CREATE POLICY "Users can insert own addresses" ON addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
CREATE POLICY "Users can update own addresses" ON addresses
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;
CREATE POLICY "Users can delete own addresses" ON addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create reviews
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

-- Users can manage their wishlist
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;
CREATE POLICY "Users can manage own wishlist" ON wishlists
    USING (auth.uid() = user_id);

-- Products and coupons are publicly readable
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
CREATE POLICY "Products are publicly readable" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Active coupons are publicly readable" ON coupons;
CREATE POLICY "Active coupons are publicly readable" ON coupons
    FOR SELECT USING (is_active = true);

-- Email subscribers can manage their subscription
DROP POLICY IF EXISTS "Anyone can subscribe" ON email_subscribers;
CREATE POLICY "Anyone can subscribe" ON email_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Subscribers can update their data" ON email_subscribers;
CREATE POLICY "Subscribers can update their data" ON email_subscribers
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);


-- >>> FILE: lib/db/migrations/002_seed_products.sql
-- Seed Tangry catalog (Jaipur)
-- Run after 001_initial_schema.sql

INSERT INTO products (
    slug, name, description, category, images, variants, features, ingredients,
    tags, meta_title, meta_description, keywords, is_featured, is_new, is_best_seller,
    rating, review_count, min_order_quantity
) VALUES
(
    'dabeli-masala',
    'Dabeli Masala',
    'Authentic dabeli masala blended in Jaipur. Warm, tangy, and balanced for stuffed buns and potato filling.',
    'Spices & Masalas',
    ARRAY['/products/dabeli-masala.jpg'],
    '[]'::jsonb,
    ARRAY['Small-batch blended in Jaipur', 'No artificial colours', 'FSSAI licensed facility', 'Sealed for freshness'],
    ARRAY['Coriander', 'Cumin', 'Dry mango', 'Red chilli', 'Cloves', 'Cinnamon', 'Salt', 'Spices'],
    ARRAY['featured', 'masala', 'jaipur'],
    'Dabeli Masala | Authentic blend from Jaipur | Tangry',
    'Buy Tangry Dabeli Masala online—Jaipur-made blend for street-style dabeli. FSSAI licensed.',
    ARRAY['dabeli masala', 'buy dabeli masala', 'jaipur masala', 'tangry'],
    true, false, true,
    4.8, 186, 1
),
(
    'turmeric-powder',
    'Turmeric Powder',
    'Bright, aromatic turmeric (haldi)—essential for everyday cooking. Packed in Jaipur under FSSAI supervision.',
    'Essentials',
    ARRAY['/products/turmeric-powder.jpg'],
    '[]'::jsonb,
    ARRAY['Lab-checked batches', 'Vibrant colour', 'Finely ground', 'Sealed pack'],
    ARRAY['100% Turmeric'],
    ARRAY['essential', 'haldi', 'jaipur'],
    'Turmeric Powder (Haldi) | Tangry Essentials | Jaipur',
    'Pure turmeric powder from Tangry, packed in Jaipur. Shop 100g and 200g packs.',
    ARRAY['turmeric powder', 'haldi', 'buy turmeric online', 'tangry'],
    true, false, true,
    4.9, 412, 1
),
(
    'gun-powder-podi',
    'Gun Powder (Podi Masala)',
    'South Indian–style podi with lentils, chillies, and curry leaves—sprinkle on idli, dosa, or rice.',
    'Ready to Eat',
    ARRAY['/products/gun-powder-podi.jpg'],
    '[]'::jsonb,
    ARRAY['Crunchy lentil base', 'Adjustable heat', 'Resealable pack'],
    ARRAY['Urad dal', 'Chana dal', 'Red chilli', 'Curry leaves', 'Salt', 'Spices'],
    ARRAY['podi', 'gun powder', 'featured'],
    'Gun Powder Podi Masala | Tangry Ready Powders',
    'Tangry Gun Powder (podi)—sprinkle on idli, dosa, or rice. Order online from Jaipur.',
    ARRAY['gun powder masala', 'podi', 'idli podi', 'tangry'],
    true, true, false,
    4.7, 96, 1
),
(
    'vada-pav-chutney',
    'Vada Pav Chutney',
    'Dry garlic-coconut chutney style mix for Mumbai-style vada pav—tangy, garlicky, and addictive.',
    'Ready to Eat',
    ARRAY['/products/vada-pav-chutney.jpg'],
    '[]'::jsonb,
    ARRAY['Garlic-forward', 'Pairs with batata vada', 'Dry sprinkle format', 'Consistent grind'],
    ARRAY['Garlic', 'Coconut', 'Peanuts', 'Red chilli', 'Salt', 'Spices'],
    ARRAY['chutney', 'street food', 'new'],
    'Vada Pav Chutney Powder | Tangry',
    'Dry vada pav chutney mix from Tangry—perfect with batata vada and pav.',
    ARRAY['vada pav chutney', 'dry garlic chutney', 'tangry'],
    false, true, true,
    4.8, 74, 1
),
(
    'pav-bhaji-masala',
    'Pav Bhaji Masala',
    'Rich, red pav bhaji masala for bhaji that tastes like your favourite corner stall.',
    'Spices & Masalas',
    ARRAY['/products/pav-bhaji-masala.jpg'],
    '[]'::jsonb,
    ARRAY['Bold colour & aroma', 'Works with mixed vegetables', 'Small-batch Jaipur blend'],
    ARRAY['Coriander', 'Cumin', 'Fennel', 'Black pepper', 'Dry mango', 'Kashmiri chilli', 'Salt', 'Spices'],
    ARRAY['pav bhaji', 'masala', 'bestseller'],
    'Pav Bhaji Masala | Jaipur blend | Tangry',
    'Shop Tangry Pav Bhaji Masala—200g pack, blended in Jaipur.',
    ARRAY['pav bhaji masala', 'buy pav bhaji masala online', 'tangry'],
    true, false, true,
    4.8, 268, 1
)
ON CONFLICT (slug) DO NOTHING;

-- Sample coupons (unchanged)
INSERT INTO coupons (
    code, description, discount_type, discount_value, min_order_value, valid_from, valid_until, is_active
) VALUES
(
    'WELCOME10',
    'Welcome discount for new customers - 10% off',
    'percentage',
    10,
    299,
    NOW(),
    NOW() + INTERVAL '90 days',
    true
),
(
    'FLAT50',
    'Flat ₹50 off on orders above ₹500',
    'fixed',
    50,
    500,
    NOW(),
    NOW() + INTERVAL '30 days',
    true
)
ON CONFLICT (code) DO NOTHING;

-- >>> FILE: lib/db/migrations/002b_create_variants_tables.sql
-- Create missing tables for product variants and images
-- Run this BEFORE 003_add_product_variants.sql

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "50g", "100g", "200g"
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2), -- Original price for showing discounts
    stock INTEGER NOT NULL DEFAULT 0,
    weight INTEGER NOT NULL, -- Weight in grams
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for product_images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(display_order);

-- Add default images only for products that don't have any images yet (safe to re-run)
INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT 
    p.id,
    '/products/' || p.slug || '.jpg',
    p.name || ' - Premium Indian Spice',
    0
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);

-- Verify tables created
SELECT 
    'product_variants' as table_name,
    COUNT(*) as row_count
FROM product_variants
UNION ALL
SELECT 
    'product_images' as table_name,
    COUNT(*) as row_count
FROM product_images;


-- >>> FILE: lib/db/migrations/003_add_product_variants.sql
-- Product variants for Tangry catalog (run after 002_seed_products.sql and 002b_create_variants_tables.sql)

-- Dabeli Masala 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-DBL-200', 89.00, 105.00, 280, 200, true
FROM products WHERE slug = 'dabeli-masala'
ON CONFLICT (sku) DO NOTHING;

-- Turmeric 100g / 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-TUR-100', 52.00, 62.00, 800, 100, true
FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-TUR-200', 98.00, 118.00, 550, 200, true
FROM products WHERE slug = 'turmeric-powder'
ON CONFLICT (sku) DO NOTHING;

-- Gun Powder 100g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '100g', 'TGR-GUN-100', 78.00, 92.00, 220, 100, true
FROM products WHERE slug = 'gun-powder-podi'
ON CONFLICT (sku) DO NOTHING;

-- Vada Pav Chutney 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-VPC-200', 115.00, 135.00, 180, 200, true
FROM products WHERE slug = 'vada-pav-chutney'
ON CONFLICT (sku) DO NOTHING;

-- Pav Bhaji Masala 200g
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, weight, is_available)
SELECT id, '200g', 'TGR-PBV-200', 95.00, 112.00, 310, 200, true
FROM products WHERE slug = 'pav-bhaji-masala'
ON CONFLICT (sku) DO NOTHING;

SELECT p.name, COUNT(pv.id) AS variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;

-- >>> FILE: lib/db/migrations/005_inhouse_auth.sql
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

-- >>> FILE: lib/db/migrations/004_contact_inquiries.sql
-- Contact form submissions (for /contact page)
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

-- Allow inserts from anyone (server will use service role)
-- No RLS policy needed if using service role for insert; add policy if using anon:
-- CREATE POLICY "Anyone can submit contact form" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- >>> FILE: lib/db/migrations/008_ready_to_eat_category_rename.sql
-- Rename category label from "Ready to Eat Powders" to "Ready to Eat" (matches PRODUCT_CATEGORIES.title)
UPDATE public.products
SET category = 'Ready to Eat'
WHERE category = 'Ready to Eat Powders';

-- >>> FILE: lib/db/migrations/009_product_categories.sql
-- Canonical product categories in the database; products reference them via category_id.
-- Denormalized products.category (title) is kept in sync by trigger for existing queries/filters.

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL UNIQUE,
  chip_label TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_sort ON product_categories (sort_order, title);

INSERT INTO product_categories (slug, title, chip_label, description, sort_order)
VALUES
  (
    'spices-masalas',
    'Spices & Masalas',
    'Masalas & spices',
    'Regional blends from our Jaipur kitchen—dabeli, pav bhaji, sambhar, chole, rajma, pani puri, and more.',
    1
  ),
  (
    'ready-to-eat',
    'Ready to Eat',
    NULL,
    'Gun powder (podi), chaat masala, vada pav chutney, bhuna jeera, and everyday finishing spices.',
    2
  ),
  (
    'essentials',
    'Essentials',
    NULL,
    'Pure turmeric and whole jeera (cumin)—the base of every Indian kitchen.',
    3
  ),
  (
    'pickles',
    'Pickles',
    NULL,
    'Traditional lemon, mango, garlic, ker, karonda, mixed veg, and more—homestyle recipes from Rajasthan.',
    4
  )
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES product_categories (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

UPDATE products p
SET category_id = c.id
FROM product_categories c
WHERE p.category IS NOT NULL
  AND TRIM(p.category) = c.title
  AND p.category_id IS NULL;

-- Keep products.category (title) aligned when category_id is set
CREATE OR REPLACE FUNCTION sync_products_category_title()
RETURNS TRIGGER AS $$
DECLARE
  cat_title TEXT;
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    SELECT pc.title INTO STRICT cat_title FROM product_categories pc WHERE pc.id = NEW.category_id;
    NEW.category := cat_title;
  ELSE
    NEW.category := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_sync_category ON products;
CREATE TRIGGER trg_products_sync_category
  BEFORE INSERT OR UPDATE OF category_id ON products
  FOR EACH ROW
  EXECUTE FUNCTION sync_products_category_title();

-- Supabase: allow storefront to read categories (service role bypasses RLS for admin writes)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_categories_select_all" ON product_categories;
CREATE POLICY "product_categories_select_all" ON product_categories
  FOR SELECT
  USING (true);

GRANT SELECT ON product_categories TO anon, authenticated;

-- >>> FILE: lib/db/migrations/010_drop_products_subcategory.sql
-- Remove unused products.subcategory (not used on storefront or filters)
ALTER TABLE products DROP COLUMN IF EXISTS subcategory;

-- >>> FILE: lib/db/migrations/011_user_avatar.sql
-- Optional profile image URL (same storage pattern as product images: public path or CDN URL)
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- >>> FILE: lib/db/migrations/012_ready_to_eat_slug_rename.sql
-- Rename product category slug from "ready-powders" to "ready-to-eat".
UPDATE public.product_categories
SET slug = 'ready-to-eat'
WHERE slug = 'ready-powders';
-- >>> FILE: lib/db/migrations/013_review_rating_sync_trigger.sql
-- Migration 013: Auto-sync products.rating and products.review_count from the reviews table
-- This trigger fires after any INSERT, UPDATE, or DELETE on the reviews table,
-- keeping the denormalized aggregate columns accurate without query-time joins.

CREATE OR REPLACE FUNCTION sync_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  -- For DELETE, use OLD; for INSERT/UPDATE, use NEW
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE products
  SET
    rating       = COALESCE((
                     SELECT ROUND(AVG(rating)::numeric, 2)
                     FROM reviews
                     WHERE product_id = target_product_id
                   ), 0),
    review_count = (
                     SELECT COUNT(*)
                     FROM reviews
                     WHERE product_id = target_product_id
                   ),
    updated_at   = NOW()
  WHERE id = target_product_id;

  RETURN NULL; -- AFTER trigger; return value is ignored
END;
$$ LANGUAGE plpgsql;

-- Drop trigger first to allow re-running this migration idempotently
DROP TRIGGER IF EXISTS trg_sync_product_rating ON reviews;

CREATE TRIGGER trg_sync_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION sync_product_rating();

-- Backfill: recalculate rating + review_count for all products from existing review data
UPDATE products p
SET
  rating       = COALESCE((
                   SELECT ROUND(AVG(r.rating)::numeric, 2)
                   FROM reviews r
                   WHERE r.product_id = p.id
                 ), 0),
  review_count = (
                   SELECT COUNT(*)
                   FROM reviews r
                   WHERE r.product_id = p.id
                 );

-- >>> FILE: lib/db/migrations/014_cwv_readings.sql
-- Migration 014: First-party Real User Monitoring (RUM) for Core Web Vitals
-- Stores CWV readings beaconed from the browser via /api/vitals.
-- Eliminates dependency on PSI / CrUX API for CWV verification.

CREATE TABLE IF NOT EXISTS cwv_readings (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url           VARCHAR(2048) NOT NULL,
    metric_name   VARCHAR(10)   NOT NULL
                  CHECK (metric_name IN ('LCP', 'INP', 'CLS', 'FCP', 'TTFB')),
    value         DECIMAL(14, 4) NOT NULL,
    rating        VARCHAR(20)   NOT NULL
                  CHECK (rating IN ('good', 'needs-improvement', 'poor')),
    metric_id     VARCHAR(120),          -- web-vitals unique-per-page-load ID
    delta         DECIMAL(14, 4),        -- increment since last report
    navigation_type VARCHAR(30),         -- navigate | reload | back-forward | prerender
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cwv_url         ON cwv_readings (url);
CREATE INDEX IF NOT EXISTS idx_cwv_metric      ON cwv_readings (metric_name);
CREATE INDEX IF NOT EXISTS idx_cwv_created_at  ON cwv_readings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cwv_url_metric  ON cwv_readings (url, metric_name);

-- Auto-prune readings older than 90 days to keep the table lean.
-- Run this periodically (e.g. a daily cron) or via Supabase pg_cron:
--   SELECT cron.schedule('cwv-prune', '0 3 * * *',
--     $$DELETE FROM cwv_readings WHERE created_at < NOW() - INTERVAL '90 days'$$);

-- >>> FILE: lib/db/migrations/015_admin_rebuild_requests.sql
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

-- >>> FILE: lib/db/migrations/016_first_order_coupon.sql
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

-- >>> FILE: lib/db/migrations/017_order_review_requests.sql
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

