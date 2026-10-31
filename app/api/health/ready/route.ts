import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getDbPool();
  if (!pool) {
    return NextResponse.json(
      { status: "not_ready", database: "not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const result = await pool.query<{
      users: boolean;
      accounts: boolean;
      products: boolean;
      orders: boolean;
      order_items: boolean;
      payment_transactions: boolean;
      wallet_accounts: boolean;
      wallet_ledger: boolean;
    }>(`
      select
        to_regclass('public.users') is not null as users,
        to_regclass('public.accounts') is not null as accounts,
        to_regclass('public.products') is not null as products,
        to_regclass('public.orders') is not null as orders,
        to_regclass('public.order_items') is not null as order_items,
        to_regclass('public.payment_transactions') is not null as payment_transactions,
        to_regclass('public.wallet_accounts') is not null as wallet_accounts,
        to_regclass('public.wallet_ledger') is not null as wallet_ledger
    `);
    const schemaReady = result.rows[0] && Object.values(result.rows[0]).every(Boolean);
    if (!schemaReady) {
      return NextResponse.json(
        { status: "not_ready", database: "connected", schema: "missing" },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { status: "ready", database: "connected", schema: "ready" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { status: "not_ready", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
