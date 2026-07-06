import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { sendEmail, resetPasswordHtml } from "@/lib/email";
import { siteUrl } from "@/lib/auth/oauth";
import { rateLimit, clientIp, sweep } from "@/lib/ratelimit";
import { parseBody } from "@/lib/validate";

/* POST /api/auth/reset { email } — issue a password-reset link.
   Always returns ok (don't reveal whether an account exists). */
export async function POST(req: Request) {
  sweep();
  const rl = rateLimit(`reset:${clientIp(req)}`, 5, 15 * 60_000);
  if (!rl.ok) return NextResponse.json({ ok: true }); // silently succeed (don't leak rate state)
  const v = await parseBody(req, { email: { required: true, email: true, max: 320 } });
  if (!v.ok) return v.res;
  const email = v.data.email.toLowerCase();

  if (isDbConfigured()) {
    const db = getDb();
    const rows = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (rows[0]) {
      const token = randomBytes(32).toString("base64url");
      const id = createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
      await db.insert(schema.verificationTokens).values({ id, userId: rows[0].id, purpose: "password_reset", expiresAt });
      await sendEmail({ to: email, subject: "Reset your Lectern password", html: resetPasswordHtml(`${siteUrl()}/login/reset/${token}`) });
    }
  }
  // Same response regardless of existence / configuration.
  return NextResponse.json({ ok: true });
}
