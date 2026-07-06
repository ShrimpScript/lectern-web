import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getSessionUser } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Real auth gate: when a database is configured, the dashboard requires a session.
  if (!user && isDbConfigured()) {
    redirect("/login?next=/dashboard");
  }
  // Demo mode only when no DB is configured at all (e.g. a preview deploy with no env).
  const email = user?.email ?? "alex@acme.com";

  return (
    <>
      <Header />
      {!user && (
        <div className="mono" style={{ background: "var(--panel)", borderBottom: "1px solid var(--bd2)", color: "var(--fg2)", fontSize: 12, textAlign: "center", padding: "8px 16px" }}>
          Demo dashboard with sample data — configure a database to enable real accounts.{" "}
          <Link href="/login" style={{ color: "var(--fg)" }}>Sign in</Link>
        </div>
      )}
      <main className="container" style={{ padding: "36px 28px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>
          <Sidebar email={email} />
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
