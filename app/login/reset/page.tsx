"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/Header";

export default function ResetRequestPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: fd.get("email") }) });
      if (res.ok) setSent(true);
      else { const d = await res.json(); setErr(d.error ?? "Failed."); }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Reset your password</div>
            <div style={{ fontSize: 14, color: "var(--fg-mute)", marginTop: 6 }}>We'll email you a link to choose a new one.</div>
          </div>
          {sent ? (
            <div style={{ border: "1px solid var(--bd)", borderRadius: 14, padding: 24, background: "var(--panel)", textAlign: "center", fontSize: 14, color: "var(--fg2)" }}>
              If an account exists for that email, a reset link is on its way. ✓
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ border: "1px solid var(--bd)", borderRadius: 14, padding: 24, background: "var(--panel)", display: "flex", flexDirection: "column", gap: 14 }}>
              <input name="email" type="email" required placeholder="you@company.com" className="mono" style={{ border: "1px solid var(--bd)", borderRadius: 9, padding: 12, fontSize: 13, color: "var(--fg)", background: "var(--elev)", outline: "none" }} />
              {err && <div className="mono" style={{ fontSize: 12, color: "#e5687a" }}>{err}</div>}
              <button type="submit" disabled={busy} style={{ background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 9, padding: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{busy ? "…" : "Send reset link"}</button>
            </form>
          )}
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-dim)" }}>
            <Link href="/login" style={{ color: "var(--fg2)" }}>← Back to sign in</Link>
          </div>
        </div>
      </main>
    </>
  );
}
