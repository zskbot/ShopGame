import ws from "ws";
import { neonConfig, Pool } from "@neondatabase/serverless";

// Vercel Node.js runtimes need an explicit WebSocket implementation for Pool.
neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;

/** Lazily create the Neon pool so the public storefront can build without staging credentials. */
export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000
    });
  }
  return pool;
}
