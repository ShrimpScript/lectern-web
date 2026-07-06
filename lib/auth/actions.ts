"use server";
import { randomBytes, createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";
import { siteUrl } from "./oauth";
import { sendEmail, verifyEmailHtml } from "@/lib/email";
import { rateLimit, sweep } from "@/lib/ratelimit";

export type AuthResult = { ok: true; demo?: boolean } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Per-IP rate limit for an auth action. Returns an error string if limited. */
async function limited(scope: string, limit = 8, windowMs = 60_000): Promise<string | null> {
  sweep();
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
  const r = rateLimit(`${scope}:${ip}`, limit, windowMs);
  return r.ok ? null : `Too many attempts. Try again in ${r.retryAfter}s.`;
}

/** Create + email a verification link (best-effort; never blocks signup). */
async function sendVerification(userId: string, email: string) {
  try {
    const token = randomBytes(32).toString("base64url");
    const id = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await getDb().insert(schema.verificationTokens).values({ id, userId, purpose: "email_verify", expiresAt });
    await sendEmail({ to: email, subject: "Verify your Lectern email", html: verifyEmailHtml(`${siteUrl()}/verify/${token}`) });
  } catch {
    /* non-fatal */
  }
}

function validate(email: string, password: string): string | null {
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isDbConfigured()) return { ok: true, demo: true };
  const rl = await limited("signup"); if (rl) return { ok: false, error: rl };
  const invalid = validate(email, password);
  if (invalid) return { ok: false, error: invalid };

  const db = getDb();
  const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (existing.length) return { ok: false, error: "An account with that email already exists." };

  const passwordHash = await hashPassword(password);
  const inserted = await db.insert(schema.users).values({ email, name, passwordHash, authProviders: ["password"] }).returning({ id: schema.users.id });
  await createSession(inserted[0].id);
  await sendVerification(inserted[0].id, email); // best-effort; verification is non-blocking
  return { ok: true };
}

/** Set a new password from a reset token, then sign the user in. */
export async function setNewPassword(token: string, password: string): Promise<AuthResult> {
  if (!isDbConfigured()) return { ok: false, error: "Password reset is not available in this environment." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  const id = createHash("sha256").update(token).digest("hex");
  const db = getDb();
  const rows = await db
    .select({ id: schema.verificationTokens.id, userId: schema.verificationTokens.userId, expiresAt: schema.verificationTokens.expiresAt })
    .from(schema.verificationTokens)
    .where(and(eq(schema.verificationTokens.id, id), eq(schema.verificationTokens.purpose, "password_reset")))
    .limit(1);
  const row = rows[0];
  if (!row || row.expiresAt.getTime() < Date.now()) return { ok: false, error: "This reset link is invalid or has expired." };

  const passwordHash = await hashPassword(password);
  await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, row.userId));
  await db.delete(schema.verificationTokens).where(eq(schema.verificationTokens.id, id));
  // invalidate other sessions for safety, then start a fresh one
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, row.userId));
  await createSession(row.userId);
  return { ok: true };
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isDbConfigured()) return { ok: true, demo: true };
  const rl = await limited("signin"); if (rl) return { ok: false, error: rl };
  if (!EMAIL_RE.test(email) || !password) return { ok: false, error: "Enter your email and password." };

  const db = getDb();
  const rows = await db.select({ id: schema.users.id, passwordHash: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  const user = rows[0];
  // Constant-ish work whether or not the user exists (avoid user enumeration).
  const ok = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) return { ok: false, error: "Incorrect email or password." };

  await createSession(user.id);
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await destroySession();
}
