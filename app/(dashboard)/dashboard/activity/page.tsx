import type { Metadata } from "next";
import { PageHeader, Panel } from "@/components/dashboard/parts";
import { getSessionUser } from "@/lib/auth/session";
import { getRecentActivity } from "@/lib/usage";

export const metadata: Metadata = { title: "Activity — Lectern" };

export default async function ActivityPage() {
  const user = await getSessionUser();
  const events = await getRecentActivity(user?.id ?? null, 30);

  return (
    <div>
      <PageHeader title="Activity" sub="Session and account activity, newest first. Content-free — counts and timestamps only, never your code or prompts." />
      <Panel>
        {events.length === 0 ? (
          <div className="mono" style={{ fontSize: 12.5, color: "var(--fg-dim)", padding: "10px 0", lineHeight: 1.6 }}>
            No activity yet. Sign the engine in with <span style={{ color: "var(--fg)" }}>lectern login</span> and run a session — it&apos;ll appear here.
          </div>
        ) : (
          events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: i < events.length - 1 ? "1px solid var(--bd2)" : "none" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", width: 60, flexShrink: 0 }}>{e.when}</span>
              <span style={{ fontSize: 13.5, color: "var(--fg2)" }}>
                <b style={{ color: "var(--fg)" }}>{e.label}</b> · {e.text}
              </span>
            </div>
          ))
        )}
      </Panel>
    </div>
  );
}
