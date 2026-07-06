import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export type Section = { h: string; p: string[] };

export function LegalDoc({ title, updated, sections }: { title: string; updated: string; sections: Section[] }) {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: "56px 28px 90px", maxWidth: 760 }}>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>{title}</h1>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 8 }}>Last updated {updated}</div>
        <div
          className="mono"
          style={{ marginTop: 18, fontSize: 12, color: "var(--fg-dim)", border: "1px dashed var(--bd)", borderRadius: 8, padding: "10px 12px" }}
        >
          Template — review with counsel before launch.
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 22 }}>
          {sections.map((s) => (
            <section key={s.h}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} style={{ margin: "0 0 10px", fontSize: 14.5, lineHeight: 1.65, color: "var(--fg-soft)" }}>{para}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
