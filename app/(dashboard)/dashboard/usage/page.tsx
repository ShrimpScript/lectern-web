import type { Metadata } from "next";
import { PageHeader, Panel, Row } from "@/components/dashboard/parts";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { dashboard } from "@/lib/data/content";
import { getSessionUser } from "@/lib/auth/session";
import { getUsageForUser, fmtTokens, fmtCost, prettyBackend } from "@/lib/usage";

export const metadata: Metadata = { title: "Usage — Lectern" };

export default async function UsagePage() {
  const user = await getSessionUser();
  const usage = await getUsageForUser(user?.id ?? null);

  // Real stats when signed in (content-free counts from usage_rollup); else sample.
  const stats = usage
    ? [
        { label: "SESSIONS", value: String(usage.totals.sessions), note: "all backends" },
        { label: "TOKENS", value: fmtTokens(usage.totals.tokens), note: "in + out" },
        { label: "COST", value: fmtCost(usage.totals.costCents), note: "reported by engine" },
        { label: "BACKENDS", value: String(usage.perBackend.length || 0), note: "in use" },
      ]
    : dashboard.stats;

  const perBackend = usage
    ? usage.perBackend.map((b) => ({
        name: prettyBackend(b.name),
        sessions: b.sessions,
        tokens: b.tokens ? fmtTokens(b.tokens) : "—",
        cost: fmtCost(b.costCents),
      }))
    : [
        { name: "Claude Code", sessions: 96, tokens: "812K", cost: "—" },
        { name: "Antigravity", sessions: 21, tokens: "—", cost: "—" },
      ];

  return (
    <div>
      <PageHeader title="Usage" sub="Sessions, tokens, and cost over time. Content-free — never your code or prompts." />
      {!usage && (
        <div className="mono" style={{ display: "inline-block", fontSize: 11, letterSpacing: "0.08em", color: "var(--fg-dim)", border: "1px solid var(--bd2)", borderRadius: 999, padding: "5px 11px", marginBottom: 16 }}>
          sample data — sign in and run a session to see yours
        </div>
      )}
      {usage && usage.totals.sessions === 0 && (
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-mute)", border: "1px solid var(--bd2)", borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
          No usage yet — run a session with <span style={{ color: "var(--fg)" }}>lectern run</span> while signed in (<span style={{ color: "var(--fg)" }}>lectern login</span>) and it appears here.
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "linear-gradient(180deg, var(--panel), var(--elev))" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--fg-dim)" }}>{s.label}</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 8 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--fg-mute)", marginTop: 4 }}>{s.note}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <UsageChart series={usage?.series} />
      </div>
      <Panel title="By backend" action={<span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>content-free</span>}>
        {perBackend.length === 0 ? (
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", padding: "8px 0" }}>No backend usage yet.</div>
        ) : (
          perBackend.map((b, i) => (
            <Row key={b.name} last={i === perBackend.length - 1}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
              <span className="mono" style={{ fontSize: 12, color: "var(--fg2)", display: "flex", gap: 22 }}>
                <span>{b.sessions} sessions</span>
                <span style={{ width: 70, textAlign: "right" }}>{b.tokens}</span>
                <span style={{ width: 70, textAlign: "right" }}>{b.cost}</span>
              </span>
            </Row>
          ))
        )}
      </Panel>
    </div>
  );
}
