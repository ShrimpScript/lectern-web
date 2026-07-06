import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { hashApiToken } from "./tokens";

/* Validate an `Authorization: Bearer lk_…` engine/API token and return the owning
   userId (or null). Updates last-used. Used by engine-facing endpoints (sync, usage). */
export async function userIdFromBearer(req: Request): Promise<string | null> {
  if (!isDbConfigured()) return null;
  const header = req.headers.get("authorization") ?? "";
  const m = header.match(/^Bearer\s+(lk_[A-Za-z0-9_-]+)$/);
  if (!m) return null;
  const hash = hashApiToken(m[1]);
  const db = getDb();
  const rows = await db.select({ id: schema.apiTokens.id, userId: schema.apiTokens.userId, expiresAt: schema.apiTokens.expiresAt }).from(schema.apiTokens).where(eq(schema.apiTokens.hash, hash)).limit(1);
  const tok = rows[0];
  if (!tok) return null;
  if (tok.expiresAt && tok.expiresAt.getTime() < Date.now()) return null;
  await db.update(schema.apiTokens).set({ lastUsedAt: new Date() }).where(eq(schema.apiTokens.id, tok.id));
  return tok.userId;
}
