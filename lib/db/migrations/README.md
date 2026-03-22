# Database migrations

Run these in **Supabase SQL Editor** in this order:

1. **001_initial_schema.sql** – tables (users, products, orders, etc.) and RLS
2. **002_seed_products.sql** – seed products
3. **002b_create_variants_tables.sql** – `product_variants`, `product_images`
4. **003_add_product_variants.sql** – seed variants for each product
5. **004_auth_sync_public_users.sql** – *(optional, only if you use Supabase Auth)* Sync Auth → `public.users`. **Skip this** if you use in-house auth (see 005).
6. **005_inhouse_auth.sql** – In-house auth: add `password_hash` to `users`, create `sessions` table. Run this for cookie-based login without Supabase Auth.
7. **004_contact_inquiries.sql** – `contact_inquiries` table for /contact form (if present)
8. **006_tangry_catalog_alignment.sql** – *(optional)* If you already ran an **older** 002/003 with placeholder products (garam masala, biryani, etc.), run this once in Supabase to replace them with the current Tangry catalog. **Skip** on fresh installs that use the updated 002/003.
9. **007_remove_eazy_chef_paneer_tikka.sql** – *(optional)* Removes rows whose name contains **Eazy Chef** / **Easy Chef** (e.g. “Eazy Chef - Paneer Tikka Masala”) and deletes the legacy `paneer-tikka-masala-mix` product if it still exists.

Then run `npm run test-db` to verify.
