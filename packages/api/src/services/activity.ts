import type { SupabaseClient } from '@supabase/supabase-js';
import type { ActivityLog } from '../types';

type Client = SupabaseClient<any>;

export async function getActivity(client: Client) {
  const { data, error } = await client
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as ActivityLog[] | null, error };
}

export async function logActivity(
  client: Client,
  entry: Omit<ActivityLog, 'id' | 'created_at'>,
) {
  const { data, error } = await client
    .from('activity_log')
    .insert(entry)
    .select()
    .single();
  return { data: data as ActivityLog | null, error };
}
