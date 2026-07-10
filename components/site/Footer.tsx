import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Platform", href: "/#platform" },
      { label: "Free & open source", href: "/pricing" },
      { label: "Download", href: "/#download" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Hub", href: "/hub" },
      { label: "Studies", href: "/studies" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "GitHub", href: "https://github.com/ShrimpScript/lectern" },
      { label: "License (Apache-2.0)", href: "https://github.com/ShrimpScript/lectern/blob/main/LICENSE" },
      { label: "Security", href: "/docs/security" },
    ],
  },
];

export function Footer() {
  return (
    <div style={{ borderTop: "1px solid var(--bd2)" }}>
      <div className="container" style={{ padding: "56px 28px 40px", display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
            <LogoMark size={22} />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Lectern</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--fg-dim)", maxWidth: 240, lineHeight: 1.5 }}>
            An engine for your AI — local-first and backend-agnostic.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "var(--fg-dim)", textTransform: "uppercase" }}>{c.title}</div>
            {c.links.map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13.5, color: "var(--fg2)" }}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container" style={{ padding: "0 28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 12.5, color: "var(--fg-ghost)" }}>© 2026 Lectern · open source under <a href="https://github.com/ShrimpScript/lectern/blob/main/LICENSE" style={{ color: "var(--fg-dim)" }}>Apache-2.0</a></div>
        <div style={{ fontSize: 12.5, color: "var(--fg-ghost)" }}>One engine under your coding agents</div>
      </div>
    </div>
  );
}
