import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Motion";
import { studies } from "@/lib/data/studies";
import { Legend, TokensChart, OverheadSplit, StatRow, TaskTable } from "@/components/studies/StudyCharts";

export const metadata: Metadata = {
  title: "Studies — Lectern",
  description:
    "Benchmark studies of Lectern's orchestration: success rate, token cost, and trajectory, with public methodology and raw traces.",
};

export default function StudiesPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "56px 28px 90px" }}>
        <Reveal amount={0.1}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div className="kicker" style={{ letterSpacing: "0.22em", marginBottom: 14 }}>Benchmarks</div>
            <h1 style={{ margin: 0, fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em" }}>Studies</h1>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "var(--fg2)", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              What Lectern&apos;s orchestration actually costs and delivers, measured.
              Every number traces to a machine-readable run report; the method, the
              harness, and the raw traces are public.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 13.5 }}>
              <a href="https://github.com/ShrimpScript/lectern/blob/main/bench/METHODOLOGY.md" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
                Methodology
              </a>
              <span style={{ color: "var(--fg-ghost)" }}> · </span>
              <a href="https://github.com/ShrimpScript/lectern/tree/main/bench" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
                Harness &amp; tasks
              </a>
              <span style={{ color: "var(--fg-ghost)" }}> · </span>
              <span style={{ color: "var(--fg-dim)" }}>reproduce with <span className="mono" style={{ fontSize: 12.5 }}>python3 bench/runner.py</span></span>
            </p>
          </div>
        </Reveal>

        {studies.map((study) => {
          return (
            <section key={study.slug} id={study.slug} style={{ marginTop: 56 }}>
              <Reveal amount={0.12}>
                <div style={{ borderTop: "1px solid var(--bd2)", paddingTop: 30 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12 }}>
                    <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>{study.title}</h2>
                    <span className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>{study.date}</span>
                  </div>
                  <p className="mono" style={{ margin: "8px 0 0", fontSize: 12, color: "var(--fg-dim)" }}>
                    model {study.model} · {study.reps} runs per task per arm · {study.cost}
                  </p>
                  <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "var(--fg2)", maxWidth: 720 }}>
                    {study.finding}
                  </p>
                </div>
              </Reveal>

              <Reveal amount={0.12}>
                <div style={{ marginTop: 26 }}>
                  <StatRow study={study} />
                </div>
              </Reveal>

              <Reveal amount={0.1}>
                <div style={{ marginTop: 34, padding: "24px 22px", border: "1px solid var(--bd2)", borderRadius: "var(--radius-lg)", background: "var(--panel)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 22 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Tokens per task</h3>
                    <Legend />
                  </div>
                  <TokensChart study={study} />
                </div>
              </Reveal>

              <Reveal amount={0.1}>
                <div style={{ marginTop: 18, padding: "24px 22px", border: "1px solid var(--bd2)", borderRadius: "var(--radius-lg)", background: "var(--panel)" }}>
                  <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700 }}>Where the overhead concentrates</h3>
                  <OverheadSplit study={study} />
                </div>
              </Reveal>

              <Reveal amount={0.1}>
                <div style={{ marginTop: 18 }}>
                  <TaskTable study={study} />
                </div>
              </Reveal>

              <Reveal amount={0.1}>
                <div style={{ marginTop: 22, padding: "18px 20px", border: "1px solid var(--bd2)", borderRadius: "var(--radius)", background: "var(--elev)" }}>
                  <div className="kicker" style={{ marginBottom: 10 }}>Read before citing</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 }}>
                    {study.caveats.map((c, i) => (
                      <li key={i} style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg2)" }}>{c}</li>
                    ))}
                  </ul>
                  <p style={{ margin: "14px 0 0", fontSize: 13 }}>
                    <a href={study.links.results} target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>Full write-up</a>
                    <span style={{ color: "var(--fg-ghost)" }}> · </span>
                    <a href={study.links.traces} target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>Raw run traces</a>
                  </p>
                </div>
              </Reveal>
            </section>
          );
        })}

        <Reveal amount={0.1}>
          <div style={{ marginTop: 56, borderTop: "1px solid var(--bd2)", paddingTop: 26, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14, color: "var(--fg-dim)", maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Next studies: harder multi-step tasks where a single call fails, and a
              head-to-head against Claude Code and Antigravity as standalone agents.
              New results land here and in the repo as they run.
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
