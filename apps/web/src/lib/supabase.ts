import { createSupabaseClient } from '@silentwill/api';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

function envError(detail: string): never {
  throw new Error(
    `[SilentWill] Supabase env is not usable: ${detail}\n` +
      'Fix apps/web/.env.local (template: apps/web/.env.example) — values must be ' +
      'single-line and unquoted — then: rm -rf apps/web/.next && npm run dev:web',
  );
}

if (!supabaseUrl) envError('NEXT_PUBLIC_SUPABASE_URL is missing or empty.');
if (!supabaseAnonKey) envError('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty.');

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

export const supabase = createSupabaseClient({
  supabaseUrl,
  supabaseAnonKey,
});
