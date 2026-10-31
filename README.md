# GameHub — Game Shop MVP

A standalone Vietnamese game-commerce storefront for Liên Quân Mobile, Free Fire and PUBG Mobile.

## Stack
- Next.js 15 App Router, React 19 and TypeScript
- Neon PostgreSQL using the Neon serverless driver
- Auth.js v5 with the official Neon adapter
- Vercel Functions for server-side application routes

## Current scope
- Responsive storefront, categories, search and cart.
- Checkout preview and browser-local demo order history.
- Auth.js sign-in routes for GitHub and Google (OAuth credentials are environment-only).
- Neon schema for users, OAuth accounts, sessions, products, orders, payment records and wallet ledger.
- `/api/health` process health and `/api/health/ready` database readiness.
- GitHub Actions CI: TypeScript, ESLint and Next.js production build.

## Local development
Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The storefront can be viewed without database credentials. Auth.js persistence and readiness checks require a Neon `DATABASE_URL`. Never put database credentials or OAuth secrets in source control or a `NEXT_PUBLIC_*` variable.

## Environment variables
See [`.env.example`](.env.example) and [the Neon/Auth.js staging runbook](docs/NEON-AUTHJS-STAGING.md).

## Quality checks
```bash
npm run typecheck
npm run lint
npm run build
```

## Database migration
The active schema for new staging environments is `db/migrations/0001_neon_authjs.sql`. Apply it only to a dedicated Neon staging database after provisioning and confirming plan/cost. Use the direct connection for migrations and the pooled connection for application traffic.

The previous `supabase/migrations` file is retained as historical reference only. It is not part of the Neon path and must not be applied to Neon.

## MVP limitations
Checkout still saves demo orders in the browser; it does not create server-side orders, process payments, debit wallets or deliver game top-ups. Do not accept real orders until server-side order validation, payment verification, admin authorization and authorized fulfillment integrations are implemented and tested.

Only list accounts, items and services that you are authorized to sell and that comply with each publisher's terms. Never ask customers for game passwords or one-time authentication codes.
