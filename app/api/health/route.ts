import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";

/* GET /api/health — liveness + service configuration status. */
export async function GET() {
  let db: "ok" | "unconfigured" | "error" = "unconfigured";
  if (isDbConfigured()) {
    try {
      await getDb().run(sql`select 1`);
      db = "ok";
    } catch {
      db = "error";
    }
  }
  const body = {
    status: db === "error" ? "degraded" : "ok",
    db,
    email: isEmailConfigured() ? "configured" : "unconfigured",
    time: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: db === "error" ? 503 : 200 });
}
