import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { ActivateForm } from "@/components/auth/ActivateForm";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Connect a device — Lectern" };

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const user = await getSessionUser();

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        {user ? (
          <ActivateForm initialCode={code ?? ""} />
        ) : (
          <div style={{ maxWidth: 400, textAlign: "center", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Sign in to connect your device</div>
            <div style={{ fontSize: 14, color: "var(--fg2)" }}>
              Sign in to approve the Lectern app or CLI{code ? ` (code ${code})` : ""}.
            </div>
            <Link
              href={`/login?next=${encodeURIComponent(`/activate${code ? `?code=${code}` : ""}`)}`}
              style={{ alignSelf: "center", background: "var(--btn)", color: "var(--btnfg)", borderRadius: 9, padding: "11px 20px", fontWeight: 600, fontSize: 14 }}
            >
              Sign in
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
