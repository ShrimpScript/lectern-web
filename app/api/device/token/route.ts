import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { generateApiToken } from "@/lib/auth/tokens";
import { rateLimit, clientIp, sweep } from "@/lib/ratelimit";
import { parseBody } from "@/lib/validate";

/* POST /api/device/token { device_code } — polled by the engine/CLI.
   Returns pending until the user approves at /activate, then issues a long-lived
   engine token (lk_…) ONCE. RFC-8628-style status responses. */
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  // Polled endpoint (RFC-8628) — bound it per IP like device/code. 60/min is well
  // above legit ~5s polling but caps a device-code-guessing flood.
  sweep();
  const rl = rateLimit(`device-token:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "retry-after": String(rl.retryAfter) } });

  const v = await parseBody(req, { device_code: { required: true, max: 200 } });
  if (!v.ok) return v.res;
  const code = v.data.device_code;

  const db = getDb();
  const rows = await db.select().from(schema.deviceCodes).where(eq(schema.deviceCodes.deviceCode, code)).limit(1);
  const dc = rows[0];
  if (!dc) return NextResponse.json({ error: "invalid_grant" }, { status: 400 });

  if (dc.expiresAt.getTime() < Date.now()) {
    await db.update(schema.deviceCodes).set({ status: "expired" }).where(eq(schema.deviceCodes.deviceCode, code));
    return NextResponse.json({ error: "expired_token" }, { status: 400 });
  }
  if (dc.status === "pending") return NextResponse.json({ error: "authorization_pending" }, { status: 428 });
  if (dc.status === "denied") return NextResponse.json({ error: "access_denied" }, { status: 400 });
  if (dc.status !== "approved" || !dc.userId) return NextResponse.json({ error: "invalid_grant" }, { status: 400 });

  // Approved → mint a one-time engine token, then consume the device code.
  const tok = generateApiToken();
  await db.insert(schema.apiTokens).values({
    userId: dc.userId,
    name: "Lectern Desktop / CLI",
    prefix: tok.prefix,
    hash: tok.hash,
    scopes: ["engine", "sync", "usage"],
  });
  await db.delete(schema.deviceCodes).where(eq(schema.deviceCodes.deviceCode, code));

  return NextResponse.json({ access_token: tok.plaintext, token_type: "bearer", scope: "engine sync usage" });
}
