import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { H2, Kbd, NextPage, P, Tbl, UL } from "@/components/docs/DocsBits";
import { TuiDemo } from "@/components/docs/demos/TuiDemo";

export const metadata: Metadata = { title: "Terminal UI — Lectern docs", description: "The whole Lectern cockpit in your terminal." };

export default function TuiDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Terminal UI</h1>
      <P>
        The full product in a terminal: same engine, same brain, same sessions as the app. Ships as a single binary;
        starts (and health-checks) the daemon itself.
      </P>
      <CodeBlock cmd="lectern tui            # resolves the binary from PATH, next to the CLI, or the repo" />
      <CodeBlock cmd='lectern tui --path ~/code/app --backend mock   # target a workspace / free test-drive' />
      <TuiDemo />

      <H2 id="commands">One registry, three ways in</H2>
      <P>
        Every feature is a slash command; most also have a <Kbd>^X</Kbd> leader chord; pickers are fuzzy dialogs.{" "}
        <span className="mono">/help</span> is generated from the registry itself, so it can never drift.
      </P>
      <Tbl head={["Command", "Chord", "What"]} rows={[
        [<span className="mono" key="a">/sessions</span>, "^X s", "Fuzzy session switcher — ★ pinned first, ● running, ^R renames inline"],
        [<span className="mono" key="b">/models</span>, "^X m (or ^P)", "Fuzzy model picker across every provider"],
        [<span className="mono" key="c">/new · /rename · /pin · /export</span>, "^X n · — · ^X p · —", "Session management (export writes md/json into the workspace)"],
        [<span className="mono" key="d">/plan /apply /conduct /one-shot</span>, "— · ^X a · ^X c · ^X o", "Sticky run modes — the status-bar pill tints per mode"],
        [<span className="mono" key="e">/diffs</span>, "^X d", "Full-screen tinted diff viewer for the session's edits"],
        [<span className="mono" key="f">/clean</span>, "^X v", "Hide machinery lines (parity with the app's Clean mode)"],
        [<span className="mono" key="g">/theme</span>, "^X t", "Built-in palette + the desktop theme-manager's JSON files"],
        [<span className="mono" key="h">/brain /skills /usage /mcp-servers</span>, "^X b · ^X k · ^X u · —", "Read-only panels with real store data"],
        [<span className="mono" key="i">/quit</span>, "^X q", "Exit (Esc cancels a running turn)"],
      ]} />

      <H2 id="behavior">Details that make it feel right</H2>
      <UL items={[
        <>Single-focus input — no tab-cycling; the mouse works (wheel scroll, click rows).</>,
        <>Preferences persist in <span className="mono">~/.lectern/tui.json</span> (model, theme, clean) — the TUI&apos;s only file there.</>,
        <>A stale daemon that answers ping but not sessions is rejected with a clear rebuild message.</>,
        <>Need a shell? The TUI lives in your terminal — use your multiplexer; the embedded terminal is the desktop&apos;s job.</>,
      ]} />

      <H2 id="scripting">Headless scripting</H2>
      <CodeBlock cmd='lectern tui --once "add error handling to fetchUser" --backend mock' />
      <P>
        <span className="mono">--once</span> runs a single session and prints the event stream — the same interface our
        CI drive-suite uses (17 scripted steps, captures committed to the repo).
      </P>
      <NextPage href="/docs/cli" label="CLI & daemon" />
    </article>
  );
}
