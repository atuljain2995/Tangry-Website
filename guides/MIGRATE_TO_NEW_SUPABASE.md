# Migrate to a New Supabase Project (Option B)

Use this when dashboard restore fails or you want a fresh Supabase project with the same data.

## Overview

1. **Export** data from your current project (this repo).
2. **Create** a new Supabase project in the dashboard.
3. **Run migrations** on the new project (schema only — seed data will be replaced).
4. **Import** the backup into the new project.
5. **Update** env vars (local + Vercel) and Storage bucket.
6. **Verify** the app.

---

## Step 1: Export current database

From the project root (uses `.env.local` pointing at your **current** project):

```bash
npm run export-db
```

This writes:

- `backups/db-export-latest.json`
- `backups/db-export-<timestamp>.json`

These files contain users, orders, products, etc. **Do not commit them** (they are gitignored).

---

## Step 2: Create a new Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick a name, password, and region.
3. Wait until the project is ready.
4. Open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3: Run migrations on the new project

In the **new** project → **SQL Editor**, run these files **in order** (copy/paste each file, then Run):

| # | File | Notes |
|---|------|--------|
| 1 | `lib/db/migrations/001_initial_schema.sql` | Tables + RLS |
| 2 | `lib/db/migrations/002_seed_products.sql` | Temporary seed (replaced on import) |
| 3 | `lib/db/migrations/002b_create_variants_tables.sql` | Variants + images tables |
| 4 | `lib/db/migrations/003_add_product_variants.sql` | Temporary seed |
| 5 | `lib/db/migrations/005_inhouse_auth.sql` | Auth tables |
| 6 | `lib/db/migrations/004_contact_inquiries.sql` | Contact form |
| 7 | `lib/db/migrations/008_ready_to_eat_category_rename.sql` | Category label |
| 8 | `lib/db/migrations/009_product_categories.sql` | Categories table |
| 9 | `lib/db/migrations/010_drop_products_subcategory.sql` | Schema cleanup |
| 10 | `lib/db/migrations/011_user_avatar.sql` | User avatars |
| 11 | `lib/db/migrations/012_ready_to_eat_slug_rename.sql` | Category slug |
| 12 | `lib/db/migrations/013_review_rating_sync_trigger.sql` | Review rating sync |
| 13 | `lib/db/migrations/014_cwv_readings.sql` | Web vitals |
| 14 | `lib/db/migrations/015_admin_rebuild_requests.sql` | Admin rebuild audit |
| 15 | `lib/db/migrations/016_first_order_coupon.sql` | Coupons |
| 16 | `lib/db/migrations/017_order_review_requests.sql` | Review email cron |
| 17 | `lib/db/migrations/022_is_hero_product.sql` | Hero product flag on products |

**Skip** on a fresh migrate (data comes from import):

- `004_auth_sync_public_users.sql` (Supabase Auth — you use in-house auth)
- `006_tangry_catalog_alignment.sql`, `007_remove_eazy_chef_paneer_tikka.sql` (old DB fixes)
- `018_seed_reviews.sql`, `019_seo_product_meta.sql`, `020_seo_product_reviews.sql`, `021_seo_product_meta_remaining.sql` (included in export)

---

## Step 4: Import backup into the new project

1. Update **`.env.local`** with the **new** project URL and keys (keep a copy of the old `.env.local` if you need to re-export).
2. Run:

```bash
npm run import-db
```

Or specify a file:

```bash
npm run import-db backups/db-export-2026-08-02T12-00-00-000Z.json
```

The script clears app tables and inserts exported rows (same UUIDs as before).

3. Verify:

```bash
npm run test-db
```

You should see ~18 products and your orders/users restored.

---

## Step 5: Supabase Storage (product images)

1. In the **new** project → **Storage** → **New bucket**.
2. Name: **`product-images`**, set to **Public**.
3. If images were stored in the **old** project’s Storage, either:
   - Re-upload via Admin, or
   - Download from old bucket and upload to the new bucket (URLs in DB will need updating if the project URL changed).

Image URLs in the database look like:

`https://<old-ref>.supabase.co/storage/v1/object/public/product-images/...`

After migration, new uploads use the new project URL. Old URLs keep working only if the **old** project and bucket still exist.

---

## Step 6: Update Vercel

In Vercel → Project → **Settings → Environment Variables**, set for Production (and Preview if needed):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Redeploy the app.

---

## Step 7: Admin login

If your admin user was exported, existing email/password should still work (password hashes are in the backup).

To create or reset an admin on the new project:

```bash
npm run create-admin your@email.com yourpassword
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Import says target URL matches source | Point `.env.local` at the **new** project, not the old one. |
| `relation does not exist` on import | Run all migrations in Step 3 on the new project first. |
| Products show but images 404 | Create `product-images` bucket; re-upload or fix image URLs. |
| Fewer rows than expected | Re-export from old project while old `.env.local` still points at it. |

---

## Quick reference

```bash
# 1. Export (old project in .env.local)
npm run export-db

# 2. Switch .env.local to NEW project keys

# 3. After migrations in SQL Editor
npm run import-db

# 4. Verify
npm run test-db
```
