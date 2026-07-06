"use client";
import { useMemo, useState } from "react";
import type { MarketItem, MarketItemType } from "@/lib/marketplace";

const TYPE_LABEL: Record<MarketItemType, string> = { skill: "Skill", function: "Function", mcp: "MCP server" };
const FILTERS = ["all", "skill", "function", "mcp"] as const;
type Filter = (typeof FILTERS)[number];

export function MarketplaceList({ items }: { items: MarketItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (it) => (filter === "all" || it.type === filter) && (!needle || it.slug.toLowerCase().includes(needle)),
    );
  }, [items, filter, q]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div className="mono" style={{ display: "flex", gap: 4, background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 9, padding: 3, fontSize: 12 }}>
          {FILTERS.map((f) => (
            <span
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                textTransform: "capitalize",
                background: filter === f ? "var(--panel2)" : "transparent",
                color: filter === f ? "var(--fg)" : "var(--fg-mute)",
              }}
            >
              {f === "mcp" ? "MCP" : f}
            </span>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="mono"
          style={{ flex: "0 1 240px", border: "1px solid var(--bd)", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "var(--fg)", background: "var(--panel)", outline: "none" }}
        />
      </div>

      {items.length === 0 ? (
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-dim)", padding: "28px 0", lineHeight: 1.6 }}>Nothing published yet — the marketplace is just getting started. Skills you build in Lectern can be shared here.</div>
      ) : shown.length === 0 ? (
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-dim)", padding: "20px 0" }}>No matches for your search.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {shown.map((it) => (
            <div key={it.slug} style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 18, background: "var(--elev)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-mute)", border: "1px solid var(--bd2)", borderRadius: 6, padding: "2px 7px" }}>
                  {TYPE_LABEL[it.type]}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{it.installs.toLocaleString()} installs</span>
              </div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", wordBreak: "break-all" }}>{it.slug}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <span style={{ fontSize: 12, color: "var(--fg-mute)" }}>{it.author ? `by ${it.author}` : "community"}</span>
                {it.latest && <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>v{it.latest}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
