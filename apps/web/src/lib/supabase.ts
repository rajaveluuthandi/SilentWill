import { createSupabaseClient } from '@silentwill/api';

// Inferred rather than the bare SupabaseClient export, so the Database generic
// that createSupabaseClient applies is preserved.
type Client = ReturnType<typeof createSupabaseClient>;

/**
 * Supabase client, or `null` when no backend is configured.
 *
 * Absent env is BENIGN: the app falls back to mock data (AuthContext seeds
 * isDemo from this), so a clone with no .env.local runs instead of crashing.
 *
 * Corrupt env stays FATAL. Silently degrading a typo'd URL or a line-wrapped JWT
 * to "demo mode" would hide a real misconfiguration behind plausible-looking
 * fake data — far worse than a loud failure. The distinction throughout is
 * "nothing configured" vs "configured wrong".
 */

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

function envError(detail: string): never {
  throw new Error(
    `[SilentWill] Supabase env is not usable: ${detail}\n` +
      'Fix apps/web/.env.local (template: apps/web/.env.example) — values must be ' +
      'single-line and unquoted — then: rm -rf apps/web/.next && npm run dev:web',
  );
}

// Neither value set at all → intentionally unplugged, run on mocks.
const hasNoEnv = !supabaseUrl && !supabaseAnonKey;

function build(): Client | null {
  if (hasNoEnv) return null;

  // Half-configured is a mistake, not a mode — say so.
  if (!supabaseUrl) envError('NEXT_PUBLIC_SUPABASE_URL is missing while the anon key is set.');
  if (!supabaseAnonKey) envError('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing while the URL is set.');

  // http is allowed so the local Supabase stack (http://127.0.0.1:54321) works.
  if (!/^https?:\/\/[^\s"']+$/.test(supabaseUrl)) {
    envError(`NEXT_PUBLIC_SUPABASE_URL is malformed: ${JSON.stringify(supabaseUrl)}`);
  }

  // The trim above handles surrounding whitespace; this catches whitespace *inside*
  // the JWT, which is what `vercel env pull` produces and what trim cannot fix.
  if (/\s/.test(supabaseAnonKey)) {
    envError(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY contains whitespace/newlines — the JWT was ' +
        'line-wrapped (this is what `vercel env pull` produces). Put it on ONE line, no quotes.',
    );
  }

  return createSupabaseClient({ supabaseUrl, supabaseAnonKey });
}

export const supabase = build();

/** False when running on mock data with no backend. */
export const isBackendConfigured = supabase !== null;
