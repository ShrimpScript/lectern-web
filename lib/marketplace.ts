import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/* Public marketplace listing — reads the content-addressed marketplace_item table.
   Items are skills / functions / MCP servers published by users; private (org-only)
   items are excluded from the public list. */

export type MarketItemType = "skill" | "function" | "mcp";
export type MarketItem = {
  slug: string;
  type: MarketItemType;
  installs: number;
  versionCount: number;
  latest: string | null;
  author: string | null;
};

export async function getMarketplaceItems(): Promise<MarketItem[]> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select({
      slug: schema.marketplaceItem.slug,
      type: schema.marketplaceItem.type,
      installs: schema.marketplaceItem.installs,
      versions: schema.marketplaceItem.versions,
      orgPrivate: schema.marketplaceItem.orgPrivate,
      authorName: schema.users.name,
      authorEmail: schema.users.email,
    })
    .from(schema.marketplaceItem)
    .leftJoin(schema.users, eq(schema.marketplaceItem.authorId, schema.users.id))
    .orderBy(desc(schema.marketplaceItem.installs));

  return rows
    .filter((r) => !r.orgPrivate)
    .map((r) => {
      const versions = (r.versions ?? []) as { version: string; url: string }[];
      return {
        slug: r.slug,
        type: r.type,
        installs: r.installs,
        versionCount: versions.length,
        latest: versions.length ? versions[versions.length - 1].version : null,
        author: r.authorName || (r.authorEmail ? r.authorEmail.split("@")[0] : null),
      };
    });
}
