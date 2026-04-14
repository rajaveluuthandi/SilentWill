import type { SupabaseClient } from '@supabase/supabase-js';

export interface VerificationSettings {
  id: string;
  user_id: string;
  interval_months: number;
  last_verified: string;
  next_check: string;
  reminder_stage: number;
  status: 'active' | 'grace' | 'triggered';
  created_at: string;
  updated_at: string;
}

export async function getVerificationSettings(client: SupabaseClient) {
  const { data, error } = await client
    .from('verification_settings')
    .select('*')
    .single();
  return { data: data as VerificationSettings | null, error };
}

export async function createVerificationSettings(
  client: SupabaseClient,
  userId: string,
  intervalMonths: number = 6,
) {
  const nextCheck = new Date();
  nextCheck.setMonth(nextCheck.getMonth() + intervalMonths);

  const { data, error } = await client
    .from('verification_settings')
    .insert({
      user_id: userId,
      interval_months: intervalMonths,
      last_verified: new Date().toISOString(),
      next_check: nextCheck.toISOString(),
      reminder_stage: 0,
      status: 'active',
    })
    .select()
    .single();
  return { data: data as VerificationSettings | null, error };
}

export async function verifyHeartbeat(client: SupabaseClient, settingsId: string, intervalMonths: number) {
  const nextCheck = new Date();
  nextCheck.setMonth(nextCheck.getMonth() + intervalMonths);

  const { data, error } = await client
    .from('verification_settings')
    .update({
      last_verified: new Date().toISOString(),
      next_check: nextCheck.toISOString(),
      reminder_stage: 0,
      status: 'active',
    })
    .eq('id', settingsId)
    .select()
    .single();
  return { data: data as VerificationSettings | null, error };
}

export async function updateVerificationInterval(
  client: SupabaseClient,
  settingsId: string,
  intervalMonths: number,
) {
  const nextCheck = new Date();
  nextCheck.setMonth(nextCheck.getMonth() + intervalMonths);

  const { data, error } = await client
    .from('verification_settings')
    .update({
      interval_months: intervalMonths,
      next_check: nextCheck.toISOString(),
    })
    .eq('id', settingsId)
    .select()
    .single();
  return { data: data as VerificationSettings | null, error };
}
