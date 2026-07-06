import type { Metadata } from "next";
import Link from "next/link";
import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { Header } from "@/components/site/Header";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export const metadata: Metadata = { title: "Verify email — Lectern" };

async function verify(token: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const id = createHash("sha256").update(token).digest("hex");
  const db = getDb();
  const rows = await db
    .select({ id: schema.verificationTokens.id, userId: schema.verificationTokens.userId, expiresAt: schema.verificationTokens.expiresAt })
    .from(schema.verificationTokens)
    .where(and(eq(schema.verificationTokens.id, id), eq(schema.verificationTokens.purpose, "email_verify")))
    .limit(1);
  const row = rows[0];
  if (!row || row.expiresAt.getTime() < Date.now()) return false;
  await db.update(schema.users).set({ emailVerified: new Date() }).where(eq(schema.users.id, row.userId));
  await db.delete(schema.verificationTokens).where(eq(schema.verificationTokens.id, id));
  return true;
}

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ok = await verify(token);
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{ok ? "Email verified ✓" : "Link expired"}</div>
          <p style={{ fontSize: 14, color: "var(--fg2)" }}>
            {ok ? "Thanks — your email is confirmed." : "This verification link is invalid or has expired. You can request a new one from Settings."}
          </p>
          <Link href="/dashboard" style={{ alignSelf: "center", background: "var(--btn)", color: "var(--btnfg)", borderRadius: 9, padding: "11px 20px", fontWeight: 600, fontSize: 14 }}>
            Go to dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
