"use client";
/* Phone → PC round trip: a Telegram-style message tasks the agent; the
   cockpit runs it; the phone gets the ✅ with a diff summary. Allowlist
   framing included — that's the real security posture. */
import { useRef } from "react";
import { Stage, Typer, usePhases } from "./rig";

// 0 idle · 1 phone msg · 2 desktop run · 3 diff · 4 phone ✅ · 5 hold
const STEPS = [900, 1500, 1500, 1000, 1200, 2200] as const;

export function PhoneDemo() {
  const [p, ref] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={ref}>
      <Stage label="task your PC from your phone" stageRef={stageRef} height={300}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "230px 1fr", gap: 0 }}>
          {/* phone frame */}
          <div style={{ margin: "14px 0 14px 18px", border: "1px solid var(--bd)", borderRadius: 20, background: "var(--elev)", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 10, textAlign: "center", color: "var(--fg-dim)" }}>Telegram · Lectern</div>
            <div style={{ alignSelf: "flex-end", maxWidth: "88%", background: "var(--fg)", color: "var(--bg)", borderRadius: "12px 12px 3px 12px", padding: "6px 9px", fontSize: 11, opacity: p >= 1 ? 1 : 0, transition: "opacity .3s" }}>
              <Typer text="fix the failing auth test" on={p === 1} done={p > 1} speed={34} />
            </div>
            <div style={{ alignSelf: "flex-start", maxWidth: "92%", border: "1px solid var(--bd)", borderRadius: "12px 12px 12px 3px", padding: "6px 9px", fontSize: 11, color: "var(--fg-soft)", opacity: p >= 2 ? 1 : 0, transition: "opacity .3s" }}>
              On it — running on zeke-pc…
            </div>
            <div style={{ alignSelf: "flex-start", maxWidth: "92%", border: "1px solid var(--bd)", borderRadius: "12px 12px 12px 3px", padding: "6px 9px", fontSize: 11, color: "var(--fg-soft)", opacity: p >= 4 ? 1 : 0, transition: "opacity .3s" }}>
              ✅ Fixed — <span className="mono" style={{ fontSize: 10 }}>src/auth.ts +11 −3</span>, tests green.
            </div>
          </div>
          {/* desktop side */}
          <div style={{ padding: "16px 18px", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-dim)" }}>Your PC — the run happens here</div>
            <div style={{ opacity: p >= 2 ? 1 : 0, transition: "opacity .3s", display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="mono" style={{ color: "var(--fg2)", fontSize: 11.5 }}>◍ channel · telegram (allowlisted sender)</span>
              <span style={{ border: "1px solid var(--bd)", borderRadius: 9, padding: "6px 10px", background: "var(--elev)", alignSelf: "flex-start" }}>Plan · ✓ reproduce ✓ patch refresh</span>
              <span className="mono" style={{ color: "var(--fg2)", fontSize: 11.5, opacity: p >= 3 ? 1 : 0, transition: "opacity .3s" }}>✎ src/auth.ts <span style={{ color: "#3f9d63" }}>+11</span> <span style={{ color: "#c25a68" }}>−3</span> · $ npm test ✓</span>
            </div>
            <div style={{ marginTop: "auto", fontSize: 11, color: "var(--fg-dim)" }}>
              Only allowlisted senders get through — approvals happen in the CLI on this machine, never from a chat message.
            </div>
          </div>
        </div>
      </Stage>
    </div>
  );
}
