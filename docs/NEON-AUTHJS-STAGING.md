# CineWave staging: Neon + Auth.js credentials

## Architecture
- Next.js 15 on Vercel Functions.
- Neon PostgreSQL.
- Auth.js v5 with the official `@auth/neon-adapter`.
- Credentials provider only: Gmail address + password.
- Passwords are hashed with Node.js scrypt; plaintext passwords are never stored.
- GitHub and Google OAuth providers are removed from runtime configuration and the sign-in UI.

## Staging boundary
Use only the dedicated staging database. Do not point Preview at production data. Apply migrations in order after reviewing them.

## Environment
Set secrets only in ignored `.env.local` or Vercel Preview environment variables:
- `AUTH_SECRET`: unique random secret.
- `DATABASE_URL`: Neon pooled connection string.
- `DATABASE_URL_UNPOOLED`: direct connection for migrations only.

OAuth client IDs and secrets are no longer required. Remove old GitHub/Google OAuth variables from the Preview environment after confirming no other application uses them.

## Database migration
Apply `db/migrations/0001_neon_authjs.sql` only if the dedicated staging database does not yet have the Auth.js schema.
Then apply `db/migrations/0002_credentials_password.sql` to add nullable `users.password_hash`. This does not delete users, linked accounts, sessions, orders, or other existing data.

## Registration and sign-in
- Registration accepts `@gmail.com` addresses only.
- Password length: 10–128 characters.
- Passwords are stored as salted scrypt hashes.
- Login uses Auth.js Credentials with JWT sessions.
- New users receive the default `customer` role.
- The registration endpoint requires the database to be configured; without Neon it returns a service-unavailable response.

## Existing OAuth-only users
Existing users and OAuth account rows are preserved, but accounts without a `password_hash` cannot sign in through credentials until a secure password setup/reset flow is added. Do not delete or overwrite those records. A verified email delivery provider is required before enabling self-service password recovery or email verification.

## Security and limitations
- Never store or log plaintext passwords.
- Never expose `DATABASE_URL` to browser code.
- Use HTTPS in production.
- Add provider-backed email verification, password reset, login throttling, and abuse monitoring before opening public registration at scale.
- The app does not send verification or reset emails in this phase.
- Checkout/payment functionality is not part of authentication.

## Validation
- [ ] Apply both database migrations to dedicated staging only.
- [ ] Register a new Gmail account.
- [ ] Confirm password hash is stored and plaintext is absent.
- [ ] Log in and log out using Gmail/password.
- [ ] Reject non-Gmail addresses and weak passwords.
- [ ] Confirm GitHub/Google buttons and providers are absent.
- [ ] Run typecheck, lint and production build.
- [ ] Verify Vercel Preview only; do not deploy Production.
