# Login & Auth (Normal + Admin Users)

## Where are users stored?

- **Supabase Auth** (`auth.users`): Handles **identity** — sign up, sign in, passwords, session, JWT. You don’t create this table; Supabase provides it when Auth is enabled.
- **Postgres `public.users`**: Stores **app profile** — email, name, phone, **role** (customer / retailer / admin). Your app and RLS use this for “current user” and “is admin?”.

They are linked by **user id**: `public.users.id` = Supabase Auth user id (`auth.uid()`). When someone signs up via Auth, a row is created in `public.users` with that same id (see migration below).

---

## Setup

1. **Enable Auth**  
   Supabase Dashboard → **Authentication** → enable Email (and any other providers you want).

2. **Run the auth sync migration**  
   In Supabase **SQL Editor**, run:
   - **`lib/db/migrations/004_auth_sync_public_users.sql`**  
   This adds a trigger so that when a user signs up in Supabase Auth, a row is created (or updated) in `public.users` with `id = auth user id`, `email`, `name`, and `role = 'customer'`.

3. **Make a user an admin**  
   In Supabase **SQL Editor**:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
   ```
   Use the email they sign in with. They must have signed up at least once so a row exists in `public.users`.

---

## What’s implemented

- **Navbar**: User icon → **Sign in** (if not logged in) or a dropdown with name, Account, Orders, **Admin** (only if `role = 'admin'`), and Sign out.
- **Routes**:
  - `/login` – email + password sign in (redirect param supported, e.g. after visiting `/admin`).
  - `/signup` – create account (name optional); trigger syncs to `public.users`.
  - `/account` – profile (email, name, role); requires login.
  - `/account/orders` – placeholder “My orders”; requires login.
  - `/admin/*` – **protected**: must be logged in (middleware) and `role = 'admin'` (admin layout), otherwise redirect to `/login` or `/`.

---

## Env vars

Same as before; auth uses the same Supabase project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-only reads of `public.users`)

No extra env vars needed for basic email/password auth.
