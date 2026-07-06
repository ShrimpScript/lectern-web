import { NextResponse } from "next/server";
import { getMarketplaceItems } from "@/lib/marketplace";

/* GET /api/marketplace — public list of published skills/functions/MCP servers.
   Content-free metadata only (slug, type, installs, version). */
export async function GET() {
  const items = await getMarketplaceItems();
  return NextResponse.json({ items });
}
