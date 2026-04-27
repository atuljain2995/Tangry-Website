# 🚀 Run Migrations Now - Fix the Test Error

## Why Test Failed ❌

```bash
❌ Products fetch failed: TypeError: fetch failed
```

**Reason:** Your database tables don't exist yet! You have the correct keys, but need to create the tables.

---

## 📋 Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

Click this link: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/sql/new

Or:

1. Go to: https://supabase.com/dashboard
2. Click on your project: **pmknwgwbwfyvrkfbrccu**
3. Click **SQL Editor** in left sidebar
4. Click **+ New query**

---

### Step 2: Run First Migration (Create Tables)

1. In your code editor, open: `lib/db/migrations/001_initial_schema.sql`

2. **Select ALL** the content (Cmd+A / Ctrl+A)

3. **Copy** it (Cmd+C / Ctrl+C)

4. Go back to Supabase SQL Editor

5. **Paste** the SQL code

6. Click the **"Run"** button (bottom right corner, or press Cmd/Ctrl + Enter)

7. Wait for the success message:
   ```
   ✓ Success. No rows returned
   ```

**What this does:** Creates 12 tables (products, orders, users, etc.)

---

### Step 3: Run Second Migration (Add Sample Data)

1. In Supabase, click **+ New query** (top left)

2. In your code editor, open: `lib/db/migrations/002_seed_products.sql`

3. **Select ALL** the content (Cmd+A / Ctrl+A)

4. **Copy** it (Cmd+C / Ctrl+C)

5. Go back to Supabase SQL Editor

6. **Paste** the SQL code

7. Click **"Run"**

8. Wait for the success message:
   ```
   ✓ Success. 5 rows returned
   ```

**What this does:** Adds 5 sample products (Garam Masala, Turmeric, etc.)

---

### Step 4: Verify Tables Exist

1. In Supabase dashboard, click **Table Editor** (in left sidebar)

2. You should see these tables:
   - ✅ products
   - ✅ product_variants
   - ✅ product_images
   - ✅ users
   - ✅ addresses
   - ✅ orders
   - ✅ order_items
   - ✅ reviews
   - ✅ coupons
   - ✅ email_subscribers
   - ✅ b2b_quotes
   - ✅ wishlist_items

3. Click on **products** table

4. You should see **5 products** listed!

---

### Step 5: Test Again

Now run the test again:

```bash
npm run test-db
```

**Expected Output:**

```
🔍 Testing Supabase connection...

Test 1: Fetching products...
✅ Products fetch success! Found 5 products

Test 2: Checking product structure...
✅ Product structure is valid

Test 3: Fetching single product...
✅ Single product fetch success!

✅ All tests passed! Your Supabase connection is working.
```

---

## 🎉 Success! What's Next?

Your website will now:

- ✅ Load products from Supabase database
- ✅ Save orders to database
- ✅ Track inventory in real-time
- ✅ Store user data securely

### View Your Data:

- **Products**: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/editor/products
- **Orders**: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/editor/orders

### Add More Products:

1. Go to Table Editor → products
2. Click **+ Insert row**
3. Fill in product details
4. Click **Save**

---

## 🐛 Troubleshooting

### SQL Error: "syntax error at or near..."

- **Fix**: Make sure you copied the ENTIRE file content
- Check you're not missing the first few lines
- Try copying again

### SQL Error: "relation already exists"

- **Fix**: Tables already exist! Skip to Step 5 to test
- Or drop tables first (ask if you need help)

### Still getting "fetch failed"

- **Fix**: Check your internet connection
- Make sure Supabase project is active
- Try refreshing the dashboard

### Can't find SQL Editor

```
Dashboard → Left Sidebar → SQL Editor
(Icon looks like </> or "SQL")
```

---

## 📸 Visual Guide

### What SQL Editor Looks Like:

```
┌─────────────────────────────────────────┐
│  SQL Editor                        Run  │
├─────────────────────────────────────────┤
│                                         │
│  [Paste your SQL migration here]       │
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Where to Find Table Editor:

```
Left Sidebar:
├─ Home
├─ 📊 Table Editor  ← Click here
├─ SQL Editor
├─ Database
└─ Settings
```

---

## 💡 Pro Tips

1. **Keep SQL Editor open** - you might need to run more queries
2. **Bookmark Table Editor** - easy way to manage data
3. **Check RLS policies** - already configured in migration
4. **Backup your data** - Dashboard → Database → Backups

---

## Ready? Let's Do This! 🚀

**Start now:**

1. Open: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/sql/new
2. Copy from `001_initial_schema.sql`
3. Paste and Run
4. Copy from `002_seed_products.sql`
5. Paste and Run
6. Run `npm run test-db`

Let me know when you've completed this and I'll help you with the next steps!
