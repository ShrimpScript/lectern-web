"use client";

import { useMemo, useState } from "react";

export type HubEntry = {
  id: string;
  name: string;
  description: string;
  triggers?: string[];
  author?: string;
  kind?: string;
  official?: boolean;
  external?: boolean;
  publisher?: string;
  source_url?: string;
};

type Tier = "official" | "ecosystem" | "community";

function tierOf(e: HubEntry): Tier {
  if (e.external) return "ecosystem";
  if (e.official) return "official";
  return "community";
}

/* External collections arrive named like "Anthropic — official Claude skills";
   the publisher is shown on the card already, so drop the redundant prefix. */
function displayName(e: HubEntry): string {
  if (e.external && e.publisher) {
    const p = e.name.split("—");
    if (p.length > 1 && p[0].trim().toLowerCase() === e.publisher.toLowerCase()) {
      const rest = p.slice(1).join("—").trim();
      return rest.charAt(0).toUpperCase() + rest.slice(1);
    }
  }
  return e.name;
}

const SECTIONS: { tier: Tier; title: string; sub: string }[] = [
  { tier: "official", title: "Official", sub: "maintained with Lectern, installed by id" },
  { tier: "ecosystem", title: "Collections", sub: "public skill sets Lectern picks up automatically" },
  { tier: "community", title: "Community", sub: "published by pull request, content-addressed" },
];

function Card({ e }: { e: HubEntry }) {
  return (
    <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: "18px 18px 16px", background: "var(--elev)", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.35, flex: 1, minWidth: 0 }}>{displayName(e)}</div>
        {e.external && e.publisher && (
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--fg-soft)", border: "1px solid var(--bd2)", borderRadius: 999, padding: "2px 9px", background: "var(--chrome)", flexShrink: 0 }}>
            {e.publisher}
          </span>
        )}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-soft)", flex: 1 }}>{e.description}</div>
      {e.external && e.source_url ? (
        <a
          href={e.source_url}
          target="_blank"
          rel="noreferrer"
          className="mono"
          style={{ fontSize: 12.5, color: "var(--fg2)", background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 6, padding: "3px 8px", alignSelf: "flex-start" }}
        >
          github.com/{(e.source_url.split("github.com/")[1] ?? "").replace(/\/$/, "")} ↗
        </a>
      ) : (
        <code style={{ fontSize: 12.5, color: "var(--fg2)", background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 6, padding: "3px 8px", alignSelf: "flex-start" }}>
          lectern skills install {e.id}
        </code>
      )}
    </div>
  );
}

export function HubBrowser({ entries }: { entries: HubEntry[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const shown = useMemo(() => {
    if (!needle) return entries;
    return entries.filter((e) => {
      const hay = [e.id, e.name, e.description, e.publisher ?? "", e.author ?? "", e.kind ?? "", ...(e.triggers ?? [])].join(" ").toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [entries, needle]);

  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 };

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the Hub — try “commit”, “anthropic”, “react”…"
        aria-label="Search hub entries"
        style={{
          width: "100%", padding: "13px 16px", fontSize: 15, borderRadius: 12,
          border: "1px solid var(--bd2)", background: "var(--elev)", color: "var(--fg)",
          outline: "none", marginBottom: 26, boxSizing: "border-box",
        }}
      />

      {needle ? (
        /* searching → one flat result grid */
        <div style={grid}>
          {shown.map((e) => <Card key={e.id} e={e} />)}
        </div>
      ) : (
        /* browsing → grouped by what the tiers actually mean */
        SECTIONS.map(({ tier, title, sub }) => {
          const group = entries.filter((e) => tierOf(e) === tier);
          if (group.length === 0) return null;
          return (
            <section key={tier} style={{ marginBottom: 30 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg2)" }}>{title}</h3>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-ghost)" }}>{group.length}</span>
                <span style={{ fontSize: 12.5, color: "var(--fg-dim)" }}>{sub}</span>
              </div>
              <div style={grid}>
                {group.map((e) => <Card key={e.id} e={e} />)}
              </div>
            </section>
          );
        })
      )}

      {needle && shown.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--fg-soft)", fontSize: 14.5 }}>
          Nothing matches “{q}” — try a broader term, or browse everything on{" "}
          <a href="https://github.com/ShrimpScript/lectern-hub" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>GitHub</a>.
        </div>
      )}
    </div>
  );
}
