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
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_available ON product_variants(is_available);

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
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(display_order);

-- Add some default images for existing products
INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT 
    id,
    '/products/' || slug || '.jpg',
    name || ' - Premium Indian Spice',
    0
FROM products;

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

