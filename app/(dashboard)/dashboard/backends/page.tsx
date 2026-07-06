import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Panel, Row, Pill } from "@/components/dashboard/parts";
import { dashboard } from "@/lib/data/content";
import { getSessionUser } from "@/lib/auth/session";
import { getUsageForUser, getConnectedKeys, fmtTokens, prettyBackend } from "@/lib/usage";

export const metadata: Metadata = { title: "Backends & keys — Lectern" };

export default async function BackendsPage() {
  const user = await getSessionUser();
  const [usage, keys] = await Promise.all([
    getUsageForUser(user?.id ?? null),
    getConnectedKeys(user?.id ?? null),
  ]);

  // Demo mode (no DB / no session) shows labeled sample data; signed-in is real.
  const demo = !user;
  const backends = demo
    ? dashboard.backends.map((b) => ({ name: b.name, sub: b.sub, used: b.used }))
    : (usage?.perBackend ?? []).map((b) => ({
        name: prettyBackend(b.name),
        sub: `${b.sessions} session${b.sessions === 1 ? "" : "s"}`,
        used: `${fmtTokens(b.tokens)} tok`,
      }));

  return (
    <div>
      <PageHeader title="Backends & keys" sub="A cloud view of your connections. Labels and metadata only — your actual keys stay in your machine's keychain and never reach our servers." />
      {demo && (
        <div className="mono" style={{ display: "inline-block", fontSize: 11, letterSpacing: "0.08em", color: "var(--fg-dim)", border: "1px solid var(--bd2)", borderRadius: 999, padding: "5px 11px", marginBottom: 16 }}>
          sample data — sign in to see your connections
        </div>
      )}

      <Panel title="Connected backends">
        {backends.length === 0 ? (
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", padding: "8px 0", lineHeight: 1.6 }}>
            No backends have reported activity yet. Run <span style={{ color: "var(--fg)" }}>lectern login</span> to link the engine, then run a session.
          </div>
        ) : (
          backends.map((b, i) => (
            <Row key={`${b.name}-${i}`} last={i === backends.length - 1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{b.sub}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {demo && <Pill tone="ok">healthy</Pill>}
                <span className="mono" style={{ fontSize: 12, color: "var(--fg-mute)" }}>{b.used}</span>
              </div>
            </Row>
          ))
        )}
      </Panel>

      {!demo && (
        <Panel title="API tokens">
          {keys.length === 0 ? (
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", padding: "8px 0" }}>
              No tokens yet. Create one on the{" "}
              <Link href="/dashboard/tokens" style={{ color: "var(--fg)" }}>API tokens</Link> page.
            </div>
          ) : (
            keys.map((k, i) => (
              <Row key={`${k.name}-${i}`} last={i === keys.length - 1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{k.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{k.sub}</span>
                </div>
                <span className="mono" style={{ fontSize: 12, color: "var(--fg-mute)" }}>{k.used}</span>
              </Row>
            ))
          )}
        </Panel>
      )}

      <div
        className="mono"
        style={{ fontSize: 12, color: "var(--fg-dim)", border: "1px dashed var(--bd)", borderRadius: 10, padding: 14, lineHeight: 1.6 }}
      >
        🔒 To add, remove, or re-auth a backend, use the Lectern desktop app or CLI
        (<span style={{ color: "var(--fg2)" }}>Settings → Backends &amp; keys</span>).
        Connections are managed locally so your credentials never leave your device.
      </div>
    </div>
  );
}
