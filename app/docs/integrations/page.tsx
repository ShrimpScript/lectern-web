import type { Metadata } from "next";
import { H2, NextPage, P, UL } from "@/components/docs/DocsBits";
import { McpAddDemo } from "@/components/docs/demos/McpAddDemo";
import { PhoneDemo } from "@/components/docs/demos/PhoneDemo";

export const metadata: Metadata = { title: "MCP, channels & marketplace — Lectern docs", description: "Tools, remote access, and shareable skills." };

export default function IntegrationsDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>MCP, channels &amp; marketplace</h1>

      <H2 id="mcp">Tools (MCP)</H2>
      <P>
        MCP servers give every run extra tools — files, browsers, APIs, databases. Lectern ships a verified catalog
        (25 servers: GitHub, Postgres, Notion, Sentry, Stripe, Firecrawl, E2B and more) with requirement-aware forms,
        plus a full-page library behind <em>Browse all</em>. One add registers the server across{" "}
        <strong>Claude Code, OpenCode, and Antigravity together</strong>, with truthful per-agent chips showing exactly
        where it landed. Status is live: running vs registered vs failed — capped probes, never a frozen UI.
      </P>
      <P>In a chat, <span className="mono">/mcp</span> lists what&apos;s connected and <span className="mono">/mcp github</span> targets one for your next message.</P>
      <McpAddDemo />

      <H2 id="channels">Channels — remote access</H2>
      <P>
        Different from MCP: channels let a messaging app reach <em>your agent</em>. Pair Telegram once and task your
        machine from your phone — send a prompt, get completion pings back. Powered by Claude Code&apos;s channel
        system; strictly allowlist-gated (approvals happen in the CLI on your machine, never from a chat message).
      </P>
      <PhoneDemo />

      <H2 id="marketplace">Marketplace & skills</H2>
      <UL items={[
        <><strong>Record</strong> a GUI demonstration with <span className="mono">/record</span> — it becomes a replayable skill (deterministic replay, no re-reasoning).</>,
        <><strong>Write or import</strong> skills as portable JSON; they sync into Claude Code automatically.</>,
        <><strong>Community hub</strong> — a Git-backed index (<a href="https://github.com/ShrimpScript/lectern-community" target="_blank" rel="noreferrer" style={{ color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>ShrimpScript/lectern-community</a>) with official and ecosystem tiers (curated collections from Anthropic, Vercel, and the wider skills world link out with attribution), an in-app docs viewer, and review-before-install. Publishing runs a $0 AI audit gate before anything ships.</>,
        <><strong>Skill stats</strong> — every skill tracks uses and outcomes; pause the ones you don&apos;t want auto-applied.</>,
      ]} />
      <P>
        Lectern&apos;s brain is also an MCP server itself — <em>Connect Lectern&apos;s brain</em> in Settings exposes
        memory + skills as tools to any MCP client.
      </P>
      <NextPage href="/docs" label="Back to overview" />
    </article>
  );
}
