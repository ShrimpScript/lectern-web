"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/toast/ToastProvider";

type Token = { id: string; name: string; prefix: string; lastUsedAt: string | null; createdAt: string };

export function TokensClient() {
  const toast = useToast();
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [name, setName] = useState("");
  const [created, setCreated] = useState<{ name: string; token: string } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens);
      } else {
        setTokens([]);
        if (res.status === 401) setNote("Sign in (with a database configured) to manage real API tokens. This is a demo view.");
      }
    } catch {
      setTokens([]);
    }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!name.trim()) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/tokens", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
      const data = await res.json();
      if (res.ok) {
        setCreated({ name: data.name, token: data.token });
        setName("");
        toast.success("Token created — copy it now, it won't be shown again.");
        load();
      } else {
        const msg = data.error === "unauthenticated" ? "Demo view — sign in with a database configured to create real tokens." : (data.error ?? "Failed to create token.");
        setNote(msg);
        toast.error(msg);
      }
    } catch {
      setNote("Network error.");
      toast.error("Network error — could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function copyToken(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Token copied to clipboard.");
    } catch {
      toast.error("Couldn't copy — select and copy manually.");
    }
  }

  async function revoke(id: string) {
    const res = await fetch(`/api/tokens?id=${id}`, { method: "DELETE" });
    if (res.ok) toast.success("Token revoked.");
    else toast.error("Couldn't revoke token.");
    load();
  }

  return (
    <div>
      <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Create a token</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CI / laptop" className="mono"
            style={{ flex: 1, border: "1px solid var(--bd)", borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "var(--fg)", background: "var(--panel)", outline: "none" }} />
          <button onClick={create} disabled={busy || !name.trim()} style={{ background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 9, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: busy || !name.trim() ? 0.7 : 1 }}>
            {busy ? "…" : "Generate"}
          </button>
        </div>
        {created && (
          <div style={{ marginTop: 14 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-mute)", marginBottom: 6 }}>Copy this now — it won't be shown again:</div>
            <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
              <div className="mono" style={{ flex: 1, fontSize: 13, color: "var(--term-fg)", background: "var(--term-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "10px 12px", wordBreak: "break-all" }}>{created.token}</div>
              <button onClick={() => copyToken(created.token)} style={{ background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Copy</button>
            </div>
          </div>
        )}
        {note && <div className="mono" style={{ marginTop: 12, fontSize: 12, color: "var(--fg2)" }}>{note}</div>}
      </div>

      <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)" }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Your tokens</div>
        {tokens === null ? (
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>Loading…</div>
        ) : tokens.length === 0 ? (
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>No tokens yet.</div>
        ) : (
          tokens.map((t, i) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < tokens.length - 1 ? "1px solid var(--bd2)" : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{t.prefix}••••  ·  created {new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
              <button onClick={() => revoke(t.id)} style={{ background: "transparent", border: "1px solid #e5687a55", color: "#e5687a", borderRadius: 7, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Revoke</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
