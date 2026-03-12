# Database migrations

Run these in **Supabase SQL Editor** in this order:

1. **001_initial_schema.sql** – tables (users, products, orders, etc.) and RLS
2. **002_seed_products.sql** – seed products
3. **002b_create_variants_tables.sql** – `product_variants`, `product_images`
4. **003_add_product_variants.sql** – seed variants for each product
5. **004_auth_sync_public_users.sql** – *(optional, only if you use Supabase Auth)* Sync Auth → `public.users`. **Skip this** if you use in-house auth (see 005).
6. **005_inhouse_auth.sql** – In-house auth: add `password_hash` to `users`, create `sessions` table. Run this for cookie-based login without Supabase Auth.
7. **004_contact_inquiries.sql** – `contact_inquiries` table for /contact form (if present)

Then run `npm run test-db` to verify.
