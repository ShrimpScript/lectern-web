"use client";
/* Cross-surface sessions: a run happens in the TUI (left); the desktop
   sidebar (right) gains the chat in real time; a rename in the app flows
   back to the TUI title. One store, two views — exactly how it works. */
import { useEffect, useRef } from "react";
import { CursorArrow, Stage, Typer, useCursor, usePhases } from "./rig";

// 0 idle · 1 tui-type · 2 tui-run · 3 tui-done · 4 chat-appears · 5 cursor→row · 6 renamed · 7 tui-title-updates · 8 hold
const STEPS = [700, 1600, 1200, 700, 900, 900, 800, 900, 1800] as const;
const TASK = "fix the login redirect";

export function CrossSurfaceDemo() {
  const [p, ref, reduced] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cur = useCursor(stageRef);
  const rowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!reduced && p === 5) cur.moveTo(rowRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, reduced]);
  const renamed = p >= 6;
  const title = renamed ? "login redirect fix" : TASK;
  return (
    <div ref={ref}>
      <Stage label="one session, every surface" stageRef={stageRef} height={300}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
          {/* TUI pane */}
          <div className="mono" style={{ background: "#101013", color: "#cfcfca", padding: "14px 16px", fontSize: 11.5, lineHeight: 1.75, borderRight: "1px solid var(--bd)" }}>
            <div style={{ color: "#77776f" }}>⌊⌋ lectern · <span style={{ color: p >= 7 ? "#f4f4f2" : "#77776f", transition: "color .3s" }}>{p >= 7 ? title : p >= 1 ? "new session" : "new session"}</span> · api</div>
            <div style={{ marginTop: 8 }}>
              {p >= 1 && <div><span style={{ color: "#f4f4f2" }}>you · </span><Typer text={TASK} on={p === 1} done={p > 1} speed={40} /></div>}
              {p >= 2 && <div style={{ color: "#77776f" }}>✓ recalled 2 file(s): auth.ts, routes.ts</div>}
              {p >= 2 && <div style={{ color: "#b9b9b4" }}>Plan · ✓ trace redirect ✓ patch session refresh</div>}
              {p >= 3 && <div><span style={{ color: "#9a9a96" }}>✎ src/auth.ts</span> <span style={{ color: "#9fe0ad" }}>+11</span> <span style={{ color: "#e58a97" }}>−3</span></div>}
              {p >= 3 && <div style={{ color: "#77776f" }}>done · 1 change(s)</div>}
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 16, color: "#77776f" }}>auto · plan · ctx 2%</div>
          </div>
          {/* Desktop sidebar pane */}
          <div style={{ padding: "14px 14px", fontSize: 12.5 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 8 }}>Chats — desktop app</div>
            {[{ t: "ship checkout flow", when: "2h" }, { t: "hows it going", when: "1d" }].map((c) => (
              <div key={c.t} style={{ display: "flex", justifyContent: "space-between", padding: "7px 9px", borderRadius: 8, color: "var(--fg-soft)" }}>
                <span>{c.t}</span><span style={{ fontSize: 11, color: "var(--fg-dim)" }}>{c.when}</span>
              </div>
            ))}
            <div ref={rowRef}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 9px", borderRadius: 8, background: "var(--hov, var(--elev))", border: "1px solid var(--bd)", opacity: p >= 4 ? 1 : 0, transform: p >= 4 ? "none" : "translateX(14px)", transition: "all .4s cubic-bezier(.3,1,.4,1)" }}>
              <span style={{ fontWeight: renamed ? 650 : 450 }}>
                {renamed ? <Typer text="login redirect fix" on={p === 6} done={p > 6} speed={36} /> : TASK}
              </span>
              <span style={{ fontSize: 11, color: "var(--fg-dim)" }}>now</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--fg-dim)", opacity: p >= 7 ? 1 : 0, transition: "opacity .35s" }}>
              Renamed here → the TUI title followed. One store underneath.
            </div>
          </div>
        </div>
        <CursorArrow pos={cur.pos} pressed={p === 6} />
      </Stage>
    </div>
  );
}
