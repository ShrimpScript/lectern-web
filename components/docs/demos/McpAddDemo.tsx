"use client";
/* One MCP add, three harnesses: pick Postgres, paste the connection string,
   Add — CC/OC/AG chips light in sequence, then /mcp shows it connected. */
import { useEffect, useRef } from "react";
import { CursorArrow, Stage, Typer, useCursor, usePhases } from "./rig";

// 0 idle · 1 row hover · 2 form open · 3 paste · 4 click add · 5 cc · 6 oc · 7 ag · 8 /mcp line · 9 hold
const STEPS = [800, 700, 800, 1300, 600, 500, 500, 600, 1200, 2000] as const;
const CHIPS = ["Claude Code", "OpenCode", "Antigravity"];

export function McpAddDemo() {
  const [p, ref, reduced] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cur = useCursor(stageRef);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const addRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (reduced) return;
    if (p === 1) cur.moveTo(rowRef.current);
    if (p === 4) cur.moveTo(addRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, reduced]);
  const lit = (i: number) => p >= 5 + i;
  return (
    <div ref={ref}>
      <Stage label="one add registers everywhere" stageRef={stageRef} height={290}>
        <div style={{ position: "absolute", inset: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
          <div ref={rowRef} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--bd)", borderRadius: 10, padding: "9px 12px", background: p >= 1 ? "var(--hov, var(--elev))" : "var(--elev)", transition: "background .25s" }}>
            <span style={{ fontWeight: 700 }}>Postgres</span>
            <span style={{ fontSize: 11.5, color: "var(--fg-dim)" }}>query your database from any chat</span>
            <span className="mono" style={{ marginLeft: "auto", fontSize: 10.5, border: "1px solid var(--bd)", borderRadius: 5, padding: "2px 7px", color: "var(--fg2)" }}>verified</span>
          </div>
          <div style={{ border: "1px solid var(--bd)", borderRadius: 10, padding: "10px 12px", background: "var(--elev)", opacity: p >= 2 ? 1 : 0, transform: p >= 2 ? "none" : "translateY(6px)", transition: "all .3s ease" }}>
            <div style={{ fontSize: 11, color: "var(--fg-dim)", marginBottom: 5 }}>Connection string</div>
            <div className="mono" style={{ fontSize: 11.5, border: "1px solid var(--bd2)", borderRadius: 7, padding: "6px 9px", color: "var(--fg-soft)" }}>
              {p >= 3 ? <Typer text="postgresql://app:•••@localhost:5432/acme" on={p === 3} done={p > 3} speed={22} /> : <span style={{ color: "var(--fg-ghost)" }}>postgresql://…</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
              {CHIPS.map((c, i) => (
                <span key={c} className="mono" style={{ fontSize: 10.5, fontWeight: 700, border: `1px solid ${lit(i) ? "var(--fg)" : "var(--bd)"}`, color: lit(i) ? "var(--fg)" : "var(--fg-dim)", borderRadius: 5, padding: "2px 8px", transition: "all .25s ease" }}>
                  {lit(i) ? "✓ " : ""}{c}
                </span>
              ))}
              <button ref={addRef} style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--fg)", background: p >= 5 ? "var(--fg)" : "transparent", color: p >= 5 ? "var(--bg)" : "var(--fg)", transition: "all .25s", fontFamily: "inherit" }}>
                {p >= 7 ? "Added ✓" : "Add"}
              </button>
            </div>
          </div>
          <div className="mono" style={{ marginTop: "auto", fontSize: 12, color: "var(--fg2)", opacity: p >= 8 ? 1 : 0, transition: "opacity .35s" }}>
            <span style={{ color: "var(--fg-dim)" }}>/mcp</span> → <strong>postgres</strong> — ✓ connected · target it with <span style={{ color: "var(--fg-dim)" }}>/mcp postgres</span>
          </div>
        </div>
        <CursorArrow pos={cur.pos} pressed={p === 4} />
      </Stage>
    </div>
  );
}
