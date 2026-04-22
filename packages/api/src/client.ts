import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export type { SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseClientOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
  storage?: any;
}

export function createSupabaseClient(
  options: SupabaseClientOptions,
): SupabaseClient<Database> {
  const { supabaseUrl, supabaseAnonKey, storage } = options;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      ...(storage ? { storage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}
