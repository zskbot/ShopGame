import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "game-shop",
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString()
  });
}
