import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlectern.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/pricing",
    "/docs",
    "/hub",
    "/studies",
    "/changelog",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));
}
