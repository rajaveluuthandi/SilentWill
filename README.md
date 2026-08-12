# SilentWill

A secure digital inheritance vault. Users record their assets and liabilities in an
encrypted vault; a "dead man's switch" periodically asks them to confirm they're
alive, and if they stop responding through an escalating reminder chain, the vault
compiles a full asset report and emails it to their designated nominees.

See [CLAUDE.md](./CLAUDE.md) for product vision, asset categories, and roadmap.

## Repo layout

| Path | What |
|---|---|
| `apps/web` | Next.js 14 App Router — **the app this quickstart runs** |
| `apps/mobile` | Expo 52 / React Native — not currently runnable, see [Deferred](#deferred-mobile) |
| `packages/api` | Supabase client, auth, services, AES-256-GCM field encryption |
| `packages/ui`, `packages/utils` | Shared components and helpers |
| `supabase/` | SQL migrations + Deno Edge Functions |
| `design/` | Screen mockups (HTML + PNG) |

`packages/*` are **source-first** — their `main`/`types` point at `src/index.ts`,
and the consuming app transpiles them (`transpilePackages` in
`apps/web/next.config.js`). **There is no build step before running an app.**

## Web quickstart (localhost:3000)

### Prerequisites

- **Node 18.17+** — 20 LTS recommended
- **npm 10+**
- A **Supabase project** — see [Backend setup](#backend-setup) below

### 1. Install

```bash
npm install          # from the repo root — installs all workspaces
```

### 2. Configure the environment

> **Next.js loads env files only from `apps/web/`.** A file at the monorepo root
> will *not* configure the web app.

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then fill in both values in `apps/web/.env.local` from Supabase Dashboard →
Project Settings → API:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

> **Both values must be on a single line, with no surrounding quotes.**
> Do not run `vercel env pull` into this file — it wraps the ~208-char anon JWT
> across lines with a literal `\n`, dotenv expands those into real newlines, and
> every Supabase call then fails with `401 Invalid API key`. See
> [Troubleshooting](#troubleshooting).

Sanity-check before starting the server:

```bash
node -e "const {loadEnvConfig}=require('@next/env');loadEnvConfig('apps/web');
const k=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'';
console.log('len',k.length,'| whitespace',/\s/.test(k),'| segments',k.split('.').length)"
# expect: len 208 | whitespace false | segments 3
```

`apps/web/src/lib/supabase.ts` also validates this at startup and will fail with an
actionable `[SilentWill] Supabase env is not usable: …` message rather than a
cryptic crash.

### 3. Run

```bash
npm run dev:web      # http://localhost:3000
```

Use `dev:web`, **not** bare `npm run dev` — the latter also starts Expo/Metro, and
`apps/mobile` is not currently configured (see [Deferred](#deferred-mobile)).

### 4. Sign in — three ways

**Try Demo Mode** — no backend needed. Serves the mock data in
`apps/web/src/data/mock.ts` and makes **zero** network calls, so it works even
with no Supabase project at all. Fastest way to see the whole UI.

Because Demo Mode never touches Supabase, *it passing proves nothing about your
env or backend* — use one of the paths below to verify those.

**Email + password** — Sign Up, then Sign In. If the project has email
confirmation enabled, sign-up returns a user but **no session** and you stay on the
landing page; either click the emailed confirmation link, or turn it off at
Dashboard → Authentication → Providers → Email → "Confirm email".

**Google OAuth** — needs a one-time change per Supabase project:

1. Dashboard → Authentication → URL Configuration
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: add `http://localhost:3000/auth/callback`
4. Dashboard → Authentication → Providers → Google: enable it and set the client
   ID / secret

The flow is PKCE: `signInWithGoogle` (`apps/web/src/contexts/AuthContext.tsx`)
sends `redirectTo = window.location.origin + '/auth/callback'`, and
`apps/web/src/app/auth/callback/page.tsx` exchanges the `?code=` for a session.

## Backend setup

Pick one. Option A is faster to start; Option B is fully offline and doesn't put
development data in a shared database.

### Option A — hosted Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Apply the schema. The Supabase CLI needs no Docker for this:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push        # applies everything in supabase/migrations/
   ```
   Or paste each file in `supabase/migrations/` into Dashboard → SQL Editor, in
   order: `001_initial_schema.sql`, `002_verification_settings.sql`,
   `003_cron_verification.sql`.
3. Put the Project URL and anon key in `apps/web/.env.local` (step 2 above).

Verify the project actually accepts the key before opening a browser — this is the
one check that distinguishes "dev server booted" from "Supabase authenticates":

```bash
U=$(grep '^NEXT_PUBLIC_SUPABASE_URL='      apps/web/.env.local | cut -d= -f2-)
K=$(grep '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' apps/web/.env.local | cut -d= -f2-)

curl -s -w '\nHTTP %{http_code}\n' "$U/auth/v1/health" -H "apikey: $K"
# PASS: 200 {"name":"GoTrue",...}      FAIL: 401 -> key is corrupt

curl -s -w '\nHTTP %{http_code}\n' "$U/rest/v1/assets?select=id&limit=1" \
  -H "apikey: $K" -H "Authorization: Bearer $K"
# PASS: 200 with body []   <- RLS correctly returns nothing to an anon caller
# FAIL: 404 {"code":"PGRST205"} -> migrations not applied
```

Repeat the second call for `nominees`, `activity_log`, and
`verification_settings`. Note free-tier projects pause after ~7 days idle; a
**deleted** project gives `NXDOMAIN` on its hostname, while a *paused* one still
resolves.

### Option B — local Supabase stack

Fully offline. Requires **Docker Desktop** (Edge Functions additionally need
Deno). `supabase/config.toml` does not exist yet, so start with `init`:

```bash
supabase init        # creates supabase/config.toml; leaves migrations/ and functions/ alone
supabase start       # boots the Docker stack and applies supabase/migrations/
supabase status      # print the API URL, anon key, and service_role key
```

Then set these two values in `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from `supabase status`>
```

Restart with `rm -rf apps/web/.next && npm run dev:web`.

Useful extras:

```bash
supabase db reset            # wipe the local DB and replay all migrations
supabase functions serve     # run Edge Functions locally (needs Deno)
```

Local-mode caveats:

- Email + password and Demo Mode work with no extra setup. Google OAuth needs
  `[auth] additional_redirect_urls` in `supabase/config.toml` plus provider
  credentials.
- Confirmation emails are captured by Inbucket at http://127.0.0.1:54324 instead
  of being delivered.
- `crypto.subtle` (used by `packages/api/src/crypto.ts`) works on both `localhost`
  and `127.0.0.1` — both are secure contexts.

## Troubleshooting

**`401` / `{"message":"Invalid API key"}` on every request.** The anon key has
whitespace in it. Run the sanity-check in step 2; if `whitespace true`, put the JWT
on one unquoted line, then:

```bash
rm -rf apps/web/.next && npm run dev:web
```

The `.next` wipe is required, not optional: `NEXT_PUBLIC_*` values are inlined into
client bundles and persisted in the webpack cache, so a corrected `.env.local`
alone can still serve the old key.

**`[SilentWill] Supabase env is not usable: …`** Read the message — it names the
offending variable and the fix.

**`{"code":"PGRST205"}` or 404 from `/rest/v1/<table>`.** The table doesn't exist;
the migrations in `supabase/migrations/` haven't been applied to that project.

**Hostname gives `NXDOMAIN`.** The Supabase project was deleted, or the project ref
is wrong. Paused projects still resolve — this doesn't.

**Google returns "requested path is invalid" or `redirect_uri_mismatch`.**
`http://localhost:3000/auth/callback` is missing from the dashboard's Redirect
URLs.

**Google returns "both auth code and code verifier should be non-empty".** The
PKCE verifier lives in `localStorage`, so you must finish the flow in the same
browser profile that started it. Clear `sb-<ref>-auth-token-code-verifier` and
retry.

**Port 3000 already in use.** `lsof -ti:3000 | xargs kill`

**The landing page is just a spinner in `curl` output.** Expected — `isLoading`
starts `true` and only flips in a `useEffect`, so the buttons render after client
hydration. Use a real browser.

## Deferred: mobile (`apps/mobile`)

Not runnable today. Three known blockers:

1. **No `apps/mobile/.env`.** Expo resolves dotenv against the project root with no
   monorepo walk, so it never reads the repo-root `.env`; `EXPO_PUBLIC_*` comes
   back `undefined` and `createClient` throws at import. Needs an
   `apps/mobile/.env` with the `EXPO_PUBLIC_*` pair.
2. **Expo SDK version skew.** `expo@52` and `expo-modules-core@2.2.3` are installed
   alongside SDK-55 native modules (`expo-sqlite@55`, `expo-crypto@55`,
   `expo-auth-session@55`, `expo-web-browser@55`, `async-storage@3`). Plan: pin
   them back to the SDK 52 versions in `expo/bundledNativeModules.json` so plain
   Expo Go works.
3. **No `crypto.subtle` under Hermes.** Nothing polyfills WebCrypto, so signed-in
   screens hang in `useVaultKey`. Plan: a pure-JS AES-GCM fallback in
   `packages/api/src/crypto.ts` (same `iv:ciphertext` base64 format), plus a
   `.catch()` at the call site.

Note Node 23.x is non-LTS and React Native 0.76 / Metro are only tested on even LTS
lines — try `nvm use 20` first for odd Metro failures.

## Commands

```bash
npm run dev:web      # web only, :3000  (use this)
npm run dev:mobile   # Expo/Metro only, :8081  (see Deferred)
npm run dev          # both
npm run build        # turbo build
npm run lint
npm run format       # prettier
```
