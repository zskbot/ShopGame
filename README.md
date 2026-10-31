# GameHub — Game Shop MVP

A standalone Vietnamese game-commerce storefront for Liên Quân Mobile, Free Fire and PUBG Mobile.

## MVP scope

- Responsive storefront with game categories, product search and filters.
- Product cards, cart quantity controls and checkout preview.
- Payment method selection: bank QR transfer or internal wallet (demo UI only).
- Player/account delivery details are collected only as required for a selected product.
- Health endpoint at `/api/health`.
- GitHub Actions CI: TypeScript, ESLint and Next.js production build.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Custom responsive CSS

## Local development

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Important MVP limitations

This repository is a UI and workflow prototype. No real payment is processed, no wallet is debited, and no game top-up is delivered automatically. Configure a legitimate payment provider, order database, admin authorization and authorized game-supply integrations before accepting real orders.

Only list accounts, items and services that you are authorized to sell and that comply with each publisher's terms. Never ask customers to submit game passwords or one-time authentication codes.
