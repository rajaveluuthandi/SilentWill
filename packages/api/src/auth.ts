import type { SupabaseClient } from '@supabase/supabase-js';

export async function signUpWithEmail(
  client: SupabaseClient,
  email: string,
  password: string,
) {
  return client.auth.signUp({ email, password });
}

export async function signInWithEmail(
  client: SupabaseClient,
  email: string,
  password: string,
) {
  return client.auth.signInWithPassword({ email, password });
}

export async function signOut(client: SupabaseClient) {
  return client.auth.signOut();
}
