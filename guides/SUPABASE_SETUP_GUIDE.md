# 🚀 Supabase Setup Guide - Quick Start

## Step 1: Get Your Service Role Key (2 minutes)

Your `.env.local` already has the URL and anon key, but you need the **service role key**.

### How to Get It:

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu

2. Click **Settings** (gear icon) in the left sidebar

3. Click **API** in the settings menu

4. Scroll down to **Project API keys** section

5. Find the **service_role** key (marked as "secret")

6. Click **Reveal** and **Copy** the key

7. Open your `.env.local` file and replace the placeholder:

```env
# Replace this line:
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key

# With your actual key (should start with eyJ...):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBta...
```

---

## Step 2: Create Database Tables (5 minutes)

You need to run SQL migrations to create all the tables for products, orders, users, etc.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard

2. Click **SQL Editor** in the left sidebar

3. Click **New query**

4. Open the file `lib/db/migrations/001_initial_schema.sql` in your project

5. **Copy ALL the content** from that file

6. **Paste** it into the SQL Editor

7. Click **Run** (or press Cmd/Ctrl + Enter)

8. Wait for "Success. No rows returned" message ✅

9. Click **New query** again

10. Open the file `lib/db/migrations/002_seed_products.sql`

11. **Copy ALL the content** and paste into SQL Editor

12. Click **Run**

13. You should see "Success. X rows returned" ✅

### Option B: Using Command Line

```bash
# Make sure you have the service role key in .env.local first!

# Run migrations
npx supabase db push
```

---

## Step 3: Verify Tables Were Created

### In Supabase Dashboard:

1. Click **Table Editor** in left sidebar

2. You should see these tables:
   - ✅ `products`
   - ✅ `product_variants`
   - ✅ `product_images`
   - ✅ `users`
   - ✅ `addresses`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `reviews`
   - ✅ `coupons`
   - ✅ `email_subscribers`
   - ✅ `b2b_quotes`
   - ✅ `wishlist_items`

3. Click on **products** table → Should see 5 sample products

---

## Step 4: Test Connection

Run this test script from your terminal:

```bash
npm run test-db
```

**Expected Output:**
```
🔍 Testing Supabase connection...
✅ Test 1: Fetching products... Success! Found 5 products
✅ Test 2: Checking product structure... Valid
✅ Test 3: Fetching single product... Success!
✅ All tests passed!
```

**If you see errors:**
- Check your service role key is correct
- Make sure migrations ran successfully
- Verify tables exist in Supabase dashboard

---

## Step 5: Restart Your Dev Server

After adding the service role key:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## Quick Troubleshooting

### Error: "Failed to fetch products"
**Fix:** 
1. Check service role key in `.env.local`
2. Make sure it starts with `eyJ`
3. No extra spaces or quotes around it

### Error: "relation 'products' does not exist"
**Fix:**
1. Run the migrations (Step 2)
2. Check Table Editor to verify tables exist

### Error: "Invalid API key"
**Fix:**
1. Make sure you copied the **service_role** key, not the anon key
2. Check there's no extra spaces in `.env.local`
3. Restart dev server after changing `.env.local`

### Products don't show up on website
**Fix:**
1. Make sure seed migration ran: `002_seed_products.sql`
2. Check in Supabase Table Editor → products → should have 5 rows
3. Clear browser cache and refresh

---

## What Happens Next?

Once connected, your website will:

1. ✅ **Load products from database** instead of static data
2. ✅ **Save cart to database** (optional, currently uses localStorage)
3. ✅ **Track orders** when users checkout
4. ✅ **Manage inventory** automatically
5. ✅ **Store user accounts** and addresses
6. ✅ **Handle reviews** and ratings
7. ✅ **Process coupons** and discounts

---

## Current Status: Using Static Data

Right now your website works with **static data** from `lib/data/productsExtended.ts`. This is good for testing!

**With Supabase connected:**
- Products come from database
- You can add/edit products in Supabase dashboard
- Inventory updates automatically
- Orders are saved permanently

**Without Supabase (current):**
- Products from static file
- Cart uses browser localStorage only
- Orders not saved
- But everything still works for demo!

---

## Need Help?

Run the test script to diagnose issues:

```bash
npm run test-db
```

It will tell you exactly what's wrong:
- Connection issues
- Missing tables
- Invalid credentials
- Data problems

---

## Advanced: Connecting from Code

Once setup is complete, you can use Supabase in your code:

```typescript
import { createServerClient } from '@/lib/db/supabase';

// Fetch products
const supabase = createServerClient();
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true);

// Create an order
const { data: order } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    total: 299.99,
    status: 'pending'
  });
```

All the helper functions are already set up in `lib/db/supabase.ts`!

---

## Summary Checklist

Complete these in order:

- [ ] Get service role key from Supabase dashboard
- [ ] Add it to `.env.local` (replace placeholder)
- [ ] Run migration `001_initial_schema.sql` in SQL Editor
- [ ] Run migration `002_seed_products.sql` in SQL Editor
- [ ] Verify tables exist in Table Editor
- [ ] Run `npm run test-db` to test connection
- [ ] Restart dev server (`npm run dev`)
- [ ] Test website - products should still work!

**Time needed:** ~10 minutes

Let me know when you've completed Step 1 (getting the service role key) and I'll help you with the next steps!

