# 🔧 Fix: Product Variants Missing

## Problem
The `product_variants` table doesn't exist in your database, causing product detail pages to crash.

## ✅ Quick Fix (3 minutes)

### Step 1: Create the Variants Tables

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/sql/new

2. Open the file: `lib/db/migrations/002b_create_variants_tables.sql`

3. **Copy ALL** the content (Cmd+A, Cmd+C)

4. **Paste** into Supabase SQL Editor

5. Click **Run**

6. Wait for success message: ✅ "Success"

You should see output like:
```
product_variants    0
product_images      5
```

This confirms the tables are created!

### Step 2: Add Product Variants Data

1. Click **+ New query** in Supabase SQL Editor

2. Open the file: `lib/db/migrations/003_add_product_variants.sql`

3. **Copy ALL** the content (Cmd+A, Cmd+C)

4. **Paste** into Supabase SQL Editor

5. Click **Run**

6. You should see output like:
```
Biryani Masala          3
Eazy Chef - PTM         2
Garam Masala            3
Red Chilli Powder       3
Turmeric Powder         4
```

This shows each product now has variants!

### Step 3: Verify in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/editor/product_variants

2. You should see **18 variants** total

3. Click on **product_images** table - should have 5 images (one per product)

### Step 4: Test Your Website

1. Go to: http://localhost:3000/products/red-chilli-powder
2. The page should now load correctly! ✅
3. You should see size options: 100g, 200g, 500g
4. Prices should display with discounts

---

## What Gets Added

### Tables Created:
- **`product_variants`** - Stores different sizes/weights for each product
- **`product_images`** - Stores product image URLs

### Data Added:

| Product | Variants | Price Range |
|---------|----------|-------------|
| Garam Masala | 50g, 100g, 200g | ₹45 - ₹165 |
| Turmeric Powder | 50g, 100g, 200g, 500g | ₹30 - ₹245 |
| Red Chilli Powder | 100g, 200g, 500g | ₹55 - ₹245 |
| Paneer Tikka Masala | 50g, 100g | ₹65 - ₹120 |
| Biryani Masala | 50g, 100g, 200g | ₹50 - ₹185 |

**Total:** 18 product variants across 5 products

---

## Test All Products

After running both migrations, test these URLs:

- ✅ http://localhost:3000/products/garam-masala
- ✅ http://localhost:3000/products/turmeric-powder
- ✅ http://localhost:3000/products/red-chilli-powder
- ✅ http://localhost:3000/products/eazy-chef-paneer-tikka-masala
- ✅ http://localhost:3000/products/biryani-masala

All should load without errors!

---

## Expected Product Page Features

Once fixed, each product page will show:

- ✅ Product name and description
- ✅ Multiple size options (50g, 100g, 200g, etc.)
- ✅ Prices with discounts highlighted
- ✅ Stock status (In Stock/Low Stock/Out of Stock)
- ✅ Add to Cart button
- ✅ Quantity selector
- ✅ Delivery estimate
- ✅ Product rating and reviews count

---

## For Future Products

When adding new products, remember to also add:

### 1. Product Variants
```sql
INSERT INTO product_variants (product_id, name, sku, price, stock, weight, is_available)
VALUES 
  ('your-product-id', '50g', 'SKU-50', 45.00, 500, 50, true),
  ('your-product-id', '100g', 'SKU-100', 85.00, 400, 100, true);
```

### 2. Product Images
```sql
INSERT INTO product_images (product_id, url, alt_text, display_order)
VALUES 
  ('your-product-id', '/products/your-product.jpg', 'Your Product Name', 0);
```

---

## Troubleshooting

### Error: "relation already exists"
✅ Good! This means the table is already created. Skip to Step 2.

### Error: "foreign key violation"
❌ Make sure products exist in the `products` table first.
Run this to check:
```sql
SELECT id, name, slug FROM products;
```

### Products still showing error after migration
1. Check if variants were added:
```sql
SELECT COUNT(*) FROM product_variants;
```
Should return: 18

2. Refresh your browser (Cmd+R or Ctrl+R)

3. Check browser console (F12) for any errors

---

## Summary

You need to run **2 migrations** in order:

1. ✅ `002b_create_variants_tables.sql` - Creates the tables
2. ✅ `003_add_product_variants.sql` - Adds the variant data

After both migrations, your product pages will work perfectly!

---

Ready to start? Begin with **Step 1** above! 🚀
