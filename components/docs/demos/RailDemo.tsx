"use client";
/* Preview rail: an edit lands → the Preview pill ticks up → cursor pins the
   file → rendered markdown updates on the next edit WITHOUT stealing focus. */
import { useEffect, useRef } from "react";
import { CursorArrow, Stage, useCursor, usePhases } from "./rig";

// 0 idle · 1 edit1 · 2 pill ticks · 3 cursor→tab · 4 open+pin · 5 edit2 arrives · 6 content updates, no jump · 7 hold
const STEPS = [800, 900, 700, 800, 1000, 900, 1100, 2000] as const;

export function RailDemo() {
  const [p, ref, reduced] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cur = useCursor(stageRef);
  const tabRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!reduced && p === 3) cur.moveTo(tabRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, reduced]);
  const count = p >= 5 ? 2 : p >= 2 ? 1 : 0;
  return (
    <div ref={ref}>
      <Stage label="the preview rail" stageRef={stageRef} height={290}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.15fr 1fr" }}>
          {/* chat side */}
          <div style={{ padding: "16px 18px", borderRight: "1px solid var(--bd)", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="mono" style={{ color: "var(--fg2)", opacity: p >= 1 ? 1 : 0, transition: "opacity .3s" }}>✎ README.md <span style={{ color: "#3f9d63" }}>+18</span> <span style={{ color: "#c25a68" }}>−2</span></div>
            <div className="mono" style={{ color: "var(--fg2)", opacity: p >= 5 ? 1 : 0, transition: "opacity .3s" }}>✎ README.md <span style={{ color: "#3f9d63" }}>+6</span> <span style={{ color: "#c25a68" }}>−0</span></div>
            <div style={{ marginTop: "auto", fontSize: 11.5, color: "var(--fg-dim)", opacity: p >= 6 ? 1 : 0, transition: "opacity .3s" }}>
              New edits update the pinned view — never steal it.
            </div>
          </div>
          {/* work panel side */}
          <div style={{ padding: "14px 14px", fontSize: 12 }}>
            <div style={{ display: "flex", gap: 10, fontSize: 11.5, color: "var(--fg-dim)", marginBottom: 10 }}>
              <span>Files</span><span>Agents</span>
              <span ref={tabRef} style={{ color: p >= 4 ? "var(--fg)" : "var(--fg-dim)", fontWeight: p >= 4 ? 700 : 400 }}>
                Preview{count > 0 && <span className="mono" style={{ marginLeft: 4, fontSize: 9.5, border: "1px solid var(--bd)", borderRadius: 4, padding: "1px 4px" }}>{count}</span>}
              </span>
            </div>
            {p >= 4 ? (
              <div style={{ border: "1px solid var(--bd)", borderRadius: 9, padding: "10px 12px", background: "var(--elev)" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", marginBottom: 6 }}>README.md · pinned</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Acme Web</div>
                <div style={{ color: "var(--fg-soft)", fontSize: 11.5, lineHeight: 1.6, marginTop: 3 }}>
                  Dark mode ships behind a persisted toggle.
                  {p >= 6 && <span style={{ display: "block", color: "var(--fg)", transition: "opacity .3s" }}>New: setup takes one command.</span>}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 11.5, color: "var(--fg-dim)", border: "1px dashed var(--bd)", borderRadius: 9, padding: "14px 12px", textAlign: "center" }}>
                Edited files and links appear here as the agent works.
              </div>
            )}
          </div>
        </div>
        <CursorArrow pos={cur.pos} pressed={p === 4} />
      </Stage>
    </div>
  );
}
