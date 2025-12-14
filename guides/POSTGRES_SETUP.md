# PostgreSQL Database Setup Guide

Complete guide to set up PostgreSQL database for Everest Spices ecommerce.

## Table of Contents
1. [Choose Your Setup](#choose-your-setup)
2. [Option A: Supabase (Recommended)](#option-a-supabase-recommended)
3. [Option B: Direct PostgreSQL](#option-b-direct-postgresql)
4. [Running Migrations](#running-migrations)
5. [Testing Connection](#testing-connection)
6. [Common Issues](#common-issues)

---

## Choose Your Setup

### Option A: Supabase ✅ Recommended for MVP
**Pros:**
- Free tier: 500 MB database, 50,000 rows
- Built-in authentication
- Auto-generated REST API
- Real-time subscriptions
- Row Level Security (RLS)
- Database backups
- Easy deployment

**Best for:** Quick launch, learning, MVP

### Option B: Direct PostgreSQL
**Pros:**
- Full control
- No vendor lock-in
- Unlimited customization
- Can self-host

**Best for:** Production at scale, specific requirements

---

## Option A: Supabase (Recommended)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project:
   - **Name**: `everest-spices`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
5. Wait 2-3 minutes for project creation

### Step 2: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...`
   - **service_role key**: `eyJhbG...` (keep secret!)

### Step 3: Set Environment Variables

Create/Update `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Run Migrations in Supabase

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy contents of `lib/db/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Wait for success message
6. Repeat for `002_seed_products.sql`

### Step 5: Verify Tables

1. Go to **Table Editor** in Supabase
2. You should see tables:
   - users
   - products
   - orders
   - addresses
   - reviews
   - coupons
   - email_subscribers
   - b2b_quotes
   - wishlists

### Step 6: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 7: Test Connection

Create `test-db.ts` in project root:

```typescript
import { supabase } from './lib/db/supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products:', data);
    console.log('✅ Database connection successful!');
  }
}

testConnection();
```

Run:
```bash
npx tsx test-db.ts
```

---

## Option B: Direct PostgreSQL

### Step 1: Choose Hosting

**Free Options:**
- **Railway**: [railway.app](https://railway.app) - $5 free credit
- **Render**: [render.com](https://render.com) - Free tier available
- **Supabase** (still uses PostgreSQL directly)

**Paid Options:**
- **Heroku Postgres**: From $5/month
- **AWS RDS**: From $15/month
- **Digital Ocean**: From $15/month
- **Self-hosted**: VPS from $5/month

### Step 2: Create PostgreSQL Database

#### Using Railway:
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Provision PostgreSQL"
4. Copy connection string

#### Using Render:
1. Go to [render.com](https://render.com)
2. New → PostgreSQL
3. Free tier
4. Copy connection details

### Step 3: Get Connection URL

Format: `postgresql://username:password@host:5432/database`

Example:
```
postgresql://postgres:mypassword@roundhouse.proxy.rlwy.net:12345/railway
```

### Step 4: Set Environment Variables

```env
# PostgreSQL
DATABASE_URL=postgresql://username:password@host:5432/database
```

### Step 5: Install PostgreSQL Client

```bash
npm install pg
npm install --save-dev @types/pg
```

### Step 6: Run Migrations

#### Option 1: Using psql (command line):

```bash
# Install psql if not installed
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Connect to database
psql $DATABASE_URL

# Run migration
\i lib/db/migrations/001_initial_schema.sql
\i lib/db/migrations/002_seed_products.sql
\q
```

#### Option 2: Using Node.js script:

Create `migrate.ts`:

```typescript
import { readFileSync } from 'fs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    const schema = readFileSync('lib/db/migrations/001_initial_schema.sql', 'utf8');
    await client.query(schema);
    console.log('✅ Schema created');

    const seed = readFileSync('lib/db/migrations/002_seed_products.sql', 'utf8');
    await client.query(seed);
    console.log('✅ Data seeded');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
```

Run:
```bash
npx tsx migrate.ts
```

### Step 7: Test Connection

Create `test-pg.ts`:

```typescript
import { query } from './lib/db/postgres';

async function testConnection() {
  try {
    const result = await query('SELECT * FROM products LIMIT 5');
    console.log('Products:', result.rows);
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run:
```bash
npx tsx test-pg.ts
```

---

## Running Migrations

### Adding New Migrations

Create new file: `lib/db/migrations/003_add_feature.sql`

```sql
-- Add new column
ALTER TABLE products ADD COLUMN new_field VARCHAR(255);

-- Create new table
CREATE TABLE IF NOT EXISTS new_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Migration Best Practices

1. **Never modify existing migrations** - Create new ones
2. **Test locally first** - Always test before production
3. **Backup before running** - Especially in production
4. **Make migrations reversible** - Include rollback scripts
5. **Version control** - Commit migrations to git

---

## Testing Connection

### Test Queries

```typescript
// Test product fetch
const { data: products } = await supabase
  .from('products')
  .select('*')
  .limit(5);

// Test product insert
const { data: newProduct, error } = await supabase
  .from('products')
  .insert({
    slug: 'test-product',
    name: 'Test Product',
    description: 'This is a test',
    // ... other required fields
  })
  .select()
  .single();

// Test product update
const { data: updated } = await supabase
  .from('products')
  .update({ is_featured: true })
  .eq('slug', 'garam-masala')
  .select();

// Test product delete
const { error: deleteError } = await supabase
  .from('products')
  .delete()
  .eq('slug', 'test-product');
```

---

## Common Issues

### Issue: "relation does not exist"
**Solution**: Run migrations again. Tables weren't created.

### Issue: "permission denied"
**Solution**: Check RLS policies or use service_role key for admin operations.

### Issue: "connection timeout"
**Solution**: 
- Check firewall settings
- Verify DATABASE_URL is correct
- Ensure database is running

### Issue: "SSL required"
**Solution**: Add `?sslmode=require` to connection string or configure SSL in pool:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Issue: "too many connections"
**Solution**: Use connection pooling (already configured in `lib/db/postgres.ts`)

---

## Production Checklist

Before going live:

- [ ] Migrations run successfully
- [ ] Sample products visible
- [ ] Connection tested from app
- [ ] Environment variables set
- [ ] RLS policies enabled
- [ ] Backups configured (automatic in Supabase)
- [ ] Connection pooling configured
- [ ] Indexes created for performance
- [ ] Sensitive data encrypted
- [ ] Database credentials secure

---

## Next Steps

1. **Update API Routes**: Create API endpoints that use the database
2. **Fetch Products**: Replace static data with database queries
3. **Save Orders**: Store orders in database after payment
4. **User Management**: Implement authentication with database users
5. **Admin Panel**: Build interface to manage products/orders

See `IMPLEMENTATION_GUIDE.md` for detailed API implementation examples.

---

## Helpful Commands

### Supabase CLI (Optional)

Install:
```bash
npm install -g supabase
```

Login:
```bash
supabase login
```

Link project:
```bash
supabase link --project-ref xxxxx
```

Pull schema:
```bash
supabase db pull
```

### PostgreSQL Commands

```sql
-- List all tables
\dt

-- Describe table
\d products

-- Count rows
SELECT COUNT(*) FROM products;

-- View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Check database size
SELECT pg_size_pretty(pg_database_size('database_name'));
```

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.postgresqltutorial.com/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?**

- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Stack Overflow: Tag `postgresql` or `supabase`
- GitHub Issues: Open issue in your repo

Good luck with your database setup! 🚀

