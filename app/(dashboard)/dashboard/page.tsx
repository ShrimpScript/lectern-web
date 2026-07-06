import type { Metadata } from "next";
import Link from "next/link";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUsageForUser,
  getConnectedKeys,
  getRecentActivity,
  fmtTokens,
  fmtCost,
  prettyBackend,
} from "@/lib/usage";

export const metadata: Metadata = { title: "Dashboard — Lectern" };

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();
  const userId = sessionUser?.id ?? null;
  const [usage, keys, activity] = await Promise.all([
    getUsageForUser(userId),
    getConnectedKeys(userId),
    getRecentActivity(userId),
  ]);

  const name = sessionUser?.name || sessionUser?.email?.split("@")[0] || "there";
  const totals = usage?.totals ?? { sessions: 0, tokens: 0, costCents: 0 };
  const series = usage?.series ?? [];
  const backendItems = (usage?.perBackend ?? []).map((b) => ({
    name: prettyBackend(b.name),
    sub: `${b.sessions} session${b.sessions === 1 ? "" : "s"}`,
    used: `${fmtTokens(b.tokens)} tok`,
  }));
  const connected = [...backendItems, ...keys];

  const stats = [
    { label: "SESSIONS · TOTAL", value: String(totals.sessions), note: totals.sessions ? "across all backends" : "no sessions yet" },
    { label: "TOKENS · TOTAL", value: fmtTokens(totals.tokens), note: totals.tokens ? "in + out, all backends" : "run a session to populate" },
    { label: "COST · TOTAL", value: fmtCost(totals.costCents), note: totals.costCents ? "estimated" : "no spend yet" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="mono" style={{ fontSize: 13, color: "var(--fg-mute)" }}>Welcome back</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4 }}>{name}</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid var(--bd2)",
            borderRadius: 11,
            padding: "12px 16px",
            background: "var(--elev)",
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.1em" }}>PLAN</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>
              Free &amp; open source
            </div>
          </div>
          <div style={{ width: 1, height: 34, background: "var(--bd)" }} />
          <Link
            href="https://github.com/ShrimpScript/lectern"
            style={{ fontSize: 13, color: "var(--fg)", cursor: "pointer", fontWeight: 600 }}
          >
            Star on GitHub →
          </Link>
        </div>
      </div>

      {/* stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "linear-gradient(180deg, var(--panel), var(--elev))" }}
          >
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--fg-dim)" }}>{s.label}</div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 8 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--fg-mute)", marginTop: 4 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <UsageChart series={series} />

      {/* backends + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Panel title="Connected backends & keys">
          {connected.length === 0 ? (
            <Empty>
              No backends or keys connected yet. Run <Code>lectern login</Code> to link the engine, then{" "}
              <Link href="/dashboard/tokens" style={{ color: "var(--fg)", fontWeight: 600 }}>create an API token</Link>.
            </Empty>
          ) : (
            connected.map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 0",
                  borderBottom: i < connected.length - 1 ? "1px solid var(--bd2)" : "none",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{b.sub}</span>
                </div>
                <span className="mono" style={{ fontSize: 12, color: "var(--fg-mute)" }}>{b.used}</span>
              </div>
            ))
          )}
        </Panel>

        <Panel title="Recent activity">
          {activity.length === 0 ? (
            <Empty>
              No activity yet — sessions you run through the engine will show up here.{" "}
              <Link href="/dashboard/usage" style={{ color: "var(--fg)", fontWeight: 600 }}>View usage</Link>
            </Empty>
          ) : (
            activity.map((a, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: i < activity.length - 1 ? "1px solid var(--bd2)" : "none" }}
              >
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", width: 54 }}>{a.when}</span>
                <span style={{ fontSize: 13, color: "var(--fg2)" }}>
                  <b style={{ color: "var(--fg)" }}>{a.label}</b> · {a.text}
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)" }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg-mute)", padding: "6px 0 2px" }}>{children}</div>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono" style={{ fontSize: 12, color: "var(--fg)", background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 6px" }}>
      {children}
    </span>
  );
}
