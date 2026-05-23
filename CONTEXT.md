# Project Context — Avisonews

## Identity
Project: Avisonews (AvisoNews App)
Owner: Tarvico Inc.
Status: Pre-launch
Platform: React Native (iOS / Android / Web) via Expo

## Stack
- Frontend: React Native 19 / TypeScript 5.9 / Expo 54 / Expo Router 6
- Backend: Optional REST API (`EXPO_PUBLIC_API_URL`); app runs fully in mock/offline mode when unset
- Database: AsyncStorage (local persistence via `SafeStorage` abstraction)
- Cache: None (local AsyncStorage used for article/category caching)
- Queue: None
- AI: Placeholder stubs (generateAITitle / generateTLDR); no Anthropic SDK wired yet
- Auth: Custom JWT — token + user stored in SafeStorage; mock mode active when no API URL is set
- Payments: None
- File storage: None
- Cloud: Rork.com (preview/tunnel hosting); iOS + Android builds via Expo
- Functions: None
- CI/CD: None

## Key Paths
```
/expo/app/                  ← Expo Router screens (file-based routing)
/expo/app/(tabs)/           ← Tab navigator screens (home, categories, search, settings)
/expo/app/article/[id].tsx  ← Article detail screen
/expo/app/auth/             ← Sign-in / sign-up screens
/expo/components/           ← Reusable UI components
/expo/providers/            ← React context providers (Auth, Bookmarks, News, Preferences, Theme)
/expo/services/             ← Business logic / API calls
/expo/hooks/                ← Custom React hooks
/expo/constants/Colors.ts   ← Design tokens (light + dark theme)
/expo/types/news.ts         ← Core TypeScript types (Article, Category, …)
/expo/locales/              ← i18n translation files (en, fr, es)
/expo/mocks/articles.ts     ← Mock article data for dev / offline fallback
/expo/__tests__/            ← Jest unit tests
```

## News Sources (all free, no API keys required)
- **Hacker News** — `hacker-news.firebaseio.com/v0` (tech)
- **Dev.to** — `dev.to/api` (developer content)
- **Reddit JSON feeds** — public subreddit hot/new feeds (world, business, science, sports, entertainment)

## Critical Conventions
- **Storage**: Always use `SafeStorage` (`/expo/services/safeStorage.ts`) — never import `@react-native-async-storage/async-storage` directly; `SafeStorage` handles the web/native fallback.
- **Design tokens**: Use `Colors` from `@/constants/Colors` and the active theme object — no hardcoded hex values anywhere.
- **Theme**: Light/dark mode via `ThemeProvider`; consume via the theme context hook.
- **Routing**: Expo Router file-based routing — new screens go in `expo/app/`, follow the existing group layout conventions.
- **State / data fetching**: TanStack Query (`@tanstack/react-query`) for server-side state; local state via React context providers.
- **i18n**: `i18n-js` with locale files in `/expo/locales/`; add new copy keys to **all** locale files (`en`, `fr`, `es`).
- **Mock mode**: The entire app must work without `EXPO_PUBLIC_API_URL` set (mock data + local storage). Never break mock mode.
- **Auth**: JWT token and user object are persisted in `SafeStorage`; `AuthProvider` hydrates on launch.

## Environment Variables (names only — never commit values)
```
EXPO_PUBLIC_API_URL              # Base URL for backend REST API; empty = mock mode
EXPO_PUBLIC_ENABLE_ANALYTICS     # true | false
EXPO_PUBLIC_ENABLE_NEWSLETTER    # true | false
EXPO_PUBLIC_USE_REAL_NEWS_APIS   # true | false — toggle live news aggregation
EXPO_PUBLIC_PROJECT_ID           # Expo push-notification project ID
EXPO_PUBLIC_APP_NAME             # Display name
EXPO_PUBLIC_APP_VERSION          # Semver string
```

## Do NOT
- Import `AsyncStorage` directly — always go through `SafeStorage`
- Hardcode hex/rgb colors — use `Colors` tokens and the theme context
- Break mock mode (the app must run without a backend URL)
- Add cloud-provider-specific SDKs without approval (keep infra swappable)
- Skip adding new i18n keys to all locale files

## Known Deferred Items
- Wire up real Anthropic SDK for AI title generation and TLDR summarization (stubs exist in `newsAggregator.ts`)
- Content extraction for full article body (currently links out to source URL)
- Backend / database for persistent user accounts, bookmarks, and newsletter subscriptions
- Push notification backend integration (`expo/services/pushNotifications.ts` is scaffolded)
- Multi-tenancy / org_id if SaaS pivot is needed

## Last Updated
2026-05-23 — Initial accurate CONTEXT.md based on codebase scan
