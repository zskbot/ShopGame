# ShopGame staging: Neon + Auth.js

## Architecture
- Next.js 15 on Vercel Functions.
- Neon PostgreSQL.
- Auth.js v5 with the official `@auth/neon-adapter`.
- No Supabase project or Supabase credentials are required by this path.

## Staging boundary
This branch prepares source code only. It does not create a Neon project, Vercel project, OAuth application, paid resource or deployment. No existing database is reused. Vercel currently has no project linked to `zskbot/ShopGame`, so a real Preview deployment requires a dedicated project.

## Provisioning gate
Before provisioning, inspect the exact Neon plan, billing owner, region and expected cost. Use the Neon Free plan only if the console explicitly confirms $0/month and no paid add-ons. Do not accept a paid plan or attach a paid Vercel Marketplace integration without explicit approval.

Create a dedicated Neon database/project named `shopgame-staging`; do not connect to unrelated databases or production data.

## Apply schema
1. Set the pooled connection string as `DATABASE_URL` in Preview.
2. Keep the direct/unpooled connection string as `DATABASE_URL_UNPOOLED` for migrations only.
3. Review `db/migrations/0001_neon_authjs.sql`.
4. Apply it only to the dedicated staging database using the direct connection.
5. Verify Auth.js tables (`users`, `accounts`, `sessions`, `verification_token`) and shop tables.
6. Run `GET /api/health/ready`.

The migration is transactional. It does not seed products, create admin users or copy data from another database.

## Auth.js
Set secrets only in ignored `.env.local` or Vercel Preview environment variables:
- `AUTH_SECRET`: unique random secret.
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
- `DATABASE_URL`: Neon pooled connection string.

Register exact OAuth callbacks:
- `https://<PREVIEW_HOST>/api/auth/callback/github`
- `https://<PREVIEW_HOST>/api/auth/callback/google`
- Local: `http://localhost:3000/api/auth/callback/<provider>`

JWT sessions are used. With Neon configured, Auth.js persists users and linked OAuth accounts in Neon. New users default to `customer`; admin role changes must be controlled database operations by the owner.

## Security
- Never use `NEXT_PUBLIC_DATABASE_URL`, expose database credentials to client code, or commit secrets.
- Only server-side routes may access Neon.
- Checkout remains a browser-local demo. No payment, wallet debit or fulfillment is enabled.
- Never trust client-supplied price, total, role or payment status.
- The old `supabase/migrations` file is historical only and must not be applied to Neon.

## Verification checklist
- [ ] Dedicated Neon staging resource on an explicitly approved $0 plan.
- [ ] Schema applied only to that database and tables/constraints verified.
- [ ] GitHub and Google OAuth callbacks tested on Preview.
- [ ] New user role defaults to customer; admin access is denied by default.
- [ ] `/api/health/ready` returns 200 when connected and 503 when unconfigured/unavailable.
- [ ] Typecheck, ESLint and production build pass in GitHub Actions.
- [ ] Vercel Preview verified; production remains untouched.
