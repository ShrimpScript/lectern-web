"use client";
/* The 60-second tour, compressed: type a task → plan fills → diff lands →
   Apply gate → done line. Mirrors the app's real anatomy (plan card ✓s,
   diff chip tints, composer chrome). */
import { useEffect, useRef } from "react";
import { CursorArrow, Stage, Typer, useCursor, usePhases } from "./rig";

const TASK = "add a dark-mode toggle to settings";
// phases: 0 idle · 1 type · 2 send · 3 plan1 · 4 plan2 · 5 diff · 6 apply-hover · 7 applied · 8 done
const STEPS = [900, 1900, 500, 900, 900, 1100, 900, 700, 1400] as const;

export function TourDemo() {
  const [p, ref, reduced] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cur = useCursor(stageRef);
  const applyRef = useRef<HTMLButtonElement | null>(null);
  const sendRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (reduced) return;
    if (p === 2) cur.moveTo(sendRef.current);
    if (p === 6) cur.moveTo(applyRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, reduced]);
  const show = (from: number, o = 1) => ({ opacity: p >= from ? o : 0, transform: p >= from ? "none" : "translateY(6px)", transition: "opacity .35s ease, transform .35s ease" });
  return (
    <div ref={ref}>
      <Stage label="one turn, end to end" stageRef={stageRef} height={330}>
        <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* user bubble */}
          <div style={{ alignSelf: "flex-end", maxWidth: "78%", border: "1px solid var(--bd)", borderRadius: 12, padding: "8px 12px", fontSize: 13.5, background: "var(--elev)", ...(p >= 2 ? {} : { opacity: 0 }) , transition: "opacity .3s ease" }}>
            {TASK}
          </div>
          {/* plan card */}
          <div style={{ maxWidth: 420, border: "1px solid var(--bd)", borderRadius: 12, padding: "10px 14px", background: "var(--elev)", ...show(3) }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--fg-dim)", marginBottom: 6 }}>PLAN</div>
            <div style={{ fontSize: 13, display: "grid", gap: 4, color: "var(--fg-soft)" }}>
              <span>{p >= 4 ? "✓" : "•"} Create ThemeContext + toggle</span>
              <span>{p >= 5 ? "✓" : "•"} Wire into settings page</span>
              <span style={{ opacity: p >= 4 ? 1 : 0.45 }}>{p >= 6 ? "✓" : "•"} Persist preference</span>
            </div>
          </div>
          {/* diff chip */}
          <div className="mono" style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--fg2)", ...show(5) }}>
            <span style={{ border: "1px solid var(--bd)", borderRadius: 6, padding: "3px 8px" }}>✎ app/settings.tsx</span>
            <span style={{ color: "#3f9d63" }}>+42</span>
            <span style={{ color: "#c25a68" }}>−4</span>
            <button ref={applyRef} style={{ marginLeft: 6, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 7, border: "1px solid var(--fg)", background: p >= 7 ? "var(--fg)" : "transparent", color: p >= 7 ? "var(--bg)" : "var(--fg)", transition: "all .25s ease", fontFamily: "inherit" }}>
              {p >= 7 ? "Applied ✓" : "Apply"}
            </button>
          </div>
          {/* done line */}
          <div style={{ fontSize: 13.5, color: "var(--fg-soft)", ...show(8) }}>
            Done — dark mode persists across restarts. <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-dim)" }}>· 12.4k in / 1.1k out</span>
          </div>
          {/* composer */}
          <div style={{ marginTop: "auto", border: "1px solid var(--bd)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, background: "var(--elev)" }}>
            <span style={{ flex: 1, fontSize: 13.5, color: p >= 1 && p < 2 ? "var(--fg)" : "var(--fg-dim)" }}>
              {p >= 2 ? <span style={{ color: "var(--fg-dim)" }}>Describe a task…</span> : p >= 1 ? <Typer text={TASK} on={p === 1} done={false} /> : "Describe a task…"}
            </span>
            <span ref={sendRef} style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--fg)", color: "var(--bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, transform: p === 2 ? "scale(.85)" : "scale(1)", transition: "transform .18s ease" }}>↑</span>
          </div>
        </div>
        <CursorArrow pos={cur.pos} pressed={p === 2 || p === 7} />
      </Stage>
    </div>
  );
}
