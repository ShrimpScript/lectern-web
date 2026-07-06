import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getPost, posts } from "@/lib/data/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: `${post.title} — Lectern`, description: post.excerpt } : { title: "Not found" };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="container" style={{ padding: "56px 28px 90px", maxWidth: 760 }}>
        <Link href="/blog" className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>← Blog</Link>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 18 }}>{post.date} · {post.author}</div>
        <h1 style={{ margin: "8px 0 0", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{post.title}</h1>
        <article style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          {post.body.map((b, i) => {
            if (b.t === "h2") return <h2 key={i} style={{ margin: "16px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{b.text}</h2>;
            if (b.t === "quote") return <blockquote key={i} style={{ margin: 0, borderLeft: "2px solid var(--fg)", paddingLeft: 16, fontSize: 19, fontStyle: "italic", color: "var(--fg)" }}>{b.text}</blockquote>;
            return <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--fg-soft)" }}>{b.text}</p>;
          })}
        </article>
      </main>
      <Footer />
    </>
  );
}
