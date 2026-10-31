-- Add password authentication without deleting or rewriting existing Auth.js users.
-- Apply this migration once to the dedicated staging database before enabling credentials login.
begin;
alter table public.users add column if not exists password_hash text;
comment on column public.users.password_hash is 'Scrypt password hash for email/password authentication; never store plaintext passwords.';
commit;
