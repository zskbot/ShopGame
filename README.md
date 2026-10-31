# CineWave — Movie discovery platform

A Vietnamese, mobile-first movie discovery experience built with Next.js 15, React 19 and TypeScript.

## Current phase

Phase 1 replaces the ShopGame storefront with a cinematic movie-discovery homepage:
- Responsive cinema-inspired homepage and navigation.
- Search and genre filtering over clearly labeled demo catalog entries.
- Movie information preview modal and local favorite toggles.
- No video playback, paid content, scraping, or third-party stream embeds.

## Stack
- Next.js 15 App Router, React 19 and TypeScript
- Auth.js v5 authentication (existing routes retained)
- Neon PostgreSQL integration (existing schema retained)
- Vercel deployment and GitHub Actions CI

## Development
Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Quality checks
```bash
npm run typecheck
npm run lint
npm run build
```

## Roadmap
1. Homepage and brand transition (current).
2. Movie detail pages, metadata model and genre pages.
3. Legal content catalog integration and admin curation.
4. Licensed playback, subtitle selection and episode navigation.
5. Watch history, favorites sync and user profiles.

## Content and rights
The current catalog is illustrative only. Do not add copyrighted film files, scraped streams, unauthorized embeds, or claims of streaming availability. Playback must use content owned by the platform or licensed from the rights holder. Any external metadata provider must be used under its terms and attribution requirements.

## Existing account infrastructure
Auth.js, account routes, database migrations, health endpoints and staging documentation are retained during the first UI migration phase. Existing legacy commerce tables are not deleted or modified in this phase.
