import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { userIdFromBearer } from "@/lib/auth/bearer";

/* E2E-encrypted memory/skills sync. The engine authenticates with its bearer token.
   INVARIANT: this stores CIPHERTEXT + metadata only — the server can't read it.
   See Lectern-Brain/03-Architecture/Sync, Auth & Entitlements.md.
   Dev/self-host stores ciphertext inline (base64); prod uses object storage. */

// GET ?workspace= — list blob manifest; ?download=<workspaceKey> — fetch ciphertext
export async function GET(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const userId = await userIdFromBearer(req);
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const url = new URL(req.url);
  const download = url.searchParams.get("download");
  const db = getDb();

  if (download) {
    const rows = await db
      .select({ sha256: schema.syncBlob.sha256, size: schema.syncBlob.size, ciphertext: schema.syncBlob.ciphertext, updatedAt: schema.syncBlob.updatedAt })
      .from(schema.syncBlob)
      .where(and(eq(schema.syncBlob.subjectId, userId), eq(schema.syncBlob.workspaceKey, download)))
      .orderBy(desc(schema.syncBlob.updatedAt))
      .limit(1);
    if (!rows[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ workspaceKey: download, ...rows[0] });
  }

  const ws = url.searchParams.get("workspace");
  const rows = await db
    .select({ id: schema.syncBlob.id, sha256: schema.syncBlob.sha256, size: schema.syncBlob.size, updatedAt: schema.syncBlob.updatedAt, workspaceKey: schema.syncBlob.workspaceKey })
    .from(schema.syncBlob)
    .where(ws ? and(eq(schema.syncBlob.subjectId, userId), eq(schema.syncBlob.workspaceKey, ws)) : eq(schema.syncBlob.subjectId, userId));
  return NextResponse.json({ blobs: rows });
}

// PUT { workspaceKey, sha256, size, ciphertext } — replace the current blob for a workspace
export async function PUT(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const userId = await userIdFromBearer(req);
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { workspaceKey?: string; sha256?: string; size?: number; ciphertext?: string; ciphertextUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!body.workspaceKey || !body.sha256 || (!body.ciphertext && !body.ciphertextUrl)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const db = getDb();
  // latest-wins: one current blob per (subject, workspace)
  await db.delete(schema.syncBlob).where(and(eq(schema.syncBlob.subjectId, userId), eq(schema.syncBlob.workspaceKey, body.workspaceKey)));
  await db.insert(schema.syncBlob).values({
    subjectId: userId,
    workspaceKey: body.workspaceKey,
    sha256: body.sha256,
    size: body.size ?? (body.ciphertext ? body.ciphertext.length : 0),
    ciphertext: body.ciphertext ?? null,
    ciphertextUrl: body.ciphertextUrl ?? null,
  });
  return NextResponse.json({ ok: true });
}
