import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";

export const metadata: Metadata = { title: "Built for — Lectern" };

/* Honest pre-launch framing: the builders Lectern is designed around,
   not invented testimonials. Swap in real, attributed stories post-launch. */
const PERSONAS = [
  {
    who: "The Linux daily-driver",
    text:
      "You live in a tiling WM and a terminal. Lectern is native — a real Linux app with real desktop control, not a Mac port or an Electron afterthought.",
  },
  {
    who: "The multi-subscription dev",
    text:
      "You already pay for Claude and Gemini. The Conductor routes each step to whichever model is better at it, so both subscriptions finally pull in the same direction.",
  },
  {
    who: "The privacy-constrained team",
    text:
      "Code that can't leave the building. Every session runs locally; the optional cloud sees usage counts and ciphertext — never your source.",
  },
  {
    who: "The long-project builder",
    text:
      "Months deep in one codebase. The brain keeps memory, learned skills, and a graph of the repo, so session #100 starts smarter than session #1.",
  },
];

export default function CustomersPage() {
  return (
    <MarketingPage
      kicker="Built for"
      title="Made for people who keep their code close."
      lede="Lectern is in early access — these are the builders it's designed around. Real, attributed stories will live here once they exist."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16 }}>
        {PERSONAS.map((c) => (
          <div
            key={c.who}
            style={{
              border: "1px solid var(--bd2)",
              borderRadius: 14,
              padding: 24,
              background: "linear-gradient(180deg, var(--panel), var(--elev))",
            }}
          >
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--fg-dim)", textTransform: "uppercase" }}>
              {c.who}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.55, color: "var(--fg)" }}>{c.text}</p>
          </div>
        ))}
      </div>
      <p className="mono" style={{ marginTop: 24, fontSize: 12, color: "var(--fg-dim)" }}>
        Shipping something with Lectern? <Link href="/contact" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>Tell us your story →</Link>
      </p>
    </MarketingPage>
  );
}
