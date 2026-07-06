"use client";
import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";

const PILLARS = [
  {
    n: "01 / Orchestration",
    title: "Many models, one task",
    body:
      "The Conductor plans your task and hands each part to the model best at it — Opus for the hard reasoning, Gemini Flash for the fast work — running independent steps in parallel across git worktrees and cross-reviewing the code between providers.",
  },
  {
    n: "02 / Memory",
    title: "A persistent brain",
    body:
      "Memory, a learned profile of your machine, your recorded skills, and a graph of your codebase — fed into every session, so agents start knowing your repo and conventions instead of re-exploring them each morning.",
  },
  {
    n: "03 / Local-first",
    title: "Runs on your machine",
    body:
      "Every session executes locally and your keys never leave — the cloud only ever sees counts and ciphertext. Linux-first down to real desktop control, with Windows and macOS builds rolling off public CI.",
  },
];

export function Pillars() {
  return (
    <div className="container" style={{ padding: "88px 28px", borderBottom: "1px solid var(--bd2)" }}>
      <Reveal>
        <div className="kicker">The difference</div>
        <h2
          style={{
            margin: "16px 0 0",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            maxWidth: 680,
            lineHeight: 1.05,
          }}
        >
          A model answers. An engine orchestrates, remembers, and stays yours.
        </h2>
      </Reveal>
      <Stagger
        gap={0.1}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginTop: 48,
        }}
      >
        {PILLARS.map((p) => (
          <Item key={p.n}>
            <LiftCard style={{ padding: "26px 24px", height: "100%" }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--fg-dim)", marginBottom: 18 }}>{p.n}</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.title}</div>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.55, color: "var(--fg2)" }}>{p.body}</p>
            </LiftCard>
          </Item>
        ))}
      </Stagger>
    </div>
  );
}
