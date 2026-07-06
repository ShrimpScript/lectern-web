import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/* Real usage aggregation from the content-free usage_rollup table (the engine
   reports counts here via /api/usage/ingest). Used by the dashboard usage page. */

export type BackendUsage = { name: string; sessions: number; tokens: number; costCents: number };
export type UsageSummary = {
  totals: { sessions: number; tokens: number; costCents: number };
  perBackend: BackendUsage[];
  series: number[]; // tokens per day, chronological
};

export async function getUsageForUser(userId: string | null): Promise<UsageSummary | null> {
  if (!userId || !isDbConfigured()) return null;
  const rows = await getDb().select().from(schema.usageRollup).where(eq(schema.usageRollup.subjectId, userId));

  const totals = { sessions: 0, tokens: 0, costCents: 0 };
  const byBackend = new Map<string, BackendUsage>();
  const byDay = new Map<string, number>();

  for (const r of rows) {
    const tok = r.tokensIn + r.tokensOut;
    totals.sessions += r.sessions;
    totals.tokens += tok;
    totals.costCents += r.costCents;

    const key = r.backend ?? "unknown";
    const b = byBackend.get(key) ?? { name: key, sessions: 0, tokens: 0, costCents: 0 };
    b.sessions += r.sessions;
    b.tokens += tok;
    b.costCents += r.costCents;
    byBackend.set(key, b);

    byDay.set(r.day, (byDay.get(r.day) ?? 0) + tok);
  }

  const series = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v);
  return { totals, perBackend: [...byBackend.values()].sort((a, b) => b.tokens - a.tokens), series };
}

export function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function fmtCost(cents: number): string {
  return cents > 0 ? `$${(cents / 100).toFixed(2)}` : "—";
}

export function prettyBackend(key: string | null): string {
  switch (key) {
    case "claude-code":
      return "Claude Code";
    case "antigravity":
      return "Antigravity";
    case "api-key":
    case "api":
      return "API key";
    case "mock":
    case "mock-limit":
      return "Mock backend";
    default:
      return key ?? "Unknown";
  }
}

export function relTime(d: Date): string {
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

/* Real plan from the subscriptions table (free until the user subscribes). */
export type PlanInfo = { label: string; renews: string | null; isPaid: boolean };

/* Real API tokens (engine keys) the user has created. */
export type ConnectedItem = { name: string; sub: string; used: string };
export async function getConnectedKeys(userId: string | null): Promise<ConnectedItem[]> {
  if (!userId || !isDbConfigured()) return [];
  const toks = await getDb()
    .select({ name: schema.apiTokens.name, prefix: schema.apiTokens.prefix, lastUsedAt: schema.apiTokens.lastUsedAt })
    .from(schema.apiTokens)
    .where(eq(schema.apiTokens.userId, userId));
  return toks.map((t) => ({ name: t.name, sub: `${t.prefix}••••`, used: t.lastUsedAt ? `used ${relTime(t.lastUsedAt)}` : "never used" }));
}

/* Recent activity derived from the content-free usage rollup (most recent days). */
export type ActivityItem = { when: string; label: string; text: string };
export async function getRecentActivity(userId: string | null, limit = 6): Promise<ActivityItem[]> {
  if (!userId || !isDbConfigured()) return [];
  const rows = await getDb().select().from(schema.usageRollup).where(eq(schema.usageRollup.subjectId, userId));
  return rows
    .sort((a, b) => (a.day < b.day ? 1 : -1))
    .slice(0, limit)
    .map((r) => ({
      when: r.day.slice(5),
      label: prettyBackend(r.backend),
      text: `${r.sessions} session${r.sessions === 1 ? "" : "s"} · ${fmtTokens(r.tokensIn + r.tokensOut)} tokens`,
    }));
}
