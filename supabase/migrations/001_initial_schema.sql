-- SilentWill: Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ============================================================
-- 1. ASSETS TABLE
-- ============================================================
CREATE TABLE public.assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  category    text NOT NULL CHECK (category IN (
    'banking', 'real-estate', 'insurance', 'government-funds',
    'stocks', 'mutual-funds', 'gold', 'cash', 'liabilities', 'digital'
  )),
  subcategory text NOT NULL DEFAULT '',
  value       numeric NOT NULL DEFAULT 0,
  currency    text NOT NULL DEFAULT 'INR',
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'linked', 'appraised', 'secured', 'synced', 'active', 'pending'
  )),
  institution    text,
  account_number text,
  routing_number text,
  account_type   text,
  location       text,
  policy_number  text,
  maturity_date  date,
  nominee        text,
  folio_number   text,
  weight         text,
  notes          text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_category ON public.assets(user_id, category);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON public.assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON public.assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON public.assets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON public.assets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. NOMINEES TABLE
-- ============================================================
CREATE TABLE public.nominees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  relation    text NOT NULL,
  email       text NOT NULL,
  phone       text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending')),
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_nominees_user_id ON public.nominees(user_id);

ALTER TABLE public.nominees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nominees"
  ON public.nominees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nominees"
  ON public.nominees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nominees"
  ON public.nominees FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nominees"
  ON public.nominees FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. ACTIVITY LOG TABLE
-- ============================================================
CREATE TABLE public.activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  type        text NOT NULL CHECK (type IN ('secure', 'asset', 'legacy', 'settings')),
  icon        text NOT NULL DEFAULT 'info',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity"
  ON public.activity_log FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_nominees_updated_at
  BEFORE UPDATE ON public.nominees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
