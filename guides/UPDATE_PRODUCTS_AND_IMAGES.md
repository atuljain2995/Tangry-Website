# How to Update Products and Images

You can update products and images in two ways: **via the Admin UI** in the app, or **via Supabase Dashboard** (and image files).

---

## Admin access (production)

The admin area **requires an authenticated user with role `admin`**. The app checks this in [`app/admin/layout.tsx`](../app/admin/layout.tsx) using [`requireAdmin()`](../lib/auth/user.ts). Customers and guests are redirected away from `/admin/*`.

Create an admin user with:

```bash
npm run create-admin
```

(See `scripts/create-admin.ts` for required environment variables.)

---

## Deployed app (Vercel / serverless): cloud storage required

On Vercel (and similar platforms), the server filesystem is **ephemeral**: files written to `public/products/` are not persisted, so uploads would disappear and images would not show.

The admin upload API uses a storage abstraction in `lib/storage`: it tries **Cloudflare R2** first (if configured), then **Supabase Storage**, then falls back to local disk (local dev only).

### Option A: Supabase Storage (same project as your DB)

1. In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Storage**, click **New bucket**.
2. Name the bucket **`product-images`** (must match exactly).
3. Set the bucket to **Public** so product images can be loaded without auth.
4. Create the bucket. No extra policies are required for public read.
5. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in your deployment (e.g. Vercel env vars).

After this, admin uploads are stored in Supabase Storage and the returned URL is saved in the database and used on the storefront.

### Option B: Cloudflare R2 (larger free tier; switch later if needed)

To use R2 instead, set these in Vercel (and optionally `.env.local`):

- `R2_ACCOUNT_ID` – Cloudflare account ID (from R2 overview).
- `R2_ACCESS_KEY_ID` – R2 API token access key.
- `R2_SECRET_ACCESS_KEY` – R2 API token secret.
- `R2_BUCKET_NAME` – Bucket name (e.g. `product-images`).
- `R2_PUBLIC_URL` – Public base URL for the bucket (e.g. `https://pub-xxx.r2.dev` or your custom domain).

Create the bucket in Cloudflare Dashboard → R2 → Create bucket, then create an R2 API token and enable public access (or use a custom domain) to get the public URL. Once these are set, uploads use R2; existing Supabase image URLs in the DB keep working.

---

## Option 1: Admin UI (recommended)

1. **Sign in as admin**, then open **[/admin/products](/admin/products)** (e.g. `http://localhost:3000/admin/products`).
2. **List:** You’ll see all products. Use **New product** or **Edit** on a product.
3. **Edit product:** Change name, description, category, meta title/description, and flags (featured, new, best seller).
4. **Variants:** On the product edit page, manage variant name, SKU, price, compare-at price, stock, and availability.
5. **Edit images:** Each image has a **URL** field. Use either:
   - **Local file:** Put the image in `public/products/` (e.g. `public/products/garam-masala.jpg`) and set URL to `/products/garam-masala.jpg` (dev only if not using cloud storage).
   - **Upload:** Use the admin uploader (persists to R2/Supabase when configured).
   - **External URL:** Paste any full image URL (e.g. from Supabase Storage or a CDN).
6. **Add image:** Add a row, set URL (and optional alt text), then save the product.

---

## Option 2: Supabase Dashboard + image files

### Updating product data

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Table Editor**.
2. **`products`** table: edit `name`, `description`, `category`, `category_id`, `meta_title`, `meta_description`, `keywords`, `is_featured`, `is_new`, `is_best_seller`, etc.
3. **`product_variants`** table: edit `price`, `compare_at_price`, `stock`, `weight`, `is_available` for each size (e.g. 50g, 100g). (You can also do this in **Admin → Edit product → Variants**.)
4. **`product_images`** table: edit `url`, `alt_text`, `display_order`. The site uses these URLs for product images. Add new rows for more images (same `product_id`).

### Adding or changing product images (files)

- **Local images (recommended for your own photos):**  
  Put image files in **`public/products/`** in this repo, e.g.:
  - `public/products/garam-masala.jpg`
  - `public/products/turmeric-powder.jpg`
  Then set **`product_images.url`** in Supabase to `/products/garam-masala.jpg` (no leading slash is also fine; the app serves from root).

- **External or Supabase Storage:**  
  Upload images to Supabase Storage (or any host), get the public URL, and set that as **`product_images.url`** in the Table Editor.

### Image URL rules

- **Local:** `/products/filename.jpg` → file must exist at `public/products/filename.jpg`.
- **External:** Use full URL, e.g. `https://your-project.supabase.co/storage/v1/object/public/bucket/image.jpg`.
- If an image fails to load, the site shows a placeholder (`/products/placeholder.png`).

---

## Summary

| What to change        | Where to change it                          |
|-----------------------|---------------------------------------------|
| Name, description     | Admin UI → Edit product, or `products` table |
| Category, meta, flags | Admin UI → Edit product, or `products` table |
| Prices, stock         | Admin UI → product **Variants**, or `product_variants` table |
| Image URL             | Admin UI → Images section, or `product_images` table |
| Image file            | Admin upload (R2/Supabase in prod), or `public/products/` + URL above |

After updating, refresh the storefront (e.g. `/products` or the product page) to see changes.
