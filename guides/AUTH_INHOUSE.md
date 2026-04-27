# In-house auth (no Supabase Auth)

Auth is fully in-house: users and sessions live in **Postgres** only. No Supabase Auth.

---

## Where it lives

- **`public.users`** – id, email, name, phone, role, **password_hash** (bcrypt).
- **`public.sessions`** – id, user_id, token, expires_at. One row per login; cookie holds the token.

Session cookie: **`tangry_sid`** (httpOnly, 7 days). Middleware and server code read it and look up the user.

---

## Setup

1. **Run migration**  
   In Supabase **SQL Editor**, run:
   - **`lib/db/migrations/005_inhouse_auth.sql`**  
     This adds `password_hash` to `users` and creates the `sessions` table.

2. **Create first admin**

   **Option A – Script (recommended)**  
   From the project root (with `.env.local` set):

   ```bash
   npm run create-admin
   ```

   You’ll be prompted for email and password. Or pass them:

   ```bash
   npm run create-admin -- admin@example.com YourSecurePassword
   ```

   - If that email already exists, their role is set to `admin`.
   - If not, a new user is created with role `admin`.

   **Option B – Promote after signup**  
   Sign up once at `/signup`, then in Supabase SQL Editor:

   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
   ```

   **Option C – Create admin in SQL only**  
   Generate a bcrypt hash (Node):

   ```bash
   node -e "const b=require('bcrypt'); b.hash('YourPassword', 10).then(h=>console.log(h))"
   ```

   Then in SQL:

   ```sql
   INSERT INTO public.users (email, name, role, password_hash)
   VALUES ('admin@example.com', 'Admin', 'admin', '<paste-bcrypt-hash>');
   ```

---

## Flow

- **Sign up** – Server action hashes password (bcrypt), inserts into `users`, creates a row in `sessions`, sets `tangry_sid` cookie.
- **Sign in** – Server action finds user by email, verifies password with bcrypt, creates session, sets cookie.
- **Sign out** – Server action deletes session row and clears cookie.
- **Protected routes** – Middleware checks for `tangry_sid` on `/admin` and redirects to `/login` if missing. Admin layout calls `requireAdmin()` (session + role check) and redirects to `/` if not admin.

---

## Files

- **`lib/auth/session.ts`** – createSession, getSessionToken, getSessionUser, destroySession (cookie + DB).
- **`lib/auth/user.ts`** – getCurrentUserProfile(), requireAdmin() (use getSessionUser).
- **`lib/actions/auth.ts`** – signIn, signUp, signOut (bcrypt + session).
- **`app/api/auth/me/route.ts`** – GET returns current profile from session.
- **`middleware.ts`** – Protects `/admin` by requiring `tangry_sid` cookie.

Supabase is still used for **data** (products, orders, etc.); only **auth** is in-house.
