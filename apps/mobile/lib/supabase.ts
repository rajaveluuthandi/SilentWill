import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient } from '@silentwill/api';

/**
 * Supabase client, or `null` when no backend is configured.
 *
 * Absent env is BENIGN — AuthContext seeds isDemo from this and the app runs on
 * data/mock.ts. This previously used `!` assertions, so a missing value reached
 * createClient as undefined and threw "supabaseUrl is required" at module scope,
 * which took down every screen importing this file (only the Verification tab,
 * which imports nothing from here, survived).
 *
 * Corrupt env stays FATAL: quietly serving mock data because a URL was typo'd
 * would hide a real misconfiguration behind believable numbers.
 */

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

type Client = ReturnType<typeof createSupabaseClient>;

function envError(detail: string): never {
  throw new Error(
    `[SilentWill] Supabase env is not usable: ${detail}\n` +
      'Fix apps/mobile/.env.local — values must be single-line and unquoted — ' +
      'then restart Metro with: npx expo start --dev-client --clear',
  );
}

const hasNoEnv = !supabaseUrl && !supabaseAnonKey;

function build(): Client | null {
  if (hasNoEnv) return null;

  // Half-configured is a mistake, not a mode.
  if (!supabaseUrl) envError('EXPO_PUBLIC_SUPABASE_URL is missing while the anon key is set.');
  if (!supabaseAnonKey) envError('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing while the URL is set.');

  if (!/^https?:\/\/[^\s"']+$/.test(supabaseUrl)) {
    envError(`EXPO_PUBLIC_SUPABASE_URL is malformed: ${JSON.stringify(supabaseUrl)}`);
  }

  if (/\s/.test(supabaseAnonKey)) {
    envError(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY contains whitespace/newlines — the JWT was ' +
        'line-wrapped. Put it on ONE line, no quotes.',
    );
  }

  return createSupabaseClient({ supabaseUrl, supabaseAnonKey, storage: AsyncStorage });
}

export const supabase = build();

/** False when running on mock data with no backend. */
export const isBackendConfigured = supabase !== null;
