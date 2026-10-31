-- GameHub Shop database foundation (PostgreSQL / Supabase)
-- Apply through the Supabase SQL editor or Supabase CLI migrations.
-- No customer-facing payment or wallet mutation endpoint is enabled by this migration.

create extension if not exists pgcrypto;

create table if not exists public.shop_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_shop_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shop_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_shop_admin() from public;
grant execute on function public.is_shop_admin() to anon, authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  game text not null check (game in ('lien_quan', 'free_fire', 'pubg_mobile')),
  category text not null check (category in ('top_up', 'account', 'item', 'service')),
  name text not null,
  description text not null default '',
  price_vnd bigint not null check (price_vnd >= 0),
  compare_at_price_vnd bigint check (compare_at_price_vnd is null or compare_at_price_vnd >= price_vnd),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  delivery_mode text not null default 'manual' check (delivery_mode in ('manual', 'authorized_provider')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_public_catalog_idx
  on public.products (game, category, created_at desc)
  where status = 'active';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'processing', 'fulfilled', 'cancelled', 'refunded')),
  payment_method text not null check (payment_method in ('bank_transfer', 'wallet')),
  currency text not null default 'VND' check (currency = 'VND'),
  subtotal_vnd bigint not null check (subtotal_vnd >= 0),
  discount_vnd bigint not null default 0 check (discount_vnd >= 0),
  total_vnd bigint not null check (total_vnd >= 0),
  fulfillment_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_check check (total_vnd = subtotal_vnd - discount_vnd),
  constraint orders_customer_check check (user_id is not null or customer_email is not null)
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);
create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_sku text not null,
  product_name text not null,
  game text not null check (game in ('lien_quan', 'free_fire', 'pubg_mobile')),
  quantity integer not null check (quantity between 1 and 99),
  unit_price_vnd bigint not null check (unit_price_vnd >= 0),
  line_total_vnd bigint generated always as (quantity::bigint * unit_price_vnd) stored,
  delivery_details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null check (provider in ('manual_bank_transfer', 'wallet', 'other')),
  provider_reference text unique,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  amount_vnd bigint not null check (amount_vnd > 0),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_transactions_order_idx
  on public.payment_transactions (order_id, created_at desc);

create table if not exists public.wallet_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_vnd bigint not null default 0 check (balance_vnd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('credit', 'debit', 'refund', 'adjustment')),
  amount_vnd bigint not null check (amount_vnd > 0),
  balance_after_vnd bigint not null check (balance_after_vnd >= 0),
  reference text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists wallet_ledger_user_created_idx
  on public.wallet_ledger (user_id, created_at desc);

-- Keep updated_at consistent for mutable business records.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists payment_transactions_set_updated_at on public.payment_transactions;
create trigger payment_transactions_set_updated_at before update on public.payment_transactions
for each row execute function public.set_updated_at();

drop trigger if exists wallet_accounts_set_updated_at on public.wallet_accounts;
create trigger wallet_accounts_set_updated_at before update on public.wallet_accounts
for each row execute function public.set_updated_at();

-- RLS is enabled on every table. Browser clients cannot create orders,
-- confirm payments, mutate balances, or write ledger entries.
alter table public.shop_admins enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.wallet_accounts enable row level security;
alter table public.wallet_ledger enable row level security;

drop policy if exists "Admins manage shop admins" on public.shop_admins;
create policy "Admins manage shop admins" on public.shop_admins
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Public reads active products" on public.products;
create policy "Public reads active products" on public.products
  for select to anon, authenticated using (status = 'active' or public.is_shop_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders
  for select to authenticated using (user_id = (select auth.uid()) or public.is_shop_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Customers read own order items" on public.order_items;
create policy "Customers read own order items" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = (select auth.uid()) or public.is_shop_admin())
    )
  );

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Customers read own payments" on public.payment_transactions;
create policy "Customers read own payments" on public.payment_transactions
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = (select auth.uid()) or public.is_shop_admin())
    )
  );

drop policy if exists "Admins manage payments" on public.payment_transactions;
create policy "Admins manage payments" on public.payment_transactions
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Customers read own wallet" on public.wallet_accounts;
create policy "Customers read own wallet" on public.wallet_accounts
  for select to authenticated using (user_id = (select auth.uid()) or public.is_shop_admin());

drop policy if exists "Admins manage wallets" on public.wallet_accounts;
create policy "Admins manage wallets" on public.wallet_accounts
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

drop policy if exists "Customers read own wallet ledger" on public.wallet_ledger;
create policy "Customers read own wallet ledger" on public.wallet_ledger
  for select to authenticated using (user_id = (select auth.uid()) or public.is_shop_admin());

drop policy if exists "Admins manage wallet ledger" on public.wallet_ledger;
create policy "Admins manage wallet ledger" on public.wallet_ledger
  for all to authenticated using (public.is_shop_admin()) with check (public.is_shop_admin());

-- Intentionally no INSERT/UPDATE policies for customer payments or wallet ledger.
-- Future payment webhooks and wallet operations must run server-side, verify
-- provider signatures, use idempotency keys, and execute balance changes atomically.
