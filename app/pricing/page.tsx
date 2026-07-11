import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Item, LiftCard, Reveal, Stagger } from "@/components/motion/Motion";

export const metadata: Metadata = {
  title: "Free & open source — Lectern",
  description: "Lectern is Apache-2.0 and free. Bring your own AI subscriptions; keep your keys and your code.",
};

/* Pricing retired with the open-source shift (2026-07-05): there are no plans,
   no tiers, no checkout. The route survives so old links land somewhere true. */
const ROWS = [
  { t: "The whole product", d: "Desktop cockpit, terminal UI, CLI, daemon, Conductor, brain, the Hub — all of it, no gates." },
  { t: "Your existing AI", d: "Lectern drives Claude Code, Antigravity, and OpenCode under your own logins. We never resell tokens or sit between you and your provider." },
  { t: "Nothing leaves your machine", d: "No accounts, no sign-in, no cloud. Your code, keys, and history stay local — Lectern is a tool you run, not a service you log into." },
  { t: "Sustainably open", d: "Apache-2.0 on GitHub, built in public with free CI. If Lectern earns a paid layer someday it will be additive — the open core stays open." },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: "88px 28px 96px" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
              <div className="kicker">Pricing</div>
              <h1 style={{ margin: "16px 0 10px", fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em" }}>
                Free. All of it.
              </h1>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--fg2)" }}>
                Lectern is open source under Apache-2.0. There is no Pro tier, no seat math, no checkout —
                you bring the AI subscriptions you already have, and Lectern makes them better together.
              </p>
              <div style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://github.com/ShrimpScript/lectern" target="_blank" rel="noreferrer"
                  style={{ padding: "11px 20px", borderRadius: 999, background: "var(--fg)", color: "var(--bg)", fontSize: 14, fontWeight: 650 }}>
                  Star on GitHub
                </a>
                <a href="/#download"
                  style={{ padding: "11px 20px", borderRadius: 999, border: "1px solid var(--bd)", color: "var(--fg)", fontSize: 14, fontWeight: 650 }}>
                  Download
                </a>
              </div>
            </div>
          </Reveal>
          <Stagger gap={0.08} style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, maxWidth: 1040, margin: "56px auto 0" }}>
            {ROWS.map((r) => (
              <Item key={r.t}>
                <LiftCard style={{ borderRadius: 12, padding: 20, height: "100%" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{r.t}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--fg2)", marginTop: 7 }}>{r.d}</div>
                </LiftCard>
              </Item>
            ))}
          </Stagger>
        </div>
      </main>
      <Footer />
    </>
  );
}
