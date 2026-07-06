import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Motion";

export function MarketingPage({ kicker, title, lede, children, narrow }: { kicker?: string; title: string; lede?: string; children?: ReactNode; narrow?: boolean }) {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: "64px 28px 90px", maxWidth: narrow ? 760 : undefined }}>
        <Reveal y={18} amount={0.1}>
          {kicker && <div className="kicker" style={{ marginBottom: 14 }}>{kicker}</div>}
          <h1 style={{ margin: 0, fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", maxWidth: 760, lineHeight: 1.05 }}>{title}</h1>
          {lede && <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--fg-soft)", maxWidth: 640 }}>{lede}</p>}
        </Reveal>
        <Reveal y={16} delay={0.12} amount={0.02}>
          <div style={{ marginTop: 36 }}>{children}</div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16, fontSize: 15.5, lineHeight: 1.7, color: "var(--fg-soft)" }}>{children}</div>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: "20px 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)" }}>{children}</h2>;
}
