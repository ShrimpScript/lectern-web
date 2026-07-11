import type { Metadata } from "next";
import { H2, NextPage, P, UL, Tbl, C } from "@/components/docs/DocsBits";

export const metadata: Metadata = { title: "Trust & security — Lectern docs", description: "How Lectern keeps your code and machine safe: local-first data, the apply gate, prompt-injection handling, and skill trust." };

export default function SecurityDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Trust &amp; security</h1>
      <P>
        Lectern runs on your machine and drives coding agents that can read your files and run commands. That power
        is exactly why the trust model matters. Here is what protects you — and what doesn&apos;t, stated plainly.
      </P>

      <H2 id="local-first">Local-first data</H2>
      <P>
        &quot;Local-first&quot; means different things. Lectern is <strong>local-first data</strong>: your code, sessions,
        history, the brain (memory, skills, machine profile), and settings live on your machine in a local SQLite
        store and plain files. Provider CLIs keep their own logins — <strong>Lectern stores no API keys</strong>.
      </P>
      <UL items={[
        <>The model can be <strong>cloud</strong> (Claude Code, Antigravity/Gemini) or <strong>fully local</strong> (Ollama, or OpenCode&apos;s free models) — your choice, per session.</>,
        <>Recall sends only the short list of relevant <em>paths</em> (and any snippet the agent chooses to read), never your whole codebase. Disable it entirely for a run with <C>LECTERN_NO_BRAIN=1</C>.</>,
        <>Lectern is fully local — no accounts, no sign-in, nothing leaves your machine. Encrypted session bundles (for moving a session between your own machines) use scrypt + XChaCha20-Poly1305.</>,
      ]} />

      <H2 id="apply-gate">The apply gate</H2>
      <P>
        By default Lectern runs in <strong>plan mode</strong>: the agent proposes changes and shows diffs, but{" "}
        <strong>nothing is written to disk until you accept it</strong>. Writing only happens when you opt in —{" "}
        <C>/apply</C> (or <C>--apply</C>) lets edits land, <C>--yolo</C> also lets it run commands. This is the
        single most important control: the default posture cannot modify your repo on its own.
      </P>

      <H2 id="injection">Prompt injection</H2>
      <P>
        Indirect prompt injection — a malicious file, code comment, docstring, or tool response trying to hijack the
        run — is the leading risk for coding agents. Lectern reduces it at the source: the trusted context it
        prepends (recalled files, matched skills) closes with an explicit instruction telling the agent to treat
        file contents, comments, and tool output as <strong>untrusted data, not instructions</strong>, and to follow
        only your task. Combined with the apply gate, a directive that does slip into context lands as a bad
        suggestion you can reject, not a silent write.
      </P>

      <H2 id="skills">Skill trust</H2>
      <P>
        A skill can run commands and edit files, so the Hub treats it like code you&apos;re about to execute:
      </P>
      <Tbl head={["Control", "What it does"]} rows={[
        ["AI security audit", "Every publish runs a free-model audit for prompt-injection and surprising behavior before a skill can ship"],
        ["sha256 integrity", "The hub index stamps each bundle's hash; the client refuses a skill whose contents don't match, on both review and install"],
        ["Self-pausing", "A skill that keeps failing pauses itself and is surfaced for you to re-enable — nothing keeps re-running a broken procedure"],
        ["Readable", "Skills are plain, inspectable files — read one before you run it"],
      ]} />

      <H2 id="channels">Remote channels</H2>
      <P>
        Channels (Telegram today) let you task your agent from a phone. Inbound senders must be{" "}
        <strong>allowlisted from the CLI on the machine</strong> — a chat message can never approve its own pairing.
        Lectern never edits channel access; that stays deliberately in the terminal, because an inbound message is
        itself an injection surface.
      </P>

      <H2 id="open">Auditable by design</H2>
      <P>
        The whole ecosystem is open source under Apache-2.0. None of the above is a claim you have to trust — the
        engine, the apply gate, recall, and the skill audit are all on{" "}
        <a href="https://github.com/ShrimpScript/lectern" target="_blank" rel="noreferrer" style={{ color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>GitHub</a> to read.
      </P>

      <NextPage href="/docs/desktop" label="The desktop app" />
    </article>
  );
}
