import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { H2, NextPage, P, Tbl } from "@/components/docs/DocsBits";
import { DaemonDemo } from "@/components/docs/demos/DaemonDemo";

export const metadata: Metadata = { title: "CLI & daemon — Lectern docs", description: "Scripting Lectern: the lectern CLI and the lecternd daemon." };

export default function CliDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>CLI &amp; daemon</h1>
      <P>Everything the surfaces do rides on two binaries you can script directly.</P>

      <H2 id="cli">The lectern CLI</H2>
      <Tbl head={["Command", "What"]} rows={[
        [<span className="mono" key="1">lectern open .</span>, "Index a repo as a workspace (the brain's first look)"],
        [<span className="mono" key="2">lectern run \"task\" [--apply] [--backend X] [--model Y]</span>, "One routed session; edits stay behind the Apply gate unless --apply, and it prints a suggested Conventional Commit for the changes"],
        [<span className="mono" key="3">lectern conduct \"goal\" [--apply]</span>, "The Conductor: plan → per-model steps (parallel worktrees) → cross-review"],
        [<span className="mono" key="4">lectern sessions · lectern skills list</span>, "History and learned skills from the local store"],
        [<span className="mono" key="5">lectern export --session ID --out file.lec [--encrypt]</span>, "Portable session export — optionally sealed (scrypt + XChaCha20-Poly1305)"],
        [<span className="mono" key="6">lectern doctor · lectern login</span>, "Environment truth-check · optional E2EE cloud pairing"],
        [<span className="mono" key="7">lectern tui</span>, "Launch the terminal UI"],
      ]} />
      <P><span className="mono">LECTERN_DEBUG=1</span> traces backend spawns and key engine events to stderr.</P>

      <H2 id="daemon">lecternd</H2>
      <P>
        A small local daemon speaking line-delimited JSON-RPC — unix socket on Linux/macOS, localhost + a per-boot
        token on Windows. It powers the TUI, background schedules (30s due-check loop), and any client you write:
      </P>
      <CodeBlock cmd={String.raw`echo '{"jsonrpc":"2.0","id":1,"method":"sessions","params":{"path":"."}}' | nc -U $XDG_RUNTIME_DIR/lectern/lecternd.sock`} />
      <P>
        Methods: <span className="mono">run · cancel · sessions · history · session_rename · session_pin · models ·
        skills · brain · usage · mcp_overview · ping/status</span>. Runs stream AgentEvents as notifications on the
        same connection.
      </P>
      <DaemonDemo />

      <H2 id="schedules">Schedules</H2>
      <P>
        Queue prompts for later from the composer&apos;s clock button (or the store API); the daemon runs them when
        due, with auto-continue after usage limits. The desktop&apos;s Schedule screen shows every queued run and can
        clear the finished ones.
      </P>
      <NextPage href="/docs/engine" label="Engine & brain" />
    </article>
  );
}
