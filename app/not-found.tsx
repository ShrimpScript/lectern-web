import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 124px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 28px", gap: 14 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-dim)", letterSpacing: "0.2em" }}>404</div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>This page took a wrong turn.</div>
        <p style={{ fontSize: 16, color: "var(--fg2)", maxWidth: 420 }}>The page you're looking for doesn't exist or has moved.</p>
        <Link href="/" style={{ background: "var(--btn)", color: "var(--btnfg)", borderRadius: 9, padding: "11px 20px", fontWeight: 600, fontSize: 14, marginTop: 6 }}>Back home</Link>
      </main>
      <Footer />
    </>
  );
}
