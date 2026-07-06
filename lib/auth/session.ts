import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/* Session management — opaque random token in an httpOnly cookie; only the
   SHA-256 hash is stored in the DB (so a DB leak can't be used to forge sessions).
   See Lectern-Brain/06-Build-Plan/Web App SaaS Build Plan.md (ADR-017). */

export const SESSION_COOKIE = "lectern_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Create a session row and set the cookie. Returns the plaintext token. */
export async function createSession(userId: string, meta?: { ip?: string; userAgent?: string }) {
  const token = randomBytes(32).toString("base64url");
  const id = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const db = getDb();
  await db.insert(schema.sessions).values({ id, userId, expiresAt, ip: meta?.ip, userAgent: meta?.userAgent });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

/** Resolve the current user from the session cookie, or null. Demo-safe: returns
 *  null when no DB is configured rather than throwing. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isDbConfigured()) return null;
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const id = hashToken(token);
  const db = getDb();
  const rows = await db
    .select({
      uid: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      image: schema.users.image,
      expiresAt: schema.sessions.expiresAt,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(eq(schema.sessions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
    return null;
  }
  return { id: row.uid, email: row.email, name: row.name, image: row.image };
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && isDbConfigured()) {
    try {
      await getDb().delete(schema.sessions).where(eq(schema.sessions.id, hashToken(token)));
    } catch {
      /* ignore */
    }
  }
  jar.delete(SESSION_COOKIE);
}
