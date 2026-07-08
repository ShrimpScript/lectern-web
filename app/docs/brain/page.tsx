import type { Metadata } from "next";
import { H2, NextPage, P, Tbl, UL, C, Code } from "@/components/docs/DocsBits";

export const metadata: Metadata = { title: "The brain: memory & recall — Lectern docs", description: "How Lectern indexes a workspace, recalls the right files without draining tokens, and layers skills, a code graph, and profiles on top." };

export default function BrainDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>The brain</h1>
      <P>
        Every run is fed by a local brain that knows your project. It has five layers, all stored on your machine in
        one SQLite index — nothing is uploaded to recall.
      </P>
      <Tbl head={["Layer", "What it holds", "How it's used"]} rows={[
        ["Memory index", "A lexical (FTS) + vector index of your repo's files", "Relevant files are recalled into a run"],
        ["Skills", "Recorded macros + learned procedures, usage-scored", "Auto-applied on matching tasks; attach one with /skill"],
        ["Code graph", "Symbols, references, clusters (graphify)", "Recall starts structure-aware, not just text-aware"],
        ["System profile", "Your machine — distro, tools, quirks", "Injected so agents stop rediscovering your setup"],
        ["User profile", "How you like to work (Settings → About you)", "Honored in every session"],
      ]} />

      <H2 id="recall">Recall, without draining tokens</H2>
      <P>
        When you send a message, Lectern finds the files most relevant to it by fusing two signals — keyword search and
        vector similarity — and ranking the results together. The key design choice is what happens next:
      </P>
      <UL items={[
        <><strong>Pointer, not payload.</strong> The agent is handed the <em>paths</em> of the relevant files and reads only the ones it actually needs with its own tools. Lectern never bulk-loads your whole memory into the prompt.</>,
        <><strong>A relevance floor.</strong> A match has to clear a similarity threshold to count. A greeting like &quot;hey how&apos;s it going&quot; has no genuine match, so it recalls <em>nothing</em> — instead of surfacing whatever scored least-badly.</>,
        <><strong>Snippets, not whole files.</strong> When content itself is needed, only the most relevant window of a file enters context, not the entire file. In practice a task&apos;s recalled context drops by roughly 9× versus injecting whole files.</>,
      ]} />
      <P>
        Together these mean recall costs a handful of tokens on a real task and zero on small talk — you get the right
        context without paying to re-load everything each turn.
      </P>

      <H2 id="index">Indexing</H2>
      <P>
        Opening a workspace indexes its text files (build output, <C>node_modules</C>, <C>.git</C>, and generated
        graph caches are skipped). Re-indexing is throttled per workspace, so an active session never pays the indexing
        cost twice. You can turn the brain off entirely for a run with an environment flag if you want a purely stateless
        agent.
      </P>
      <Code>{`LECTERN_NO_BRAIN=1 lectern run "..."   # no recall, no skill matching`}</Code>

      <H2 id="code-graph">The code graph</H2>
      <P>
        If you build a graphify graph for a repo, recall becomes structure-aware: alongside text matches it can surface
        the functions and types related to your task, and the Brain view shows the graph&apos;s size and its most
        connected symbols. The graph&apos;s own cache is excluded from recall so it never crowds out real source.
      </P>

      <H2 id="privacy">What leaves your machine</H2>
      <UL items={[
        <>Recall, indexing, skills, and profiles are <strong>entirely local</strong>.</>,
        <>The only thing sent to a model is the task plus the short list of recalled paths (and any snippet the agent chooses to read).</>,
        <>Turn it off per run with <C>LECTERN_NO_BRAIN=1</C>; delete the index by removing the workspace from Lectern.</>,
      ]} />

      <NextPage href="/docs/scheduling" label="Scheduling" />
    </article>
  );
}
