import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { generateApiToken } from "@/lib/auth/tokens";
import { parseBody } from "@/lib/validate";

async function requireUser() {
  if (!isDbConfigured()) return null;
  return getSessionUser();
}

// GET — list the current user's tokens (metadata only, never the secret)
export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const db = getDb();
  const rows = await db
    .select({ id: schema.apiTokens.id, name: schema.apiTokens.name, prefix: schema.apiTokens.prefix, scopes: schema.apiTokens.scopes, lastUsedAt: schema.apiTokens.lastUsedAt, createdAt: schema.apiTokens.createdAt })
    .from(schema.apiTokens)
    .where(eq(schema.apiTokens.userId, user.id))
    .orderBy(desc(schema.apiTokens.createdAt));
  return NextResponse.json({ tokens: rows });
}

// POST { name } — create a token; returns the plaintext ONCE
export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const v = await parseBody(req, { name: { max: 100 } });
  if (!v.ok) return v.res;
  const name = v.data.name || "API token";
  const tok = generateApiToken();
  const db = getDb();
  const inserted = await db
    .insert(schema.apiTokens)
    .values({ userId: user.id, name, prefix: tok.prefix, hash: tok.hash, scopes: ["api"] })
    .returning({ id: schema.apiTokens.id });
  return NextResponse.json({ id: inserted[0].id, name, token: tok.plaintext });
}

// DELETE ?id= — revoke a token
export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  await getDb().delete(schema.apiTokens).where(and(eq(schema.apiTokens.id, id), eq(schema.apiTokens.userId, user.id)));
  return NextResponse.json({ ok: true });
}
