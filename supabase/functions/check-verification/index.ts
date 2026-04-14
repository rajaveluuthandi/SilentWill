// Supabase Edge Function: Dead Man's Switch Verification Check
// Runs daily via pg_cron. Checks all users whose next_check has passed.
// Sends escalating reminders and eventually triggers vault release.
//
// Deploy: supabase functions deploy check-verification
// Or paste this in Supabase Dashboard → Edge Functions → New Function

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const REMINDER_DELAYS_DAYS = [0, 7, 14, 21]; // Stage 0→1: immediate, 1→2: 7 days, 2→3: 14 days, 3→trigger: 21 days

Deno.serve(async (req: Request) => {
  try {
    const now = new Date().toISOString();

    // Find all users whose verification is overdue
    const { data: overdueUsers, error } = await supabase
      .from('verification_settings')
      .select('*, auth_user:user_id(email)')
      .lt('next_check', now)
      .neq('status', 'triggered');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const results = [];

    for (const settings of overdueUsers ?? []) {
      const userEmail = (settings as any).auth_user?.email;
      const newStage = settings.reminder_stage + 1;

      if (newStage <= 3) {
        // Send reminder and advance stage
        const nextReminder = new Date();
        nextReminder.setDate(nextReminder.getDate() + REMINDER_DELAYS_DAYS[newStage]);

        await supabase
          .from('verification_settings')
          .update({
            reminder_stage: newStage,
            next_check: nextReminder.toISOString(),
            status: 'grace',
          })
          .eq('id', settings.id);

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: settings.user_id,
          title: `Verification Reminder #${newStage} sent to ${userEmail || 'user'}`,
          type: 'secure',
          icon: 'warning',
        });

        results.push({
          user_id: settings.user_id,
          action: `reminder_${newStage}`,
          email: userEmail,
        });

        // TODO: Send actual email via Resend/SendGrid
        // await sendReminderEmail(userEmail, newStage);
      } else {
        // Stage 3 exhausted → trigger vault release
        await supabase
          .from('verification_settings')
          .update({
            status: 'triggered',
            reminder_stage: 3,
          })
          .eq('id', settings.id);

        // Log activity
        await supabase.from('activity_log').insert({
          user_id: settings.user_id,
          title: 'Dead Man\'s Switch TRIGGERED — Vault release initiated',
          type: 'secure',
          icon: 'lock-open',
        });

        results.push({
          user_id: settings.user_id,
          action: 'vault_triggered',
          email: userEmail,
        });

        // TODO: Generate PDF and email to nominees
        // await triggerVaultRelease(settings.user_id);
      }
    }

    return new Response(
      JSON.stringify({
        checked: overdueUsers?.length ?? 0,
        actions: results,
        timestamp: now,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500 },
    );
  }
});
