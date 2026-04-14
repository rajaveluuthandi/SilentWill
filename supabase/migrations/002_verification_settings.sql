-- SilentWill: Verification (Dead Man's Switch) Settings
-- Run this in Supabase SQL Editor

CREATE TABLE public.verification_settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  interval_months int NOT NULL DEFAULT 6 CHECK (interval_months IN (3, 6, 12)),
  last_verified   timestamptz NOT NULL DEFAULT now(),
  next_check      timestamptz NOT NULL DEFAULT now() + interval '6 months',
  reminder_stage  int NOT NULL DEFAULT 0 CHECK (reminder_stage BETWEEN 0 AND 3),
  -- 0 = no reminder sent, 1 = first reminder, 2 = second reminder, 3 = final warning
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'grace', 'triggered')),
  -- active = normal, grace = reminders being sent, triggered = vault released
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verification_user_id ON public.verification_settings(user_id);
CREATE INDEX idx_verification_next_check ON public.verification_settings(next_check);

ALTER TABLE public.verification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification"
  ON public.verification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification"
  ON public.verification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verification"
  ON public.verification_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_verification_updated_at
  BEFORE UPDATE ON public.verification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
