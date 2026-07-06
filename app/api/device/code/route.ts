import { NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { generateDeviceCode, generateUserCode } from "@/lib/auth/tokens";
import { siteUrl } from "@/lib/auth/oauth";
import { rateLimit, clientIp, sweep } from "@/lib/ratelimit";

/* POST /api/device/code — start the OAuth 2.0 Device Authorization Grant.
   The desktop app / CLI calls this, shows the user_code + verification_uri, then
   polls /api/device/token. See Web App SaaS Build Plan (ADR-018). */
const EXPIRES_S = 600;

export async function POST(req: Request) {
  sweep();
  const rl = rateLimit(`device:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "retry-after": String(rl.retryAfter) } });
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "device flow not configured (no database)" }, { status: 503 });
  }
  const device_code = generateDeviceCode();
  const user_code = generateUserCode();
  const expiresAt = new Date(Date.now() + EXPIRES_S * 1000);

  await getDb().insert(schema.deviceCodes).values({ deviceCode: device_code, userCode: user_code, status: "pending", expiresAt });

  const base = siteUrl();
  return NextResponse.json({
    device_code,
    user_code,
    verification_uri: `${base}/activate`,
    verification_uri_complete: `${base}/activate?code=${encodeURIComponent(user_code)}`,
    expires_in: EXPIRES_S,
    interval: 5,
  });
}
