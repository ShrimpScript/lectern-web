"use client";
/* The Apply gate: three proposed files, the cursor unchecks one, applies —
   only accepted files land. 'Nothing writes without you.' */
import { useEffect, useRef } from "react";
import { CursorArrow, Stage, useCursor, usePhases } from "./rig";

// 0 idle · 1 cards in · 2 hover file2 · 3 uncheck · 4 hover apply · 5 applied · 6 hold
const STEPS = [800, 1100, 800, 600, 900, 900, 1600] as const;
const FILES = [
  { name: "app/settings.tsx", add: 42, rm: 4 },
  { name: "lib/theme.ts", add: 18, rm: 0 },
  { name: "app/router.tsx", add: 6, rm: 1 },
];

export function ApplyGateDemo() {
  const [p, ref, reduced] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cur = useCursor(stageRef);
  const row2 = useRef<HTMLDivElement | null>(null);
  const applyBtn = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (reduced) return;
    if (p === 2) cur.moveTo(row2.current, -8, 0);
    if (p === 4) cur.moveTo(applyBtn.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, reduced]);
  const excluded = p >= 3;
  const applied = p >= 5;
  return (
    <div ref={ref}>
      <Stage label="the Apply gate" stageRef={stageRef} height={280}>
        <div style={{ position: "absolute", inset: 0, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--fg-dim)", marginBottom: 2 }}>Proposed changes — nothing on disk yet</div>
          {FILES.map((f, i) => {
            const off = i === 1 && excluded;
            const stamped = applied && !off;
            return (
              <div key={f.name} ref={i === 1 ? row2 : undefined}
                style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--bd)", borderRadius: 10, padding: "9px 12px", background: "var(--elev)", opacity: p >= 1 ? (off ? 0.45 : 1) : 0, transform: p >= 1 ? "none" : "translateY(8px)", transition: `all .35s ease ${i * 0.08}s` }}>
                <span style={{ width: 15, height: 15, borderRadius: 4, border: "1.5px solid var(--fg2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, background: off ? "transparent" : "var(--fg)", color: "var(--bg)", transition: "all .2s ease" }}>{off ? "" : "✓"}</span>
                <span className="mono" style={{ fontSize: 12.5, flex: 1 }}>{f.name}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "#3f9d63" }}>+{f.add}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "#c25a68" }}>−{f.rm}</span>
                <span className="mono" style={{ fontSize: 10.5, fontWeight: 700, color: stamped ? "var(--fg)" : "transparent", border: stamped ? "1px solid var(--fg)" : "1px solid transparent", borderRadius: 5, padding: "2px 7px", transition: "all .25s ease" }}>applied</span>
              </div>
            );
          })}
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--fg-dim)", opacity: applied ? 1 : 0, transition: "opacity .3s ease" }}>
              2 of 3 files written — the unchecked one stayed a proposal.
            </span>
            <button ref={applyBtn} style={{ fontSize: 12.5, fontWeight: 700, padding: "7px 16px", borderRadius: 8, border: "1px solid var(--fg)", background: applied ? "var(--fg)" : "transparent", color: applied ? "var(--bg)" : "var(--fg)", transition: "all .25s ease", fontFamily: "inherit" }}>
              {applied ? "Applied ✓" : "Apply selected"}
            </button>
          </div>
        </div>
        <CursorArrow pos={cur.pos} pressed={p === 3 || p === 5} />
      </Stage>
    </div>
  );
}
