"use client";
import { useState } from "react";
import { dashboard } from "@/lib/data/content";

const METRICS = ["Tokens", "Sessions", "Cost"] as const;
type Metric = (typeof METRICS)[number];

/* When `series` is provided it's treated as the user's REAL per-day token data
   (an empty / all-zero series renders an honest empty state). When omitted, a
   sample series is shown for marketing/demo surfaces. */
export function UsageChart({ series }: { series?: number[] }) {
  const [metric, setMetric] = useState<Metric>("Tokens");
  const isReal = series !== undefined;
  const base = series ?? dashboard.usageSeries;
  const empty = isReal && (base.length === 0 || base.every((v) => v === 0));

  const scaled = base.map((h) =>
    metric === "Sessions" ? Math.max(8, Math.round(h * 0.8)) : metric === "Cost" ? Math.round(h * 0.65) : h,
  );
  const peak = Math.max(1, ...scaled);

  return (
    <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 22, background: "var(--elev)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 17 }}>Usage over time</div>
        <div
          className="mono"
          style={{ display: "flex", gap: 4, background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 8, padding: 3, fontSize: 12 }}
        >
          {METRICS.map((m) => (
            <span
              key={m}
              onClick={() => setMetric(m)}
              style={{
                padding: "5px 10px",
                borderRadius: 5,
                cursor: "pointer",
                background: metric === m ? "var(--panel2)" : "transparent",
                color: metric === m ? "var(--fg)" : "var(--fg-mute)",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {empty ? (
        <div style={{ height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 6 }}>
          <div style={{ fontSize: 14, color: "var(--fg-mute)", fontWeight: 600 }}>No usage data yet</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>Run a session through the engine and it&apos;ll appear here.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 140 }}>
            {scaled.map((h, i) => {
              const isPeak = h === peak;
              return (
                <div
                  key={i}
                  title={`${metric}: ${h}`}
                  style={{
                    flex: 1,
                    height: `${Math.round((h / peak) * 100)}%`,
                    background: isPeak
                      ? "linear-gradient(180deg,#f4f4f2,#9a9a95)"
                      : "linear-gradient(180deg,#3a3a3d,#1c1c1f)",
                    borderRadius: "3px 3px 0 0",
                    transition: "height .3s ease",
                  }}
                />
              );
            })}
          </div>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--fg-ghost)" }}>
            {isReal ? (
              <span style={{ width: "100%", textAlign: "center" }}>{base.length} day{base.length === 1 ? "" : "s"} of activity</span>
            ) : (
              <>
                <span>Jun 1</span>
                <span>Jun 12</span>
                <span>Jun 24</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
