import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/Page";
import { HubBrowser, type HubEntry } from "@/components/hub/HubBrowser";

export const metadata: Metadata = {
  title: "Lectern Hub — skills for your agents",
  description: "Browse and install skills for Lectern — official, community, and collections from Anthropic, Vercel, and more. One command to install.",
};

const INDEX_URL = "https://raw.githubusercontent.com/ShrimpScript/lectern-hub/main/index.json";

async function getHubEntries(): Promise<HubEntry[]> {
  try {
    const res = await fetch(INDEX_URL, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { skills?: HubEntry[] };
    return data.skills ?? [];
  } catch {
    return [];
  }
}

export default async function HubPage() {
  const entries = await getHubEntries();

  return (
    <MarketingPage
      kicker="Lectern Hub"
      title="Skills your agents can learn"
      lede="The Hub is a public Git repo of skills — Lectern official ones, community publishes, and collections from Anthropic and Vercel. Search here, install with one command, browse everything in the app, the TUI, or on GitHub."
    >
      <HubBrowser entries={entries} />
      <p style={{ margin: "34px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--fg-soft)" }}>
        The Hub itself is{" "}
        <a href="https://github.com/ShrimpScript/lectern-hub" target="_blank" rel="noreferrer" style={{ color: "var(--fg2)", borderBottom: "1px solid var(--bd)" }}>
          ShrimpScript/lectern-hub
        </a>{" "}
        — publishing is a pull request, and every entry is content-addressed (sha256) so installs are verifiable. Record your own with{" "}
        <code style={{ background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 6px" }}>lectern skills record</code>{" "}
        and share it from the app.
      </p>
    </MarketingPage>
  );
}
