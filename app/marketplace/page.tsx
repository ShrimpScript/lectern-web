import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { MarketplaceList } from "@/components/marketplace/MarketplaceList";
import { getMarketplaceItems } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Marketplace — Lectern",
  description: "Discover and share skills, functions, and MCP servers for your AI engine. Content-addressed, versioned, signed.",
};

const CATEGORIES = [
  { name: "Skills", desc: "Reusable, learned workflows your engine auto-applies when a task matches the trigger." },
  { name: "Functions", desc: "Typed tools the agent can call — fetch data, run actions, and return real artifacts." },
  { name: "MCP servers", desc: "Model Context Protocol servers that expose tools and resources to any backend." },
];

export default async function MarketplacePage() {
  const items = await getMarketplaceItems();

  return (
    <MarketingPage
      kicker="Marketplace"
      title="Skills, functions & MCP servers"
      lede="Share what your engine has learned — and pull in what the community has built. Content-addressed, versioned, and signed."
    >
      {/* what's shareable */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
        {CATEGORIES.map((c) => (
          <div key={c.name} style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{c.name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-soft)" }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "0 0 18px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Browse</h2>

      {items.length === 0 ? (
        <div style={{ border: "1px solid var(--bd2)", borderRadius: 14, padding: "34px 26px", background: "var(--elev)", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>No community items published yet</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fg-soft)", maxWidth: 520, margin: "10px auto 0" }}>
            Skills you record locally with{" "}
            <span className="mono" style={{ color: "var(--fg)", background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 6px" }}>
              lectern skills record
            </span>{" "}
            stay private to you and sync end-to-end encrypted. Public publishing to the marketplace is rolling out next — this page already reads live from the catalog, so listings appear here the moment they&apos;re published.
          </p>
            <p style={{ margin: "10px 0 0", fontSize: 13.5 }}>
              <a href="https://github.com/ShrimpScript/lectern-community" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
                The hub itself is a public Git repo — browse or publish on GitHub →
              </a>
            </p>
          <div style={{ marginTop: 18, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/docs" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>Read the docs →</Link>
            <Link href="/changelog" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg2)" }}>What&apos;s shipping</Link>
          </div>
        </div>
      ) : (
        <MarketplaceList items={items} />
      )}
    </MarketingPage>
  );
}
