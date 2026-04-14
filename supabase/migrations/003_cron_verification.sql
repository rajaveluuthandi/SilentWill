-- SilentWill: pg_cron job for daily dead man's switch check
-- NOTE: pg_cron must be enabled in Supabase Dashboard → Database → Extensions → enable pg_cron
-- Then run this SQL in the SQL Editor

-- This calls the Edge Function daily at midnight UTC
-- Replace YOUR_ANON_KEY with your actual anon key

-- Option 1: Using pg_net + pg_cron (calls Edge Function via HTTP)
-- First enable pg_net extension if not already enabled

-- SELECT cron.schedule(
--   'daily-verification-check',
--   '0 0 * * *',  -- every day at midnight UTC
--   $$
--   SELECT net.http_post(
--     url := 'https://pnsgjisutjzuassrzboa.supabase.co/functions/v1/check-verification',
--     headers := '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb,
--     body := '{}'::jsonb
--   );
--   $$
-- );

-- Option 2: For testing, you can call the Edge Function manually via curl:
-- curl -X POST https://pnsgjisutjzuassrzboa.supabase.co/functions/v1/check-verification \
--   -H "Authorization: Bearer YOUR_ANON_KEY" \
--   -H "Content-Type: application/json"

-- For now, the verification check runs when:
-- 1. User visits the Verification page (client-side check)
-- 2. The Edge Function is called manually or via cron
-- Full cron setup requires deploying the Edge Function first via Supabase CLI
