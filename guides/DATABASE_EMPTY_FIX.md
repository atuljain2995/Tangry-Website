# 🔧 Fix: Database Empty Errors

**Error:** `Error fetching product: { code: 'PGRST116', details: 'The result contains 0 rows' }`

## ❓ What's Happening?

Your app is running perfectly! The errors you're seeing mean:
- ✅ Supabase connection is working
- ✅ Database structure exists
- ❌ **No product data** has been added yet

The app is trying to display products, but your database tables are empty.

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project: https://supabase.com/dashboard
2. Click on your project: `pmknwgwbwfyvrkfbrccu`
3. Go to **SQL Editor** (in the left sidebar)

### Step 2: Run Migration Scripts

You need to run these SQL files in order:

#### Migration 1: Create Tables (if not done)
```sql
-- File: lib/db/migrations/001_initial_schema.sql
-- Copy and paste the entire contents of this file into SQL Editor
-- Click "Run"
```

#### Migration 2: Add Product Data
```sql
-- File: lib/db/migrations/002_seed_products.sql
-- Copy and paste the entire contents of this file into SQL Editor
-- Click "Run"
```

#### Migration 3: Add Product Variants
```sql
-- File: lib/db/migrations/003_add_product_variants.sql
-- Copy and paste the entire contents of this file into SQL Editor
-- Click "Run"
```

#### Migration 4: Create Variant Tables (if needed)
```sql
-- File: lib/db/migrations/002b_create_variants_tables.sql
-- Copy and paste the entire contents of this file into SQL Editor
-- Click "Run"
```

### Step 3: Verify Data

In Supabase, go to **Table Editor** and check:
- ✅ `products` table has 5+ rows
- ✅ `product_variants` table has 10+ rows
- ✅ `product_images` table has data

### Step 4: Refresh Your App

1. Go back to your browser: http://localhost:3000
2. **Hard refresh**: Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. You should now see products! 🎉

---

## 🚀 Alternative: Run Migration Script

If the SQL files exist, you can run this command:

```bash
cd /Users/Atul_Jain/Desktop/development-projects/everest-clone

# Run each migration file
# (This requires the files to exist in lib/db/migrations/)
```

---

## 📊 After Running Migrations

You should see:
- ✅ Products displaying on homepage
- ✅ Products page working
- ✅ Product detail pages opening
- ✅ No more database errors

---

## ⚠️ Still Seeing Errors?

### Check Your .env.local File

Make sure these are set correctly:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pmknwgwbwfyvrkfbrccu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Test Database Connection

```bash
npm run test-db
```

Should show: ✅ Connected successfully

---

## 🎯 Expected Behavior

### Before Migrations:
```
Error fetching product: { code: 'PGRST116', details: 'The result contains 0 rows' }
```

### After Migrations:
```
GET / 200 in 500ms ✓
GET /products 200 in 300ms ✓
No errors!
```

---

## 📝 Summary

**Problem:** Database tables are empty  
**Solution:** Run migration SQL files in Supabase  
**Time:** 5 minutes  
**Result:** Products will display correctly  

---

## 🆘 Need Help?

1. Check [RUN_MIGRATIONS_NOW.md](./RUN_MIGRATIONS_NOW.md) for detailed migration steps
2. Check [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for setup help
3. Check [ENV_VARIABLES.md](./ENV_VARIABLES.md) for environment configuration

---

**Quick Tip:** The errors you're seeing are **good** - they mean your app is working and just waiting for data! 🚀

