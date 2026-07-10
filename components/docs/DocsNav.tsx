"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Start here",
    items: [
      { href: "/docs", label: "Overview & setup" },
    ],
  },
  {
    title: "Features",
    items: [
      { href: "/docs/commands", label: "Chat commands" },
      { href: "/docs/conductor", label: "Conductor & routing" },
      { href: "/docs/brain", label: "The brain: memory" },
      { href: "/docs/scheduling", label: "Scheduling" },
      { href: "/docs/hub", label: "The Hub: skills" },
      { href: "/docs/checkpoints", label: "Checkpoints & rewind" },
      { href: "/docs/security", label: "Trust & security" },
    ],
  },
  {
    title: "Surfaces",
    items: [
      { href: "/docs/desktop", label: "Desktop app" },
      { href: "/docs/tui", label: "Terminal UI" },
      { href: "/docs/cli", label: "CLI & daemon" },
      { href: "/docs/engine", label: "Engine internals" },
      { href: "/docs/integrations", label: "MCP & channels" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" style={{ position: "sticky", top: 86, display: "flex", flexDirection: "column", gap: 14 }}>
      {GROUPS.map((g) => (
        <div key={g.title} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-dim)", padding: "0 10px 6px" }}>{g.title}</div>
          {g.items.map((s) => {
            const active = pathname === s.href;
            return (
              <Link key={s.href} href={s.href}
                style={{ padding: "7px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: active ? 650 : 450, color: active ? "var(--fg)" : "var(--fg2)", background: active ? "var(--hov)" : "transparent" }}>
                {s.label}
              </Link>
            );
          })}
        </div>
      ))}
      <a href="https://github.com/ShrimpScript/lectern" target="_blank" rel="noreferrer"
        style={{ marginTop: 4, padding: "7px 10px", fontSize: 12.5, color: "var(--fg-dim)" }}>
        Source on GitHub ↗
      </a>
    </nav>
  );
}
