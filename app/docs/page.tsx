import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { H2, NextPage, P, UL } from "@/components/docs/DocsBits";
import { TourDemo } from "@/components/docs/demos/TourDemo";
import { ApplyGateDemo } from "@/components/docs/demos/ApplyGateDemo";

export const metadata: Metadata = {
  title: "Docs — Lectern",
  description: "Set up Lectern and understand the ecosystem: desktop app, terminal UI, CLI, engine.",
};

export default function DocsOverview() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Overview &amp; setup</h1>
      <P>
        Lectern is one cockpit for the coding agents you already use — <strong>Claude Code</strong>,{" "}
        <strong>Antigravity</strong> (Gemini), and <strong>OpenCode</strong> (OpenRouter + free models). It adds what
        they don&apos;t have alone: a <strong>Conductor</strong> that routes each task to the best model, a{" "}
        <strong>persistent brain</strong> (memory, skills, your machine&apos;s profile, a code graph), and{" "}
        <strong>one session history</strong> shared by the desktop app, the terminal UI, and the CLI. Local-first,
        Linux-first, open source under Apache-2.0.
      </P>
      <TourDemo />

      <H2 id="install">1 · Get the pieces</H2>
      <P>Everything builds from one public repo. From a fresh clone:</P>
      <CodeBlock cmd="git clone https://github.com/ShrimpScript/lectern && cd lectern && cargo build" />
      <UL items={[
        <><strong>Desktop app</strong>: <span className="mono">cd apps/desktop && npm install && npm run app</span> (Linux needs the WebKitGTK dev libs; unsigned Windows/macOS builds come off public CI — see Downloads).</>,
        <><strong>Terminal UI</strong>: <span className="mono">cd apps/tui && bun install</span>, then <span className="mono">./target/debug/lectern tui</span> — or compile the single binary with <span className="mono">bun build --compile</span>.</>,
        <><strong>CLI + daemon</strong>: built by the cargo command above (<span className="mono">lectern</span>, <span className="mono">lecternd</span>).</>,
      ]} />

      <H2 id="providers">2 · Connect the AI you already pay for</H2>
      <P>
        Lectern drives each provider&apos;s own CLI, so your keys and logins never touch Lectern. Sign in to Claude
        Code (<span className="mono">claude</span>) and/or Antigravity (<span className="mono">agy</span>) once, then:
      </P>
      <CodeBlock cmd="lectern doctor   # verifies Claude Code, Antigravity, OpenCode" />
      <P>
        No keys at all? OpenCode&apos;s built-in free models work with zero configuration, and the{" "}
        <span className="mono">mock</span> backend exercises every pipeline for nothing.
      </P>
      <P>
        <strong>Want zero cloud?</strong> Point Lectern at{" "}
        <a href="https://ollama.com" target="_blank" rel="noreferrer" style={{ color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>Ollama</a>{" "}
        and it runs <strong>entirely on your machine</strong> — no API keys, no per-token bill, and nothing leaves the
        box. Install Ollama, pull a code-tuned model, and Lectern auto-detects it (the model picker flags the ones that
        are strong for coding):
      </P>
      <CodeBlock cmd="curl -fsSL https://ollama.com/install.sh | sh && ollama pull qwen3-coder" />
      <P>
        Local quality scales with your hardware — a code model like <span className="mono">qwen3-coder</span> shines on a
        24-32GB GPU or Mac, while a smaller one still handles everyday edits on a 16GB laptop. It&apos;s the most direct
        answer to the two things developers most want from an agent: no surprise token bill, and code that never leaves
        their machine.
      </P>

      <H2 id="first-run">3 · First run</H2>
      <CodeBlock cmd={'cd ~/code/your-repo && lectern run "explain this repo"'} />
      <P>
        The first run indexes the repo into the brain; every later session starts already knowing your code. In the
        desktop app the same happens when you open a folder. Without <span className="mono">--apply</span>, edits are
        proposals held behind the <strong>Apply gate</strong> until you accept them.
      </P>
      <ApplyGateDemo />

      <H2 id="map">Where to next</H2>
      <P>By feature — what each part does and how it works:</P>
      <UL items={[
        <><a href="/docs/commands"><strong>Chat commands</strong></a> — every slash command, and how skill replay works.</>,
        <><a href="/docs/conductor"><strong>Conductor &amp; routing</strong></a> — how Auto picks a model, and how <span className="mono">/conduct</span> plans, fans out, and cross-reviews.</>,
        <><a href="/docs/brain"><strong>The brain</strong></a> — memory, recall without draining tokens, the code graph.</>,
        <><a href="/docs/scheduling"><strong>Scheduling</strong></a> — queue a prompt; the daemon runs it when due.</>,
        <><a href="/docs/hub"><strong>The Hub</strong></a> — create, import, and share skills.</>,
      ]} />
      <P>By surface:</P>
      <UL items={[
        <><a href="/docs/desktop"><strong>Desktop app</strong></a> — every surface of the cockpit, from tiles to the preview rail.</>,
        <><a href="/docs/tui"><strong>Terminal UI</strong></a> — the whole product in your terminal.</>,
        <><a href="/docs/cli"><strong>CLI &amp; daemon</strong></a> — scripting, scheduling, encrypted export.</>,
        <><a href="/docs/engine"><strong>Engine internals</strong></a> — backends, the store, the security model.</>,
        <><a href="/docs/integrations"><strong>MCP &amp; channels</strong></a> — tools and remote access.</>,
      ]} />
      <NextPage href="/docs/commands" label="Chat commands" />
    </article>
  );
}
