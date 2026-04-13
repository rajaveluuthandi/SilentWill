import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Nominee } from '../types';

type Client = SupabaseClient<Database>;

export async function getNominees(client: Client) {
  const { data, error } = await client
    .from('nominees')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Nominee[] | null, error };
}

export async function createNominee(
  client: Client,
  nominee: Omit<Nominee, 'id' | 'created_at' | 'updated_at'>,
) {
  const { data, error } = await client
    .from('nominees')
    .insert(nominee)
    .select()
    .single();
  return { data: data as Nominee | null, error };
}

export async function updateNominee(
  client: Client,
  id: string,
  updates: Partial<Omit<Nominee, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
) {
  const { data, error } = await client
    .from('nominees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Nominee | null, error };
}

export async function deleteNominee(client: Client, id: string) {
  const { error } = await client.from('nominees').delete().eq('id', id);
  return { error };
}
