import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Asset, AssetCategory } from '../types';

type Client = SupabaseClient<Database>;

export async function getAssets(client: Client) {
  const { data, error } = await client
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Asset[] | null, error };
}

export async function getAssetsByCategory(client: Client, category: AssetCategory) {
  const { data, error } = await client
    .from('assets')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  return { data: data as Asset[] | null, error };
}

export async function getAssetById(client: Client, id: string) {
  const { data, error } = await client
    .from('assets')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Asset | null, error };
}

export async function createAsset(
  client: Client,
  asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>,
) {
  const { data, error } = await client
    .from('assets')
    .insert(asset)
    .select()
    .single();
  return { data: data as Asset | null, error };
}

export async function updateAsset(
  client: Client,
  id: string,
  updates: Partial<Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
) {
  const { data, error } = await client
    .from('assets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Asset | null, error };
}

export async function deleteAsset(client: Client, id: string) {
  const { error } = await client.from('assets').delete().eq('id', id);
  return { error };
}
