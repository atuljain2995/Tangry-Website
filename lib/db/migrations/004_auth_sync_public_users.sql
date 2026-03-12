-- Sync Supabase Auth users to public.users so we have a single place for role (customer / admin)
-- Run this in Supabase SQL Editor (or via Supabase migrations)
-- Requires: Supabase Auth enabled (Dashboard → Authentication)

-- Ensure public.users can store auth user id (id = auth.uid())
-- Our existing table already has id UUID PRIMARY KEY; we use it to store auth.uid()

-- Function: when a new user signs up in Supabase Auth, create/update public.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'customer'
  )
  ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    name = COALESCE(EXCLUDED.name, users.name),
    updated_at = NOW();
  RETURN new;
END;
$$;

-- Trigger: after insert on auth.users (Supabase Auth schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Optional: allow updating public.users when auth user updates (e.g. email change)
CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET email = new.email,
      name = COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', users.name),
      updated_at = NOW()
  WHERE id = new.id;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_updated();

-- To promote a user to admin, run in SQL Editor:
--   UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
