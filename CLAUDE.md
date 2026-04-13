# SilentWill

## Project Vision

SilentWill is a **secure digital inheritance vault** that helps individuals organize and protect all their financial and physical asset information in a structured, encrypted format. It ensures that in the event of the user's incapacity or death, designated dependents automatically gain access to this information through a "dead man's switch" verification system.

**SilentWill is NOT** a trading app, portfolio tracker, or legal will replacement.
**SilentWill IS** a Digital Inheritance Information Vault with Automatic Release Logic.

## Mission

Solve the real problem faced by Indian families: unclaimed PF accounts, forgotten insurance policies, inactive bank accounts, and unknown land records — all due to lack of structured asset tracking and emotional hesitation to disclose finances.

## Key Features

- **Asset Vault**: Record all assets and liabilities (bank accounts, insurance, PF, investments, land, gold, cash, liabilities) in encrypted storage
- **Visibility Controls (V1)**: Single mode — only the authenticated user can access their data. No dependent app access in V1. Sharing modes (Full/Partial/Nil Transparency) are planned for V2+
- **Dead Man's Switch (V1)**: User sets a verification interval (3/6/12 months). Escalating reminders (app notification → SMS/email → emergency warning). If user fails to verify after all attempts, the app compiles all asset information into a single PDF/MD file and emails it to the designated dependent(s). No in-app access for dependents in V1 — delivery is via email only
- **AR Legacy Visualization (V2)**: Transforms assets into emotional 3D/AR representations (land plots, gold stacks, wealth towers, safety shields) — planned for V2, not initial development

## Tech Stack & Architecture

This is a **Turborepo monorepo** with the following structure:

```
SilentWill/
  apps/
    mobile/        - React Native (Expo) — iOS & Android app
    web/           - Web app
  packages/
    api/           - Shared API layer
    ui/            - Shared UI components
    utils/         - Shared utilities
  design/
    mobile/        - Mobile screen designs (from Google Stitch AI)
    web/           - Web screen designs (from Google Stitch AI)
```

- **Frontend**: React Native (Expo) for mobile, web app for browser
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **Backend**: Supabase (PostgreSQL) — auth, database, storage, serverless Edge Functions, real-time, Row Level Security (RLS)
- **Local Database**: expo-sqlite — offline access, local caching, fast reads
- **Monorepo**: Turborepo with npm workspaces
- **Package Manager**: npm

### Data Flow

```
User enters asset data
  → App encrypts client-side with user's key
  → Encrypted data saved to expo-sqlite (local cache)
  → Synced to Supabase (stores ciphertext only, zero plain-text)
  → On read: online → fetch from Supabase → decrypt | offline → read from expo-sqlite
  → On logout: clear local expo-sqlite
```

### Supabase provides:
- **Auth**: Email/password, phone OTP, Google/Apple sign-in, biometric via token refresh
- **Database**: PostgreSQL with RLS — enforces access rules at DB level, not app code
- **Storage**: Private buckets for document uploads (land docs, policy PDFs)
- **Edge Functions**: Serverless functions for dead man's switch verification cron, escalating reminders, PDF/MD generation, and email delivery to dependents
- **Real-time**: Live subscriptions for data change notifications

### expo-sqlite provides:
- **Offline-first**: Users can view/add assets without internet
- **Speed**: No network round-trip for local reads
- **Draft entries**: Add assets offline, sync when connected
- **Session cache**: Store decrypted data locally, cleared on logout

## Development Phases

### Phase 1: POC / Demo (Current)
Goal: Build a demo to showcase to CTO and VC (venture capital).

**Entry point — Auth/Landing screen with 3 options:**
- **Sign In** → Shows "Coming soon" toast (placeholder, not implemented)
- **Sign Up** → Shows "Coming soon" toast (placeholder, not implemented)
- **Try Demo Mode** → Loads the full app with hardcoded mock data

**Demo Mode:**
- Pre-populated mock assets (fake bank accounts, insurance, PF, gold, land, etc.)
- Full navigation through all screens — feels like a real app
- Nothing persisted, no real backend calls
- Dark/Light mode toggle for visual polish
- Both mobile and web apps working

**Screen build order (Demo Mode):**
1. Auth/Landing screen (Sign In, Sign Up, Try Demo Mode)
2. Dashboard (total assets overview with mock data)
3. Asset Management (list/browse assets by category)
4. Add Asset (form to add new asset)
5. Asset Details (view individual asset info)
6. Verification (dead man's switch concept UI)
7. Sharing/Nominees (configure dependents)
8. Recent Activity (activity log)

**NOT in POC — deferred to Phase 2:**
- Supabase backend / real auth
- E2E encryption / security
- expo-sqlite / offline sync
- Biometric authentication
- i18n, RTL, accessibility
- Dead man's switch actual logic
- PDF generation / email delivery

### Phase 2: Production
After POC approval, implement real backend, auth, encryption, and all production features.

- **Screen-by-screen implementation** — not all at once
- Reference designs are in `design/mobile/` and `design/web/` directories
- AR features are deferred to V2
- Security (E2E encryption, biometric auth, secure storage) is a core requirement

## UI Requirements (Mandatory for Every Screen — Phase 2)

These apply to production screens (Phase 2), not POC. During POC, only Dark/Light mode is implemented for visual polish.

- **Dark/Light Mode**: All screens must support both appearances. Use semantic/adaptive colors, never hardcode light-only or dark-only values. Test in both modes.
- **Localization (i18n)**: No hardcoded user-facing strings. All text must go through the localization system. Use translation keys for every label, button, message, and placeholder.
- **Accessibility (a11y)**: All interactive elements must have accessibility labels, roles, and hints. Ensure proper focus order, sufficient color contrast, and screen reader compatibility. Support Dynamic Type / font scaling.
- **RTL Support**: All layouts must work correctly in right-to-left languages (Arabic, Hebrew, Urdu, etc.). Use logical properties (start/end) instead of physical (left/right). Mirror icons and navigation where appropriate.

## Asset Categories (V1)

1. Cash
2. Bank Accounts
3. Insurance
4. Government Funds (EPF, VPF, PPF, NPS, Pension)
5. Stock Market (Demat)
6. Mutual Funds
7. Land Documents
8. Gold & Jewellery
9. Liabilities (Loans, Credit Cards, EMIs)

## Commands

```bash
# Development
npm run dev              # Run all apps
npm run dev:web          # Run web app only
npm run dev:mobile       # Run mobile app only

# Mobile specific
cd apps/mobile
npx expo start           # Start Expo dev server
npx expo start --ios     # Start on iOS simulator
npx expo start --android # Start on Android emulator

# Build & Lint
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run format           # Format code with Prettier
```

## Android Setup

Requires `ANDROID_HOME` environment variable:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

Available emulator: `Medium_Phone_API_36` (Android 36)

## Monetization

- **Free**: 5 asset entries, basic verification, no AR
- **Premium (subscription)**: Unlimited assets, AR mode, custom verification, multiple dependents, document upload
- **Family Plan**: Lifetime option

## Target Market

India — high trust product in a low-competition space with strong subscription potential.
