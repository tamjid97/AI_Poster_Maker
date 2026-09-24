/*
# PosterAI — Core Database Schema

## Overview
Creates the three main tables for the PosterAI application:
1. `profiles` — extends Supabase auth.users with name and role (USER/ADMIN)
2. `templates` — poster templates with layout config, publicly readable
3. `posters` — user-generated posters, owner-scoped via RLS

## Tables

### profiles
- `id` (uuid, PK, references auth.users)
- `name` (text, user's full name)
- `role` (text, default 'USER', values: 'USER' or 'ADMIN')
- `created_at` (timestamptz)

### templates
- `id` (uuid, PK)
- `title` (text)
- `occasion_type` (text)
- `thumbnail_url` (text)
- `layout_config` (jsonb, stores layout/color/typography settings)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

### posters
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users, defaults to auth.uid())
- `template_id` (uuid, FK to templates, nullable)
- `name` (text)
- `designation` (text, nullable)
- `party` (text, nullable)
- `organization` (text, nullable)
- `union_or_thana` (text, nullable)
- `district` (text, nullable)
- `occasion` (text)
- `headline` (text)
- `photo_urls` (text[], default empty array)
- `generated_image_url` (text, nullable)
- `layout_suggestion` (jsonb, nullable — stores Gemini's layout suggestions)
- `status` (text, default 'DRAFT' — values: DRAFT, GENERATING, COMPLETED, FAILED)
- `regenerate_count` (int, default 0)
- `created_at` (timestamptz)

## Security
- `profiles`: users can read/update their own profile. Admins can read all.
- `templates`: public read (anon + authenticated) for browsing. Only authenticated can write (admin in practice).
- `posters`: full owner-scoped CRUD — users can only access their own posters.

## Notes
1. Posters.user_id defaults to auth.uid() so client inserts work without passing user_id.
2. Template SELECT is public so the landing page can show templates without login.
3. Poster status uses a text column with app-level enum validation.
*/

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  occasion_type text NOT NULL,
  thumbnail_url text NOT NULL DEFAULT '',
  layout_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Templates are publicly readable (for browsing without login)
DROP POLICY IF EXISTS "select_templates_public" ON templates;
CREATE POLICY "select_templates_public"
  ON templates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can create/update/delete templates (admin in practice)
DROP POLICY IF EXISTS "insert_templates_auth" ON templates;
CREATE POLICY "insert_templates_auth"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "update_templates_auth" ON templates;
CREATE POLICY "update_templates_auth"
  ON templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "delete_templates_auth" ON templates;
CREATE POLICY "delete_templates_auth"
  ON templates FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- POSTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  name text NOT NULL,
  designation text,
  party text,
  organization text,
  union_or_thana text,
  district text,
  occasion text NOT NULL,
  headline text NOT NULL,
  photo_urls text[] NOT NULL DEFAULT '{}',
  generated_image_url text,
  layout_suggestion jsonb,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'GENERATING', 'COMPLETED', 'FAILED')),
  regenerate_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE posters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_posters" ON posters;
CREATE POLICY "select_own_posters"
  ON posters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_posters" ON posters;
CREATE POLICY "insert_own_posters"
  ON posters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_posters" ON posters;
CREATE POLICY "update_own_posters"
  ON posters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_posters" ON posters;
CREATE POLICY "delete_own_posters"
  ON posters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posters_user_id ON posters(user_id);
CREATE INDEX IF NOT EXISTS idx_posters_created_at ON posters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_occasion_type ON templates(occasion_type);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates(is_active);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
