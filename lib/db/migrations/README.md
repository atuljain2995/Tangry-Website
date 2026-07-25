# Database migrations

Run these in **Supabase SQL Editor** in this order:

## Core setup (fresh install)

1. **001_initial_schema.sql** – tables (users, products, orders, etc.) and RLS
2. **002_seed_products.sql** – seed products
3. **002b_create_variants_tables.sql** – `product_variants`, `product_images`
4. **003_add_product_variants.sql** – seed variants for each product
5. **004_auth_sync_public_users.sql** – _(optional, only if you use Supabase Auth)_ Sync Auth → `public.users`. **Skip this** if you use in-house auth (see 005).
6. **005_inhouse_auth.sql** – In-house auth: add `password_hash` to `users`, create `sessions` table. Run this for cookie-based login without Supabase Auth.
7. **004_contact_inquiries.sql** – `contact_inquiries` table for /contact form

## Catalog alignment (existing databases only)

8. **006_tangry_catalog_alignment.sql** – _(optional)_ If you already ran an **older** 002/003 with placeholder products (garam masala, biryani, etc.), run this once to replace them with the current Tangry catalog. **Skip** on fresh installs that use the updated 002/003.
9. **007_remove_eazy_chef_paneer_tikka.sql** – _(optional)_ Removes legacy Eazy Chef / paneer-tikka rows if they still exist.

## Category & schema updates

10. **008_ready_to_eat_category_rename.sql** – Renames category label "Ready to Eat Powders" → "Ready to Eat"
11. **009_product_categories.sql** – `product_categories` table, `products.category_id` FK, sync trigger
12. **010_drop_products_subcategory.sql** – Drops unused `products.subcategory` column
13. **011_user_avatar.sql** – Adds `users.avatar_url` for profile images
14. **012_ready_to_eat_slug_rename.sql** – Renames category slug `ready-powders` → `ready-to-eat`

## Reviews, performance & admin

15. **013_review_rating_sync_trigger.sql** – Trigger to sync `products.rating` / `review_count` from `reviews`
16. **014_cwv_readings.sql** – `cwv_readings` table for first-party Core Web Vitals beacons
17. **015_admin_rebuild_requests.sql** – Audit trail for admin-triggered rebuild requests

## Coupons & post-purchase email

18. **016_first_order_coupon.sql** – `coupons.first_order_only` flag; seeds `TANGRY10` first-order code
19. **017_order_review_requests.sql** – `orders.delivered_at` and `orders.review_request_sent_at` for the review-request cron

## Seed data (optional)

20. **018_seed_reviews.sql** – _(optional)_ Sample review rows. **Only run with real, permitted customer feedback** — edit before publishing.

---

Then run `npm run test-db` to verify.

**Already on production?** Compare your Supabase schema against the list above. At minimum, ensure **016** and **017** are applied if you use first-order coupons or the review-request cron (`/api/cron/review-requests`).
