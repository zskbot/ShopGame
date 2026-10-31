# MVP scope and safety boundaries

## Included
- Three game categories: Liên Quân, Free Fire and PUBG Mobile.
- Search, category filters, product cards and cart quantity controls.
- Checkout form for customer contact, optional Player ID/UID and notes.
- Demo order creation stored in the current browser's localStorage.

## Not connected yet
- Authentication and customer profiles.
- Server-side order database and admin dashboard.
- Bank transfer reconciliation, QR generation, wallet ledger or payment provider.
- Game publisher top-up APIs or fulfillment partners.
- Account marketplace inventory, escrow or dispute handling.

## Before accepting real orders
1. Add server-side authentication and role-based admin access.
2. Store orders and immutable payment events in a database.
3. Verify payment callbacks/signatures server-side; never trust a browser success state.
4. Add idempotency, order state transitions, audit logs and refund handling.
5. Integrate only authorized publisher/distributor APIs and validate region/player identifiers.
6. Publish terms, privacy, refund and customer-support policies.
7. Never ask customers for game passwords, OTPs, session cookies or recovery codes.

The storefront intentionally labels checkout as a demo and does not initiate real money movement.
