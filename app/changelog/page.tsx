import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Motion";

export const metadata: Metadata = {
  title: "Changelog — Lectern",
  description: "What's new in Lectern.",
};

// Re-fetch the source of truth periodically so the site stays current without a redeploy.
export const revalidate = 3600;

const REPO = "https://github.com/ShrimpScript/lectern";
const CHANGELOG_URL = "https://raw.githubusercontent.com/ShrimpScript/lectern/main/CHANGELOG.md";

type Item = { text: string; sub: string[] };
type Section = { name: string; items: Item[] };
type Version = { version: string; date: string | null; released: boolean; sections: Section[] };

// Parse the repo's Keep-a-Changelog CHANGELOG.md — it is the single source of truth for
// every "what changed" surface (this page, GitHub releases, the in-app what's-new).
function parseChangelog(md: string): Version[] {
  const versions: Version[] = [];
  let cur: Version | null = null;
  let section: Section | null = null;
  for (const raw of md.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const head = line.match(/^##\s+\[([^\]]+)\](?:\s*[-–]\s*(.+))?/);
    if (head) {
      cur = { version: head[1], date: head[2]?.trim() || null, released: /^\d+\.\d+\.\d+$/.test(head[1]), sections: [] };
      versions.push(cur);
      section = null;
      continue;
    }
    if (!cur) continue;
    const sec = line.match(/^###\s+(.+)/);
    if (sec) { section = { name: sec[1].trim(), items: [] }; cur.sections.push(section); continue; }
    const bullet = line.match(/^-\s+(.+)/);
    if (bullet) {
      if (!section) { section = { name: "", items: [] }; cur.sections.push(section); }
      section.items.push({ text: bullet[1], sub: [] });
      continue;
    }
    const subBullet = line.match(/^\s+-\s+(.+)/);
    if (subBullet && section?.items.length) { section.items[section.items.length - 1].sub.push(subBullet[1]); continue; }
    // A wrapped continuation line of the current bullet.
    const cont = line.match(/^\s{2,}(\S.+)/);
    if (cont && section?.items.length) {
      const it = section.items[section.items.length - 1];
      if (it.sub.length) it.sub[it.sub.length - 1] += " " + cont[1];
      else it.text += " " + cont[1];
    }
  }
  return versions;
}

// Minimal inline Markdown — **bold** and `code` — enough for changelog prose.
function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[2] !== undefined) out.push(<strong key={k++} style={{ color: "var(--fg)", fontWeight: 650 }}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<code key={k++} className="mono" style={{ fontSize: "0.9em", color: "var(--fg)" }}>{m[3]}</code>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

async function getChangelog(): Promise<Version[] | null> {
  try {
    const res = await fetch(CHANGELOG_URL, { next: { revalidate } });
    if (!res.ok) return null;
    const parsed = parseChangelog(await res.text());
    return parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export default async function ChangelogPage() {
  const versions = await getChangelog();
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
              <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
                Read CHANGELOG.md on GitHub →
              </a>
            </p>
          </div>
        </Reveal>

        {versions ? (
          <div style={{ marginTop: 40 }}>
            {versions.map((v, vi) => (
              <Reveal key={v.version} delay={vi === 0 ? 0.08 : 0} amount={0.15}>
                <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 30, padding: "30px 0", borderTop: "1px solid var(--bd2)" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
                      {v.released ? (
                        <a href={`${REPO}/releases/tag/v${v.version}`} target="_blank" rel="noreferrer" style={{ color: "var(--fg)" }}>{v.version}</a>
                      ) : (
                        v.version
                      )}
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 4 }}>
                      {v.date ?? "in development"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {v.sections.map((sec, si) => (
                      <div key={si} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {sec.name && <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{sec.name}</div>}
                        {sec.items.map((it, ii) => (
                          <div key={ii} style={{ fontSize: 15, lineHeight: 1.55, color: "var(--fg2)" }}>
                            <div>{inline(it.text)}</div>
                            {it.sub.length > 0 && (
                              <ul style={{ margin: "6px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                                {it.sub.map((s, sj) => <li key={sj} style={{ fontSize: 14 }}>{inline(s)}</li>)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 48, textAlign: "center", color: "var(--fg2)", fontSize: 15 }}>
            The changelog is on GitHub.{" "}
            <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" style={{ color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>Read it there →</a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
