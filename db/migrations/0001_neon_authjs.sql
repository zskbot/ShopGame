-- GameHub Shop: Neon PostgreSQL + Auth.js schema.
-- Apply ONLY to a dedicated Neon staging database.
-- Independent of Supabase Auth, RLS and Supabase-specific extensions.
begin;
create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key default gen_random_uuid()::text,
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.accounts (
  id bigserial primary key,
  "userId" text not null references public.users(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique (provider, "providerAccountId")
);
create table if not exists public.sessions (
  id bigserial primary key,
  "userId" text not null references public.users(id) on delete cascade,
  expires timestamptz not null,
  "sessionToken" text not null unique
);
create table if not exists public.verification_token (
  identifier text not null,
  expires timestamptz not null,
  token text not null,
  primary key (identifier, token)
);
create index if not exists accounts_user_id_idx on public.accounts ("userId");
create index if not exists sessions_user_id_idx on public.sessions ("userId");

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
create index if not exists products_public_catalog_idx on public.products (game, category, created_at desc) where status = 'active';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id text references public.users(id) on delete set null,
  customer_email text,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'processing', 'fulfilled', 'cancelled', 'refunded')),
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
create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders (status, created_at desc);

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
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  amount_vnd bigint not null check (amount_vnd > 0),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_transactions_order_idx on public.payment_transactions (order_id, created_at desc);

create table if not exists public.wallet_accounts (
  user_id text primary key references public.users(id) on delete cascade,
  balance_vnd bigint not null default 0 check (balance_vnd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('credit', 'debit', 'refund', 'adjustment')),
  amount_vnd bigint not null check (amount_vnd > 0),
  balance_after_vnd bigint not null check (balance_after_vnd >= 0),
  reference text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists wallet_ledger_user_created_idx on public.wallet_ledger (user_id, created_at desc);

comment on schema public is 'GameHub schema; server-side access only. Never expose DATABASE_URL to browsers.';
commit;
