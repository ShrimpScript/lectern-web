// The latest release, read from GitHub at build time (revalidated hourly) so the download
// buttons and version label follow every release automatically instead of being hand-edited.
export type LatestRelease = { version: string; date: string };

// Used only if GitHub is unreachable at build time.
const FALLBACK: LatestRelease = { version: "v0.7.0", date: "Jul 10, 2026" };

export async function getLatestRelease(): Promise<LatestRelease> {
  try {
    const res = await fetch("https://api.github.com/repos/ShrimpScript/lectern/releases/latest", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return FALLBACK;
    const d = await res.json();
    const version = typeof d.tag_name === "string" && d.tag_name ? d.tag_name : FALLBACK.version;
    const date =
      typeof d.published_at === "string"
        ? new Date(d.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : FALLBACK.date;
    return { version, date };
  } catch {
    return FALLBACK;
  }
}
