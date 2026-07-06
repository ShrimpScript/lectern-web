"use client";
/* A /conduct run routing itself: goal → three steps, each stamped with the
   model it routed to, two in parallel, cross-review badge from a different
   provider on the merged diff. Mirrors the real Conductor flow. */
import { useRef } from "react";
import { Stage, usePhases } from "./rig";

// 0 idle · 1 goal · 2 steps appear · 3 route stamps · 4 two run · 5 done+step3 · 6 review · 7 hold
const STEPS = [700, 900, 900, 1000, 1300, 1100, 900, 2000] as const;
const PLAN = [
  { t: "Design the schema + API surface", m: "Opus 4.8", by: "claude-code" },
  { t: "Build the settings UI", m: "Gemini 3.5 Flash", by: "antigravity" },
  { t: "Wire routes + tests", m: "Sonnet 4.6", by: "claude-code" },
];

export function ConductDemo() {
  const [p, ref] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const running = (i: number) => (p === 4 && i < 2) || (p === 5 && i === 2);
  const done = (i: number) => (p >= 5 && i < 2) || (p >= 6 && i === 2);
  return (
    <div ref={ref}>
      <Stage label="the Conductor routes each step" stageRef={stageRef} height={300}>
        <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ alignSelf: "flex-end", border: "1px solid var(--bd)", borderRadius: 12, padding: "7px 12px", fontSize: 13, background: "var(--elev)", opacity: p >= 1 ? 1 : 0, transition: "opacity .3s" }}>
            <span className="mono" style={{ fontSize: 10.5, border: "1px solid var(--bd)", borderRadius: 5, padding: "1px 6px", marginRight: 8, color: "var(--fg2)" }}>/conduct</span>
            build user settings end-to-end
          </div>
          {PLAN.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--bd)", borderRadius: 10, padding: "8px 12px", background: "var(--elev)", opacity: p >= 2 ? 1 : 0, transform: p >= 2 ? "none" : "translateY(8px)", transition: `all .35s ease ${i * 0.09}s` }}>
              <span style={{ fontSize: 12, width: 16, color: done(i) ? "var(--fg)" : "var(--fg-dim)" }}>{done(i) ? "✓" : running(i) ? "◐" : "•"}</span>
              <span style={{ flex: 1, fontSize: 13, color: "var(--fg-soft)" }}>{s.t}</span>
              <span className="mono" style={{ fontSize: 10.5, border: "1px solid var(--bd)", borderRadius: 5, padding: "2px 7px", color: "var(--fg2)", opacity: p >= 3 ? 1 : 0, transition: "opacity .3s" }}>
                ⇄ {s.m} <span style={{ color: "var(--fg-dim)" }}>· {s.by}</span>
              </span>
              {i < 2 && <span className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", opacity: p === 4 ? 1 : 0, transition: "opacity .3s" }}>worktree {i + 1}</span>}
            </div>
          ))}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, opacity: p >= 6 ? 1 : 0, transform: p >= 6 ? "none" : "translateY(6px)", transition: "all .35s ease" }}>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--fg2)" }}>✎ 6 files · <span style={{ color: "#3f9d63" }}>+184</span> <span style={{ color: "#c25a68" }}>−22</span></span>
            <span className="mono" style={{ fontSize: 10.5, fontWeight: 700, border: "1px solid var(--fg)", borderRadius: 5, padding: "2px 8px" }}>cross-reviewed · antigravity ✓</span>
          </div>
        </div>
      </Stage>
    </div>
  );
}
