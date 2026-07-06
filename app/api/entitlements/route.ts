import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { userIdFromBearer } from "@/lib/auth/bearer";
import { limitsFor, type Plan, type EntitlementToken } from "@/lib/entitlements";
import { signingConfigured, signToken } from "@/lib/auth/sign";

/* GET /api/entitlements  (Authorization: Bearer lk_…)
   The engine calls this to fetch the user's plan + limits, then caches the token and
   enforces offline-tolerantly. Authenticates via the engine bearer token and reads
   the user's active subscription; falls back to a ?plan= override for demo/unauthed.
   See Lectern-Brain/03-Architecture/Sync, Auth & Entitlements.md */
export async function GET(req: Request) {
    let subjectId = "stub-subject";
  const plan: Plan = "free"; // OSS: one plan, everything included

  if (isDbConfigured()) {
    const userId = await userIdFromBearer(req);
    if (userId) subjectId = userId;
    else if (req.headers.get("authorization")) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }
  }

  const limits = limitsFor(plan);
  const now = Date.now();
  const token: EntitlementToken = {
    subjectId,
    plan,
    limits,
    issuedAt: now,
    expiresAt: now + 1000 * 60 * 60 * 24, // 24h; engine has offline grace
  };

  // EdDSA-sign when the deployment carries a key; unsigned otherwise (honest flag).
  if (signingConfigured()) {
    try {
      const jwt = await signToken(token as unknown as Record<string, unknown>);
      return NextResponse.json({ token, jwt, signed: true });
    } catch (e) {
      return NextResponse.json({ token, signed: false, sign_error: String(e) });
    }
  }
  return NextResponse.json({ token, signed: false });
}
