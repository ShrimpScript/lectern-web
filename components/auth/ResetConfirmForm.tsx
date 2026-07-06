"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setNewPassword, type AuthResult } from "@/lib/auth/actions";

export function ResetConfirmForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");
    if (pw !== confirm) { setError("Passwords don't match."); return; }
    start(async () => {
      const res: AuthResult = await setNewPassword(token, pw);
      if (res.ok) { router.push("/dashboard"); router.refresh(); }
      else setError(res.error);
    });
  }

  const field: React.CSSProperties = { border: "1px solid var(--bd)", borderRadius: 9, padding: 12, fontSize: 13, color: "var(--fg)", background: "var(--elev)", outline: "none" };
  return (
    <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Choose a new password</div>
      </div>
      <form onSubmit={onSubmit} style={{ border: "1px solid var(--bd)", borderRadius: 14, padding: 24, background: "var(--panel)", display: "flex", flexDirection: "column", gap: 14 }}>
        <input name="password" type="password" required placeholder="New password" className="mono" style={field} autoComplete="new-password" />
        <input name="confirm" type="password" required placeholder="Confirm new password" className="mono" style={field} autoComplete="new-password" />
        {error && <div className="mono" style={{ fontSize: 12, color: "#e5687a" }}>{error}</div>}
        <button type="submit" disabled={pending} style={{ background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 9, padding: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          {pending ? "…" : "Set password & sign in"}
        </button>
      </form>
      <div style={{ textAlign: "center", fontSize: 13 }}><Link href="/login" style={{ color: "var(--fg2)" }}>← Back to sign in</Link></div>
    </div>
  );
}
