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
    await pool.query("select 1");
    return NextResponse.json(
      { status: "ready", database: "connected" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { status: "not_ready", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
