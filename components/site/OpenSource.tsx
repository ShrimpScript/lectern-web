import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";

/* Built-in-public section (OSS shift, 2026-07-05): license, repo, contribute. */
const CARDS = [
  {
    title: "Read every line",
    body: "The engine, desktop app, TUI, and this site — one repo, Apache-2.0. No black boxes between your code and your agents.",
    href: "https://github.com/ShrimpScript/lectern",
    cta: "Browse the source →",
  },
  {
    title: "Shape it",
    body: "Bugs, ideas, PRs — all in the open. The contribution bar is honest: show what you ran, not just what compiles.",
    href: "https://github.com/ShrimpScript/lectern/blob/main/CONTRIBUTING.md",
    cta: "Contributing guide →",
  },
  {
    title: "Watch it evolve",
    body: "Every change ships through public CI with the full history in the changelog — the same one the apps are built from.",
    href: "https://github.com/ShrimpScript/lectern/blob/main/CHANGELOG.md",
    cta: "Full changelog →",
  },
];

export function OpenSource() {
  return (
    <div id="open-source" className="container" style={{ padding: "88px 28px", borderBottom: "1px solid var(--bd2)" }}>
      <Reveal>
        <div className="kicker">Open source</div>
        <h2 style={{ margin: "16px 0 6px", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>
          Built in public, licensed to stay open.
        </h2>
        <p style={{ margin: 0, fontSize: 16, color: "var(--fg2)", maxWidth: 620 }}>
          Lectern is Apache-2.0 — a local-first tool you can audit, fork, and help build. Stars fuel
          the roadmap; issues steer it.
        </p>
      </Reveal>
      <Stagger gap={0.09} style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {CARDS.map((c) => (
          <Item key={c.title}>
            <LiftCard style={{ borderRadius: 12, padding: 20, height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--fg2)", flex: 1 }}>{c.body}</div>
              <a href={c.href} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", borderBottom: "1px solid var(--bd)", alignSelf: "flex-start" }}>{c.cta}</a>
            </LiftCard>
          </Item>
        ))}
      </Stagger>
    </div>
  );
}
