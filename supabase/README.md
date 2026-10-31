# Supabase database foundation

This folder contains the first PostgreSQL schema for GameHub Shop.

## Scope

- Product catalog for Liên Quân, Free Fire and PUBG Mobile.
- Orders and immutable product snapshots for order lines.
- Payment transaction records (not a payment gateway).
- Wallet account and ledger tables (not a live wallet).
- Admin allow-list and row-level security policies.

## Apply in a Supabase project

1. Create a Supabase project in a free/staging environment.
2. Open **SQL Editor** and run the migration in `migrations/20261031000100_initial_shop_schema.sql`, or apply it with the Supabase CLI.
3. Create the first admin user through Supabase Auth.
4. Add that user's UUID to `public.shop_admins` using the SQL Editor while signed in as the project owner.
5. Keep the service-role key on the server only. Never put it in a `NEXT_PUBLIC_*` variable or commit it to Git.

## Security model

- Anonymous visitors can only read active products.
- Authenticated customers can read only their own orders, order lines, payment records and wallet records.
- Only allow-listed admins can manage catalog and operational records. The admin-check helper lives in the non-exposed `private` schema.
- Explicit Data API grants are included because current Supabase projects no longer automatically expose newly created public tables; RLS remains the row-level boundary.
- Browser clients cannot insert orders, confirm payments, credit/debit wallets or write wallet ledger entries.
- Future order creation and payment processing must use server-side authorization, authoritative product prices, provider signature verification and idempotency.

## Not enabled yet

The current storefront still uses local browser storage. This migration does not connect the app to Supabase, process payments, create wallet balances, or deliver game products. Do not accept real orders until server routes, authentication, provider integration and operational testing are completed.
