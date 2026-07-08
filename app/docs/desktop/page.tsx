import type { Metadata } from "next";
import { H2, H3, Kbd, NextPage, P, Tbl, UL } from "@/components/docs/DocsBits";
import { CrossSurfaceDemo } from "@/components/docs/demos/CrossSurfaceDemo";
import { AnatomyDemo } from "@/components/docs/demos/AnatomyDemo";
import { RailDemo } from "@/components/docs/demos/RailDemo";

export const metadata: Metadata = { title: "Desktop app — Lectern docs", description: "Every surface of the Lectern desktop cockpit." };

export default function DesktopDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Desktop app</h1>
      <P>The cockpit: chats, the Personal Agent, the brain, usage, settings — one native window (Tauri, not Electron).</P>

      <H2 id="chats">Chats & sessions</H2>
      <P>
        Every chat is a session against a project folder. Sessions live in the <strong>engine store</strong>, so the
        same history is visible from the TUI and CLI; a session started elsewhere appears in your sidebar
        automatically, and renames from any surface win by recency.
      </P>
      <UL items={[
        <><strong>Folders as projects</strong> — right-click to create projects, drag chats between them.</>,
        <><strong>Pin</strong> chats to keep them on top (★ shows everywhere, including the TUI).</>,
        <><strong>Search</strong> filters the sidebar as you type.</>,
        <><strong>Export / import</strong> — right-click a chat: JSON (re-importable) or Markdown (readable).</>,
      ]} />
      <CrossSurfaceDemo />

      <H2 id="composer">The composer</H2>
      <P>Type a task, or start with <Kbd>/</Kbd> for the command menu. Attach images with the paperclip or paste them; the mic does offline dictation (faster-whisper — nothing leaves your machine).</P>
      <Tbl head={["Command", "What it does"]} rows={[
        [<span className="mono" key="a">/plan · /apply</span>, "Propose-only (default) vs write-changes mode for this chat"],
        [<span className="mono" key="b">/one-shot &lt;brief&gt;</span>, "Autonomous build: plans the full scope, builds, applies"],
        [<span className="mono" key="c">/conduct &lt;task&gt;</span>, "The Conductor: plan → route each step to the best model → cross-review"],
        [<span className="mono" key="d">/skill [name]</span>, "List learned skills or attach one to your next message"],
        [<span className="mono" key="e">/mcp [server]</span>, "List connected MCP servers or target one"],
        [<span className="mono" key="f">/record</span>, "Record a GUI demonstration → replayable skill"],
        [<span className="mono" key="g">/clear · /help</span>, "Clear the conversation · list everything"],
      ]} />

      <H2 id="anatomy">Reading a run</H2>
      <P>
        Runs stream with full anatomy: memory-recall chips, thinking time, plan cards with live checkmarks, file-edit
        chips (+added −removed with tinted previews), terminal rows, token usage. The{" "}
        <strong>Clean / Verbose</strong> toggle collapses machinery into one expandable strip when you just want the
        conversation.
      </P>
      <AnatomyDemo />

      <H2 id="tiles">Tiles & the session terminal</H2>
      <UL items={[
        <><strong>Tiles</strong> — split any chat right/down (tmux-style), each pane its own session; drag the divider to resize; focused pane gets the outline.</>,
        <><strong>Terminal</strong> — every chat has a real shell (button in the header) in the session&apos;s folder. If Docker containers or SSH hosts exist on your machine they appear in the engine picker; absent engines stay invisible. Lectern never touches credentials — your own docker/ssh auth is used.</>,
      ]} />

      <H2 id="workpanel">The work panel & preview rail</H2>
      <P>
        The right rail tracks the run: <strong>Files</strong> changed, <strong>Agents</strong> (Conductor sub-steps),{" "}
        <strong>Shells</strong>, <strong>Todos</strong>, and <strong>Preview</strong> — edited files rendered (markdown
        or code), images, and any links the conversation mentions. Your pick stays pinned while the agent keeps
        working; nothing steals focus.
      </P>
      <RailDemo />

      <H2 id="brain-usage">Brain & Usage pages</H2>
      <UL items={[
        <><strong>Brain</strong> — what Lectern knows per workspace: system profile, code graph clusters, memory files, skills, sessions — as a live force-graph.</>,
        <><strong>Usage</strong> — tokens by day (GitHub-style activity grid or bars), by provider, by session. Read from your local history, never the cloud.</>,
      ]} />

      <H2 id="settings">Settings that matter</H2>
      <UL items={[
        <><strong>Providers &amp; models</strong> — live status per provider and what each unlocks; pick a default or leave <em>Auto</em> routing. Not installed? Each row expands an OS-aware setup panel with the exact install command, a one-click install for the safe user-space installers (OpenCode, Ollama), and links to the full guide.</>,
        <><strong>Tools (MCP)</strong> — one-click catalog; adds register across Claude Code, OpenCode, and Antigravity with truthful per-agent chips.</>,
        <><strong>Remote access</strong> — channels (Telegram today): allowlisted senders can task your agent from a phone.</>,
        <><strong>Routing rules</strong> — the editable <span className="mono">routing.json</span> the Conductor and Auto mode follow, plus an optional classifier.</>,
        <><strong>Themes</strong> — built-in light/dark plus shareable JSON theme files (the TUI reads the same files).</>,
        <><strong>About</strong> — version, license, and the GitHub link (it&apos;s all open source).</>,
      ]} />
      <NextPage href="/docs/tui" label="Terminal UI" />
    </article>
  );
}
