"use client";
/* Daemon round-trip: JSON-RPC piped into the socket on the left; AgentEvents
   tick back; the same session materializes in a desktop sidebar on the right. */
import { useRef } from "react";
import { Stage, usePhases } from "./rig";

// 0 idle · 1 request line · 2 events tick (3 sub-beats) · 3 result · 4 sidebar row · 5 hold
const STEPS = [800, 1100, 2100, 900, 900, 2100] as const;
const EVENTS = [
  '{"method":"event","params":{"type":"thought","summary":"planned"}}',
  '{"method":"event","params":{"type":"file_edit","path":"src/auth.ts"}}',
  '{"method":"event","params":{"type":"done"}}',
];

export function DaemonDemo() {
  const [p, ref] = usePhases(STEPS);
  const stageRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={ref}>
      <Stage label="one engine, any client" stageRef={stageRef} height={280}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.35fr 1fr" }}>
          <div className="mono" style={{ background: "#101013", color: "#cfcfca", padding: "13px 15px", fontSize: 10.5, lineHeight: 1.75, borderRight: "1px solid var(--bd)", overflow: "hidden" }}>
            <div style={{ color: "#77776f" }}>$ echo &#39;&#123;"method":"run","params":&#123;"prompt":"fix login"&#125;&#125;&#39; | nc -U …/lecternd.sock</div>
            {p >= 2 && EVENTS.map((e, i) => (
              <div key={i} style={{ color: "#9a9a96", opacity: 1, animation: `none` }}>{e}</div>
            ))}
            {p >= 3 && <div style={{ color: "#9fe0ad" }}>&#123;"result":&#123;"session_id":"3f9c…","changes":1&#125;&#125;</div>}
          </div>
          <div style={{ padding: "14px 14px", fontSize: 12.5 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-dim)", marginBottom: 8 }}>Desktop app — same store</div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 9px", borderRadius: 8, color: "var(--fg-soft)" }}>
              <span>settings dark-mode</span><span style={{ fontSize: 11, color: "var(--fg-dim)" }}>2h</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 9px", borderRadius: 8, background: "var(--hov, var(--elev))", border: "1px solid var(--bd)", opacity: p >= 4 ? 1 : 0, transform: p >= 4 ? "none" : "translateX(14px)", transition: "all .4s cubic-bezier(.3,1,.4,1)" }}>
              <span>fix login</span><span style={{ fontSize: 11, color: "var(--fg-dim)" }}>now</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--fg-dim)", opacity: p >= 4 ? 1 : 0, transition: "opacity .3s" }}>
              Any client that speaks JSON-RPC gets the whole product.
            </div>
          </div>
        </div>
      </Stage>
    </div>
  );
}
