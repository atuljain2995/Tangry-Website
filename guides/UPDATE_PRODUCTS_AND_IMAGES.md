# How to Update Products and Images

You can update products and images in two ways: **via the Admin UI** in the app, or **via Supabase Dashboard** (and image files).

---

## Option 1: Admin UI (recommended)

1. **Open the admin:** Go to **[/admin/products](/admin/products)** in your browser (e.g. `http://localhost:3000/admin/products`).
2. **List:** You’ll see all products. Click **Edit** on a product.
3. **Edit product:** Change name, description, category, meta title/description, and flags (featured, new, best seller).
4. **Edit images:** Each image has a **URL** field. Use either:
   - **Local file:** Put the image in `public/products/` (e.g. `public/products/garam-masala.jpg`) and set URL to `/products/garam-masala.jpg`.
   - **External URL:** Paste any full image URL (e.g. from Supabase Storage or a CDN).
5. **Add image:** Click “Add image”, set URL (and optional alt text), then Save.
6. **Save:** Click “Save product” to update the database.

**Note:** The admin area is not protected by login yet. For production, add authentication or restrict access (e.g. env variable or VPN). See `guides/` for deployment.

---

## Option 2: Supabase Dashboard + image files

### Updating product data

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Table Editor**.
2. **`products`** table: edit `name`, `description`, `category`, `subcategory`, `meta_title`, `meta_description`, `keywords`, `is_featured`, `is_new`, `is_best_seller`, etc.
3. **`product_variants`** table: edit `price`, `compare_at_price`, `stock`, `weight`, `is_available` for each size (e.g. 50g, 100g).
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
| Prices, stock         | Supabase `product_variants` (or extend Admin later) |
| Image URL             | Admin UI → Images section, or `product_images` table |
| Image file            | Add file to `public/products/` and set URL above     |

After updating, refresh the storefront (e.g. `/products` or the product page) to see changes.
