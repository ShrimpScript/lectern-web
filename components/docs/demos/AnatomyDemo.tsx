"use client";
/* Run anatomy, annotated: the stream builds up while labels point at each
   element; then Clean mode sweeps machinery into one strip. */
import { useRef } from "react";
import { Stage, usePhases } from "./rig";

// 0 idle · 1 recall · 2 plan · 3 diff · 4 usage · 5 labels · 6 clean sweep · 7 hold
const STEPS = [700, 900, 900, 900, 800, 1700, 1300, 2000] as const;

function Note({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", color: "var(--fg)", border: "1px solid var(--fg)", borderRadius: 5, padding: "2px 7px", opacity: on ? 1 : 0, transform: on ? "none" : "translateX(-6px)", transition: "all .35s ease", whiteSpace: "nowrap" }}>{children}</span>;
}

export function AnatomyDemo() {
  const [p, ref] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const clean = p >= 6;
  const label = p === 5 || p === 6;
  const row = (on: boolean): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: 10, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)", transition: "all .35s ease" });
  return (
    <div ref={ref}>
      <Stage label="reading a run — then Clean mode" stageRef={stageRef} height={280}>
        <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
          {!clean ? (
            <>
              <div style={row(p >= 1)}>
                <span className="mono" style={{ color: "var(--fg2)", border: "1px solid var(--bd)", borderRadius: 6, padding: "3px 8px" }}>◍ Memory · recalled 3 files</span>
                <Note on={label}>brain recall</Note>
              </div>
              <div style={row(p >= 2)}>
                <span style={{ border: "1px solid var(--bd)", borderRadius: 8, padding: "6px 10px", background: "var(--elev)", color: "var(--fg-soft)" }}>Plan · ✓ read store &nbsp;✓ write pref &nbsp;• test</span>
                <Note on={label}>live plan</Note>
              </div>
              <div style={row(p >= 3)}>
                <span className="mono" style={{ color: "var(--fg2)" }}>✎ lib/theme.ts <span style={{ color: "#3f9d63" }}>+9</span> <span style={{ color: "#c25a68" }}>−1</span></span>
                <Note on={label}>diff chip → click for full view</Note>
              </div>
              <div style={row(p >= 4)}>
                <span className="mono" style={{ color: "var(--fg-dim)", fontSize: 11.5 }}>· 12.4k in / 1.1k out tokens</span>
                <Note on={label}>usage</Note>
              </div>
            </>
          ) : (
            <div style={{ ...row(true), border: "1px dashed var(--bd)", borderRadius: 9, padding: "7px 11px", color: "var(--fg-dim)" }}>
              <span style={{ fontSize: 10 }}>▸</span>
              <span className="mono" style={{ fontSize: 11.5 }}>4 steps · memory + plan + 1 edit + usage</span>
              <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 700, color: "var(--fg)" }}>Clean mode — machinery folds to one strip</span>
            </div>
          )}
          <div style={{ marginTop: "auto", fontSize: 13.5, color: "var(--fg-soft)" }}>
            Done — the toggle persists across restarts.
          </div>
        </div>
      </Stage>
    </div>
  );
}
