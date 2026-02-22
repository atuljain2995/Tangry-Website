# Database migrations

Run these in **Supabase SQL Editor** in this order:

1. **001_initial_schema.sql** – tables (users, products, orders, etc.) and RLS
2. **002_seed_products.sql** – seed products
3. **002b_create_variants_tables.sql** – `product_variants`, `product_images`
4. **003_add_product_variants.sql** – seed variants for each product
5. **004_contact_inquiries.sql** – `contact_inquiries` table for /contact form

Then run `npm run test-db` to verify.
