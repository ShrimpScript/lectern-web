import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { userIdFromBearer } from "@/lib/auth/bearer";

/* POST /api/usage/ingest  (Authorization: Bearer lk_…)
   The engine batches CONTENT-FREE usage counts here (opt-in telemetry).
   INVARIANT: reject anything that looks like code/prompt/secret content.
   See Lectern-Brain/05-Security-Privacy/Privacy & Data Handling.md */

type UsageRow = {
  day: string; // YYYY-MM-DD
  backend?: string;
  sessions?: number;
  tokensIn?: number;
  tokensOut?: number;
  costCents?: number;
};

const FORBIDDEN = ["prompt", "code", "content", "source", "key", "secret", "text", "messages"];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const rows = (body as { rows?: UsageRow[] })?.rows;
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "expected { rows: UsageRow[] }" }, { status: 400 });
  }

  // privacy guard: refuse payloads carrying any forbidden (content-bearing) field
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (FORBIDDEN.includes(k.toLowerCase())) {
        return NextResponse.json(
          { error: `forbidden field "${k}" — usage ingest accepts counts only` },
          { status: 422 },
        );
      }
    }
  }

  if (!isDbConfigured()) {
    // Accept (no-op) when running without a database so dev/demo doesn't error.
    return NextResponse.json({ ok: true, accepted: rows.length, persisted: false });
  }

  const userId = await userIdFromBearer(req);
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const db = getDb();
  let persisted = 0;
  for (const row of rows) {
    if (!row.day) continue;
    const backend = row.backend ?? "unknown";
    const existing = await db
      .select()
      .from(schema.usageRollup)
      .where(
        and(
          eq(schema.usageRollup.subjectId, userId),
          eq(schema.usageRollup.day, row.day),
          eq(schema.usageRollup.backend, backend),
        ),
      )
      .limit(1);
    if (existing[0]) {
      await db
        .update(schema.usageRollup)
        .set({
          sessions: existing[0].sessions + (row.sessions ?? 0),
          tokensIn: existing[0].tokensIn + (row.tokensIn ?? 0),
          tokensOut: existing[0].tokensOut + (row.tokensOut ?? 0),
          costCents: existing[0].costCents + (row.costCents ?? 0),
        })
        .where(eq(schema.usageRollup.id, existing[0].id));
    } else {
      await db.insert(schema.usageRollup).values({
        subjectId: userId,
        day: row.day,
        backend,
        sessions: row.sessions ?? 0,
        tokensIn: row.tokensIn ?? 0,
        tokensOut: row.tokensOut ?? 0,
        costCents: row.costCents ?? 0,
      });
    }
    persisted++;
  }

  return NextResponse.json({ ok: true, accepted: rows.length, persisted });
}
