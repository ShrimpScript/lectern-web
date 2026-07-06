"use client";
/* The TUI's rhythm: /sessions fuzzy-filters live, enter opens with full
   anatomy, ^X m flips the model — the real registry, the real keys. */
import { useRef } from "react";
import { Stage, Typer, usePhases } from "./rig";

// 0 idle · 1 type /se · 2 dialog+filter · 3 enter/open · 4 anatomy · 5 ^X · 6 m-dialog · 7 picked · 8 hold
const STEPS = [800, 1000, 1300, 700, 1500, 700, 1100, 800, 1800] as const;
const SESSIONS = ["settings dark-mode", "seed the database", "search endpoint"];

export function TuiDemo() {
  const [p, ref] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const q = p >= 2 ? "se" : "";
  const rows = SESSIONS.filter((s) => s.includes(q));
  return (
    <div ref={ref}>
      <Stage label="the TUI in 20 seconds" stageRef={stageRef} height={310}>
        <div className="mono" style={{ position: "absolute", inset: 0, background: "#101013", color: "#cfcfca", padding: "14px 16px", fontSize: 11.5, lineHeight: 1.8 }}>
          <div style={{ color: "#77776f" }}>⌊⌋ lectern · {p >= 3 ? "settings dark-mode" : "new session"} · web</div>

          {/* conversation after open */}
          {p >= 4 && (
            <div style={{ marginTop: 6 }}>
              <div><span style={{ color: "#f4f4f2" }}>you · </span>make the toggle persist</div>
              <div style={{ color: "#77776f" }}>✓ recalled 1 file(s): theme.ts</div>
              <div style={{ color: "#b9b9b4" }}>Plan · ✓ read store ✓ write pref</div>
              <div><span style={{ color: "#9a9a96" }}>✎ lib/theme.ts</span> <span style={{ color: "#9fe0ad" }}>+9</span> <span style={{ color: "#e58a97" }}>−1</span></div>
              <div style={{ color: "#77776f" }}>done · 1 change(s)</div>
            </div>
          )}

          {/* sessions dialog */}
          {(p === 2 || p === 1) && (
            <div style={{ position: "absolute", left: 40, top: 44, width: 320, border: "1px solid #333338", background: "#161618", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ color: "#77776f", fontSize: 10.5 }}>sessions — type to filter · ↑↓ · enter</div>
              <div style={{ color: "#b9b9b4", margin: "5px 0" }}>▸ <Typer text="se" on={p === 2} done={false} speed={220} />▏</div>
              {rows.map((s, i) => (
                <div key={s} style={{ padding: "2px 6px", background: i === 0 && p >= 2 ? "#1d1d20" : "transparent", color: i === 0 ? "#f4f4f2" : "#b9b9b4", borderRadius: 4 }}>
                  {i === 0 ? "★ " : "  "}{s}<span style={{ color: "#77776f" }}>  · mock</span>
                </div>
              ))}
            </div>
          )}

          {/* model dialog after ^X m */}
          {p === 6 && (
            <div style={{ position: "absolute", left: 60, top: 60, width: 300, border: "1px solid #333338", background: "#161618", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ color: "#77776f", fontSize: 10.5 }}>models — type to filter · enter</div>
              <div style={{ padding: "2px 6px", background: "#1d1d20", color: "#f4f4f2", borderRadius: 4 }}>Fable 5 <span style={{ color: "#77776f" }}>· claude-code</span></div>
              <div style={{ padding: "2px 6px", color: "#b9b9b4" }}>Opus 4.8 <span style={{ color: "#77776f" }}>· claude-code</span></div>
              <div style={{ padding: "2px 6px", color: "#b9b9b4" }}>Gemini 3.5 Flash <span style={{ color: "#77776f" }}>· antigravity</span></div>
            </div>
          )}

          {/* status bar */}
          <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, display: "flex", justifyContent: "space-between", color: "#77776f" }}>
            <span><span style={{ color: p >= 7 ? "#f4f4f2" : "#77776f", transition: "color .3s" }}>{p >= 7 ? "Fable 5" : "auto"}</span> · plan · ctx 1%</span>
            <span>{p === 5 ? <span style={{ color: "#e0b34d" }}>^X — s sessions · m models · d diffs…</span> : p >= 1 && p < 3 ? "/sessions" : "ready"}</span>
          </div>
        </div>
      </Stage>
    </div>
  );
}
