import type { MetadataRoute } from "next";
import { posts } from "@/lib/data/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lectern.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/pricing",
    "/docs",
    "/changelog",
    "/blog",
    "/security",
    "/company",
    "/customers",
    "/contact",
    "/login",
    "/signup",
    "/legal/privacy",
    "/legal/terms",
    "/legal/dpa",
    "/legal/subprocessors",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));

  const blog = posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: new Date() }));
  return [...routes, ...blog];
}
