# ShopGame Supabase Staging Runbook

This runbook prepares a dedicated, non-production Supabase environment for ShopGame. It does not create a project, apply migrations, connect the application, or enable real payments.

## Safety boundaries

- Use a dedicated project named `shopgame-staging`; never reuse VelclawHost, Identity Auth, or another unrelated project.
- Do not connect production data or import customer data.
- Keep all credentials in the hosting provider's encrypted environment settings or a local untracked `.env.local`.
- Never commit `SUPABASE_SERVICE_ROLE_KEY`, database passwords, access tokens, or real API keys.
- The browser may receive only the project URL and anon/publishable key. Service-role credentials must remain server-side.
- Do not enable real payment capture, wallet crediting, or automatic order fulfillment during staging.

## Required environment variables

Configure these only after the dedicated staging project has been approved and created:

| Variable | Runtime | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Staging project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon/publishable key; RLS must protect every exposed table |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Reserved for narrowly scoped trusted server operations; do not add a client-side usage |

Do not put real values in this document or in Git.

## Migration

The initial schema is maintained at:

`supabase/migrations/20261031000100_initial_shop_schema.sql`

After project approval and creation:

1. Confirm the Supabase project reference and region belong to the new staging project.
2. Review the migration and the current Supabase CLI documentation.
3. Link the CLI to the staging project using an operator-held access token; do not paste tokens into chat or commit them.
4. Apply the migration to staging only.
5. Inspect the resulting tables, grants, policies, and functions in the Supabase dashboard.
6. Run the database security advisors and resolve exposed-table or RLS findings before connecting the app.

Example operator workflow (run only after verifying the project reference):

```sh
supabase login
supabase link --project-ref <SHOPGAME_STAGING_PROJECT_REF>
supabase db push
```

Never run these commands against an existing unrelated project.

## Verification checklist

- [ ] All tables exposed through the Data API have RLS enabled.
- [ ] Anonymous users can read only active public catalog data.
- [ ] A signed-in customer can read only their own orders and related rows.
- [ ] A customer cannot mark an order paid or mutate payment transactions.
- [ ] A customer cannot write wallet balances or wallet ledger entries.
- [ ] Admin operations require an explicit server-side authorization check.
- [ ] No service-role key is present in browser bundles, client components, logs, or Git history.
- [ ] Test with at least two distinct customer identities to verify cross-account isolation.
- [ ] No real payment or fulfillment provider is enabled in staging.

## Application integration sequence

1. Add a server-only Supabase client and a separate browser client only if the chosen auth flow requires it.
2. Move catalog reads behind a typed repository/API boundary; retain a safe demo fallback until staging is verified.
3. Create orders server-side from product IDs and quantities. Re-read authoritative prices from the database; never trust client-supplied totals.
4. Keep payment status server-controlled. A bank transfer is pending until verified through a trusted reconciliation process.
5. Add customer order history and a protected admin order queue.
6. Add integration tests for ownership, price tampering, status transitions, and wallet mutation denial.
7. Open a PR and verify typecheck, lint, build, and staging tests before considering merge.

## Current status

The migration is committed in the repository, but no dedicated ShopGame Supabase project has been approved or provisioned. The application still uses browser local storage for its MVP order flow. Real payments and production deployment remain disabled.
