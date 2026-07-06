import type { Metadata } from "next";
import { H2, H3, NextPage, P, Tbl, UL } from "@/components/docs/DocsBits";
import { ConductDemo } from "@/components/docs/demos/ConductDemo";

export const metadata: Metadata = { title: "Engine & brain — Lectern docs", description: "How routing, memory, and security work inside Lectern." };

export default function EngineDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Engine &amp; brain</h1>
      <P>
        The Rust core every surface shares: it drives provider CLIs as backends, normalizes their output into one
        event stream, persists everything in a local SQLite store, and feeds each run from the brain.
      </P>

      <H2 id="backends">Backends, not lock-in</H2>
      <P>
        Claude Code, Antigravity, and OpenCode are <em>adapters over their own CLIs</em> — your subscriptions, logins,
        and native features stay intact; Lectern compounds them. A <span className="mono">mock</span> backend exercises
        the full pipeline for zero tokens (it&apos;s how we test everything).
      </P>

      <H2 id="routing">The Conductor & routing</H2>
      <P>
        <strong>Auto</strong> mode routes each task by editable rules in{" "}
        <span className="mono">~/.lectern/routing.json</span> (openable from Settings) — e.g. screenshots → Gemini
        Flash, architecture → Opus, one-word fixes → Haiku — with an optional fast classifier for ambiguous tasks.{" "}
        <strong>/conduct</strong> goes further: it plans the goal, hands each sub-step to the model best at it (running
        independent steps in parallel git worktrees), then cross-reviews the result with a different provider.
      </P>
      <ConductDemo />

      <H2 id="brain">The brain</H2>
      <Tbl head={["Piece", "What it holds", "How it's used"]} rows={[
        ["Memory index", "FTS + vector index over your repo's files", "Relevant files recalled into every run ('recalled 3 files' chips)"],
        ["Skills", "Recorded GUI macros + learned procedures (usage-scored)", "Auto-applied on matching tasks; /skill attaches one explicitly"],
        ["System profile", "Your machine — distro, tools, quirks (learned locally)", "Injected so agents stop rediscovering your setup"],
        ["Code graph", "Symbols, links, clusters (graphify)", "Recall starts structure-aware, not just text-aware"],
        ["User profile", "How you like to work (you write it in Settings → About you)", "Honored in every session"],
      ]} />
      <P>Re-indexing is throttled per workspace, so busy sessions never pay the indexing tax twice.</P>

      <H2 id="store">One store, every surface</H2>
      <P>
        Sessions, events, changes, schedules, and usage live in one local SQLite store. That&apos;s what makes
        cross-surface sessions real: the desktop, TUI, and CLI are three views of the same history — titles, pins, and
        metadata reconcile newest-wins at boot.
      </P>

      <H2 id="security">Security model</H2>
      <UL items={[
        <><strong>Local-first</strong>: sessions execute on your machine; provider CLIs keep their own credentials — Lectern stores no API keys.</>,
        <><strong>Apply gate</strong>: nothing writes to disk without your acceptance unless you opt into apply/one-shot.</>,
        <><strong>E2EE export &amp; sync</strong>: encrypted session bundles use scrypt + XChaCha20-Poly1305; the optional cloud sees counts and ciphertext only.</>,
        <><strong>Channels</strong>: inbound senders must be allowlisted from the CLI on the machine — a chat message can never approve itself.</>,
        <><strong>Open source</strong>: Apache-2.0 — audit any of this instead of trusting the docs.</>,
      ]} />
      <NextPage href="/docs/integrations" label="MCP, channels & marketplace" />
    </article>
  );
}
