"use client";
/* The platform strip — the real Lectern family, no vaporware:
   desktop app, CLI + daemon, the Hub, optional encrypted cloud. */
import type { ReactNode } from "react";
import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";

/* Proper line icons (Lucide-style geometry, inline — no dep), currentColor. */
const ic = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const AppWindowIcon = (
  <svg {...ic} aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2.5" />
    <path d="M2 9h20M6 6.5h.01M9 6.5h.01" />
  </svg>
);
const TerminalIcon = (
  <svg {...ic} aria-hidden>
    <path d="m5 8 4 4-4 4M11 17h8" />
    <rect x="2" y="3" width="20" height="18" rx="2.5" />
  </svg>
);
const PackagesIcon = (
  <svg {...ic} aria-hidden>
    <path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3Z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
  </svg>
);
const CloudLockIcon = (
  <svg {...ic} aria-hidden>
    <path d="M17.5 18.5H7a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.6 1.63 3.7 3.7 0 0 1-.7 7.35Z" />
    <path d="M10.5 13.4v-1.2a1.5 1.5 0 0 1 3 0v1.2M9.8 13.4h4.4v3H9.8v-3Z" />
  </svg>
);

const SURFACES: { icon: ReactNode; name: string; body: string; href: string; hint: string }[] = [
  {
    icon: AppWindowIcon,
    name: "Desktop App",
    body: "The cockpit. Chat, plans, diffs, terminal, the brain graph — plus a personal agent with schedules and a Telegram channel, so runs reach your phone.",
    href: "/#download",
    hint: "download ↧",
  },
  {
    icon: TerminalIcon,
    name: "TUI + CLI + lecternd",
    body: "The engine in your terminal: lectern tui (sessions, streaming, models, /conduct), the scriptable CLI, and the daemon — same brain everywhere.",
    href: "/docs",
    hint: "read the docs →",
  },
  {
    icon: PackagesIcon,
    name: "Lectern Hub",
    body: "The Lectern Hub. Search, install, publish — skills your agents learn once and keep for good, including official collections from Anthropic and Vercel.",
    href: "/hub",
    hint: "browse skills →",
  },
  {
    icon: CloudLockIcon,
    name: "Cloud Sync",
    body: "Optional by design. End-to-end encrypted sync and device pairing — free, and the cloud sees counts and ciphertext, never code.",
    href: "/docs/security",
    hint: "how it works →",
  },
];

export function Platform() {
  return (
    <div id="platform" className="container" style={{ padding: "88px 28px", borderBottom: "1px solid var(--bd2)" }}>
      <Reveal>
        <div className="kicker">The platform</div>
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
          One engine. Every surface you work from.
        </h2>
        <p style={{ margin: "18px 0 0", fontSize: 16, lineHeight: 1.55, color: "var(--fg2)", maxWidth: 560 }}>
          Everything below ships today — the same local engine and the same persistent brain,
          whether you drive it from a window, a terminal, or a service.
        </p>
      </Reveal>
      <Stagger
        gap={0.08}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 16,
          marginTop: 44,
        }}
      >
        {SURFACES.map((s) => (
          <Item key={s.name}>
            <LiftCard href={s.href} style={{ padding: "24px 22px", height: "100%" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  border: "1px solid var(--bd)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg)",
                  background: "var(--hov)",
                }}
              >
                {s.icon}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 16 }}>{s.name}</div>
              <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--fg2)" }}>{s.body}</p>
              <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 500, color: "var(--fg-dim)" }}>{s.hint}</div>
            </LiftCard>
          </Item>
        ))}
      </Stagger>
    </div>
  );
}
