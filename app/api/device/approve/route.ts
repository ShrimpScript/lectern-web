import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { parseBody } from "@/lib/validate";

/* POST /api/device/approve { user_code, action } — the signed-in user approves or
   denies a device login initiated by the desktop app / CLI. */
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const v = await parseBody(req, {
    user_code: { required: true, max: 20 },
    action: { oneOf: ["approve", "deny"] },
  });
  if (!v.ok) return v.res;
  const userCode = v.data.user_code.toUpperCase();
  const action = v.data.action || "approve";

  const db = getDb();
  const rows = await db.select().from(schema.deviceCodes).where(eq(schema.deviceCodes.userCode, userCode)).limit(1);
  const dc = rows[0];
  if (!dc) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (dc.status !== "pending" || dc.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "expired_or_used" }, { status: 410 });
  }

  await db
    .update(schema.deviceCodes)
    .set({ status: action === "deny" ? "denied" : "approved", userId: action === "deny" ? null : user.id })
    .where(and(eq(schema.deviceCodes.userCode, userCode), eq(schema.deviceCodes.status, "pending")));

  return NextResponse.json({ ok: true, status: action === "deny" ? "denied" : "approved" });
}
