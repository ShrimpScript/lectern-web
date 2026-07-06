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

function tierOf(e: HubEntry): "official" | "ecosystem" | "community" {
  if (e.external) return "ecosystem";
  if (e.official) return "official";
  return "community";
}

const TIER_LABEL = { official: "official", ecosystem: "ecosystem", community: "community" } as const;
const TIER_BG = { official: "var(--chrome)", ecosystem: "var(--elev)", community: "var(--elev)" } as const;

export function HubBrowser({ entries }: { entries: HubEntry[] }) {
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((e) => {
      const hay = [e.id, e.name, e.description, e.publisher ?? "", e.author ?? "", e.kind ?? "", ...(e.triggers ?? [])].join(" ").toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [entries, q]);

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
          outline: "none", marginBottom: 22, boxSizing: "border-box",
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
        {shown.map((e) => {
          const tier = tierOf(e);
          return (
            <div key={e.id} style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: "18px 18px 16px", background: "var(--elev)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15.5, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--fg-soft)", border: "1px solid var(--bd2)", borderRadius: 999, padding: "2px 9px", background: TIER_BG[tier], flexShrink: 0 }}>
                  {e.external ? (e.publisher ?? TIER_LABEL[tier]) : TIER_LABEL[tier]}
                </span>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-soft)", flex: 1 }}>{e.description}</div>
              {e.external && e.source_url ? (
                <a href={e.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "var(--fg2)" }}>
                  View source on GitHub →
                </a>
              ) : (
                <code style={{ fontSize: 12.5, color: "var(--fg2)", background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 6, padding: "3px 8px", alignSelf: "flex-start" }}>
                  lectern skills install {e.id}
                </code>
              )}
            </div>
          );
        })}
      </div>
      {shown.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--fg-soft)", fontSize: 14.5 }}>
          Nothing matches “{q}” — try a broader term, or browse everything on{" "}
          <a href="https://github.com/ShrimpScript/lectern-hub" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>GitHub</a>.
        </div>
      )}
    </div>
  );
}
