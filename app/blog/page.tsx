import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { posts } from "@/lib/data/blog";

export const metadata: Metadata = { title: "Blog — Lectern" };

export default function BlogPage() {
  return (
    <MarketingPage kicker="Blog" title="Notes from building the engine." lede="Product thinking, architecture, and the local-first philosophy behind Lectern.">
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 760 }}>
        {posts.map((p, i) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{ padding: "22px 0", borderTop: i === 0 ? "1px solid var(--bd2)" : "none", borderBottom: "1px solid var(--bd2)", display: "block" }}>
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>{p.date} · {p.author}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "6px 0 6px", color: "var(--fg)" }}>{p.title}</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--fg2)" }}>{p.excerpt}</div>
          </Link>
        ))}
      </div>
    </MarketingPage>
  );
}
