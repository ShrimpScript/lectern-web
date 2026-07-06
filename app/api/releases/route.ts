import { NextResponse } from "next/server";
import { artifacts, releases } from "@/lib/data/content";

/* GET /api/releases?channel=stable
   Update feed the desktop app / package updaters poll for new Linux artifacts.
   See Lectern-Brain/04-Linux-Native/Packaging & Distribution.md */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const channel = url.searchParams.get("channel") ?? "stable";
  const latest = releases[0];

  return NextResponse.json({
    channel,
    latest: {
      version: latest.version,
      date: latest.date,
      notes: latest.changes.map((c) => `${c.tag}: ${c.text}`),
      // artifact URLs + checksums populated from the `releases` table / object storage in prod
      artifacts: [
        { fmt: "AppImage", url: artifacts.appimage, sha256: null },
        { fmt: "deb", url: artifacts.deb, sha256: null },
      ],
    },
    history: releases.map((r) => ({ version: r.version, date: r.date })),
  });
}
