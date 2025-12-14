# ⚡ Quick Start - Connect to Supabase (10 minutes)

## ✅ Your Current Setup
- [x] Supabase project created: `pmknwgwbwfyvrkfbrccu`
- [x] URL and anon key configured in `.env.local`
- [ ] Service role key needed
- [ ] Database tables need to be created

---

## 🎯 3 Simple Steps to Connect

### Step 1️⃣: Get Service Role Key (2 min)

1. Open: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/settings/api

2. Scroll to **"Project API keys"**

3. Find **service_role** → Click **"Reveal"** → Copy the key

4. Open your `.env.local` file and update this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
   ```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://pmknwgwbwfyvrkfbrccu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

---

### Step 2️⃣: Create Database Tables (5 min)

1. Open: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/sql/new

2. **First Migration - Create Tables:**
   - Open file: `lib/db/migrations/001_initial_schema.sql`
   - Copy **ALL** the content (Cmd/Ctrl + A)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (bottom right)
   - Wait for ✅ "Success"

3. **Second Migration - Add Sample Products:**
   - Click **"New query"** (top left)
   - Open file: `lib/db/migrations/002_seed_products.sql`
   - Copy **ALL** the content
   - Paste into SQL Editor
   - Click **"Run"**
   - Wait for ✅ "Success"

---

### Step 3️⃣: Test Connection (1 min)

Run this in your terminal:

```bash
npm run test-db
```

**Expected Output:**
```
🔍 Testing Supabase connection...
✅ Test 1: Fetching products... Success! Found 5 products
✅ Test 2: Checking product structure... Valid
✅ All tests passed!
```

---

## 🎉 Done! What's Next?

### Restart Your Server:
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

### Your Website Now Has:
- ✅ Products loaded from Supabase database
- ✅ Real-time inventory tracking
- ✅ Order management ready
- ✅ User authentication ready
- ✅ Reviews & ratings system
- ✅ Coupon system

### Manage Your Data:
- **View Products**: https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/editor
- **View Orders**: Click "orders" table
- **Add New Products**: Click "+ Insert row"

---

## 🐛 Troubleshooting

### Test Fails: "Invalid API key"
```bash
# Check your .env.local has the correct service_role key
# Make sure it starts with "eyJ"
# Restart server after changing .env.local
```

### Test Fails: "relation 'products' does not exist"
```bash
# Run the migrations again in Supabase SQL Editor
# Verify in Table Editor that tables exist
```

### Can't Find Service Role Key
```bash
# Direct link:
https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu/settings/api

# Look for "service_role" (marked as secret, not public)
```

---

## 📋 Quick Reference

| What | Where |
|------|-------|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/pmknwgwbwfyvrkfbrccu |
| **SQL Editor** | Dashboard → SQL Editor |
| **Table Editor** | Dashboard → Table Editor |
| **API Settings** | Dashboard → Settings → API |
| **Migration Files** | `lib/db/migrations/` |
| **Test Script** | `npm run test-db` |
| **Environment File** | `.env.local` |

---

## 💡 Pro Tips

1. **Bookmark your Supabase dashboard** for quick access
2. **Save your .env.local** - never commit it to git!
3. **Use Table Editor** to add products visually
4. **Check SQL Editor logs** if migrations fail
5. **Run test-db** anytime to verify connection

---

## 🚀 Ready? Let's Go!

**Start with Step 1**: Get your service role key from the dashboard

Once you have it, come back and continue with Steps 2 & 3.

Need help? Just ask! 🙋‍♂️

