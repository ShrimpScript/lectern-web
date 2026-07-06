import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Motion";
import { releases } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Changelog — Lectern",
  description: "What's new in Lectern.",
};

export default function ChangelogPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 840, margin: "0 auto", padding: "56px 28px 90px" }}>
        <Reveal amount={0.1}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div className="kicker" style={{ letterSpacing: "0.22em", marginBottom: 14 }}>Releases</div>
            <h1 style={{ margin: 0, fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em" }}>Changelog</h1>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--fg2)" }}>What&apos;s new in Lectern.</p>

            <p style={{ margin: "10px 0 0", fontSize: 13.5 }}>
              <a href="https://github.com/ShrimpScript/lectern/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
                Full engineering history on GitHub →
              </a>
            </p>          </div>
        </Reveal>

        <div style={{ marginTop: 40 }}>
          {releases.map((r, ri) => (
            <Reveal key={r.version} delay={ri === 0 ? 0.08 : 0} amount={0.15}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: 30,
                padding: "30px 0",
                borderTop: "1px solid var(--bd2)",
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{r.version}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 4 }}>{r.date}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {r.changes.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: "var(--fg-dim)", width: 64, flexShrink: 0, paddingTop: 3, letterSpacing: "0.04em" }}
                    >
                      {c.tag}
                    </span>
                    <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--fg2)" }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
