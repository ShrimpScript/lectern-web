import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/Page";

export const metadata: Metadata = { title: "Security & Trust — Lectern", description: "How Lectern keeps your code and keys private: local-first, E2E-encrypted sync, and no training on your data." };

const PILLARS = [
  { k: "Local-first", v: "Lectern runs on your machine. Your repository, prompts, and the model's work stay on your device by default." },
  { k: "Your keys, your data", v: "API keys and backend credentials live in your system keychain (Secret Service). They are never sent to our servers." },
  { k: "No training on your code", v: "Your repository is used only to serve your own sessions. We never train models on it. Ever." },
  { k: "End-to-end encrypted sync", v: "Optional cross-device sync encrypts memory and skills on your machine. We store ciphertext we cannot read." },
  { k: "Content-free telemetry", v: "Usage analytics are opt-in and carry only counts — sessions, tokens, cost. Never code or prompts." },
  { k: "Sandboxed execution", v: "Agent-run commands execute in a Linux sandbox (bubblewrap/Landlock/seccomp) behind an explicit Review → Apply gate." },
];

const PRACTICES = [
  "Encrypted in transit (TLS) and at rest.",
  "Signed releases + reproducible-build goal.",
  "Least-privilege: tools, secrets, and network access are scoped and user-approved.",
  "Marketplace items are signed, scoped, and sandboxed; tool output is treated as data, not instructions.",
  "Data export and account deletion on request.",
];

export default function SecurityPage() {
  return (
    <MarketingPage kicker="Security & Trust" title="Your code is the most sensitive thing you own. We treat it that way." lede="Lectern is built local-first. The cloud is optional and, by design, can't read your code or keys.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 16 }}>
        {PILLARS.map((p) => (
          <div key={p.k} style={{ border: "1px solid var(--bd2)", borderRadius: 14, padding: 22, background: "linear-gradient(180deg, var(--panel), var(--elev))" }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{p.k}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--fg2)" }}>{p.v}</p>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "48px 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Practices</h2>
      <div style={{ border: "1px solid var(--bd2)", borderRadius: 14, padding: "8px 20px" }}>
        {PRACTICES.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: i < PRACTICES.length - 1 ? "1px solid var(--bd2)" : "none", fontSize: 14.5, color: "var(--fg2)" }}>
            <span style={{ color: "var(--fg)" }}>✓</span>{p}
          </div>
        ))}
      </div>

      <p className="mono" style={{ marginTop: 26, fontSize: 12.5, color: "var(--fg-dim)" }}>
        Report a vulnerability: shrimpyfry@gmail.com · SOC 2 in progress for enterprise. See our{" "}
        <a href="/legal/privacy" style={{ color: "var(--fg2)" }}>Privacy Policy</a>,{" "}
        <a href="/legal/dpa" style={{ color: "var(--fg2)" }}>DPA</a>, and{" "}
        <a href="/legal/subprocessors" style={{ color: "var(--fg2)" }}>Subprocessors</a>.
      </p>
    </MarketingPage>
  );
}
