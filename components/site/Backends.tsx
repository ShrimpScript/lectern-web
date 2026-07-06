"use client";
import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";
import { AntigravityIcon, ClaudeIcon } from "@/components/ui/BrandIcons";

const BACKENDS = [
  { Icon: ClaudeIcon, name: "Claude Code", sub: "Local CLI · Claude — Fable 5, Opus 4.8, Haiku 4.5" },
  { Icon: AntigravityIcon, name: "Antigravity", sub: "One login · Gemini 3.5 Flash & 3.1 Pro" },
];

export function Backends() {
  return (
    <div
      className="container"
      style={{
        padding: "88px 28px",
        borderBottom: "1px solid var(--bd2)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 56,
        alignItems: "center",
      }}
    >
      <Reveal>
        <div className="kicker">Bring your engine block</div>
        <h2 style={{ margin: "16px 0 0", fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Connect the AI
          <br />
          you already pay for.
        </h2>
        <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.55, color: "var(--fg2)", maxWidth: 460 }}>
          No new subscription. Point Lectern at Claude Code or Antigravity — it routes each task to
          the model that&apos;s best at it, and your memory and skills follow across both.
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12.5, fontWeight: 500, color: "var(--fg-dim)" }}>
          {["no lock-in", "runs local", "your keys, your data"].map((c) => (
            <span key={c} style={{ border: "1px solid var(--bd)", borderRadius: 7, padding: "7px 11px" }}>
              {c}
            </span>
          ))}
        </div>
      </Reveal>

      <Stagger gap={0.12} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {BACKENDS.map((b) => (
          <Item key={b.name}>
            <LiftCard
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid var(--bd)",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg)",
                  flexShrink: 0,
                }}
              >
                <b.Icon size={19} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                <div style={{ fontSize: 13, color: "var(--fg-mute)" }}>{b.sub}</div>
              </div>
            </LiftCard>
          </Item>
        ))}
      </Stagger>
    </div>
  );
}
