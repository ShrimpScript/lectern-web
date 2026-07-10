import type { Metadata } from "next";
import { H2, P, UL, Tbl, C, NextPage } from "@/components/docs/DocsBits";
import { CodeBlock } from "@/components/docs/CodeBlock";

export const metadata: Metadata = { title: "Checkpoints & rewind — Lectern docs", description: "Snapshot the workspace before an agent writes, and rewind if you don't like the result." };

export default function CheckpointsDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Checkpoints &amp; rewind</h1>
      <P>
        Before an agent writes to disk, Lectern snapshots your workspace. If you don&apos;t like what a run did, rewind
        to the snapshot and try a different prompt — the edits are undone, files the agent added are removed, and your
        own git history is never touched.
      </P>

      <H2 id="how">How it works</H2>
      <P>
        A checkpoint is taken automatically at the start of any run that applies changes (a normal apply run or a
        Conductor run). It records the exact state of the workspace before the turn, so that turn becomes a point you
        can return to.
      </P>
      <P>
        Snapshots live in a private, per-workspace git store under <C>~/.lectern/checkpoints/</C> whose work tree is
        your project folder. It is completely separate from your project&apos;s own <C>.git</C> — a different git
        directory, its own identity, your global git config disabled. That means checkpoints work even on folders that
        aren&apos;t git repositories, and can never change your real history, index, branches, or hooks.
      </P>

      <H2 id="rewind">Rewinding</H2>
      <P>From the CLI, list the points you can return to and rewind to one:</P>
      <CodeBlock cmd={String.raw`lectern checkpoint list
lectern rewind <id>     # or: lectern rewind        (the most recent)`} />
      <P>
        In the desktop app, every run leaves a <strong>Checkpoint</strong> marker in the chat. Click <strong>Restore</strong>,
        confirm, and the workspace snaps back to that snapshot; the file tree refreshes and the original prompt drops
        into the composer so you can adjust it and run again.
      </P>
      <P>
        Rewinding is itself reversible. Before it restores, Lectern snapshots the current state as a redo point — so
        <C>lectern rewind &lt;redo-id&gt;</C> (printed after every rewind) puts you right back.
      </P>

      <H2 id="captured">What&apos;s captured</H2>
      <P>A snapshot mirrors your working tree, minus noise and secrets:</P>
      <Tbl head={["Included", "Excluded"]} rows={[
        ["Source, config, docs — your working files", <>Build output (<C>node_modules</C>, <C>target</C>, <C>dist</C>, …)</>],
        ["Anything your project would normally track", <>Your project&apos;s own <C>.git</C> and the <C>.lectern</C> brain store</>],
        [<>Binary files (restored byte-for-byte)</>, <>Secrets — <C>.env</C> and <C>.env.*</C> are never snapshotted</>],
      ]} />
      <P>
        Your workspace&apos;s <C>.gitignore</C> is honored automatically, and the excludes above are always applied on
        top — so a checkpoint stays small and never captures a plaintext copy of your credentials.
      </P>

      <H2 id="safety">Isolation &amp; safety</H2>
      <UL items={[
        <>Your project&apos;s own git repository is never touched — its <C>HEAD</C>, index, and <C>git status</C> are unchanged across a checkpoint and a rewind.</>,
        <>Secrets are left alone: because <C>.env</C> files aren&apos;t snapshotted, a rewind never rolls back (or stores a copy of) your credentials.</>,
        <>The default home workspace isn&apos;t checkpointed — snapshots are for project folders you open.</>,
        <>Everything stays on your machine; the shadow store is local, alongside your brain.</>,
      ]} />

      <NextPage href="/docs/security" label="Trust & security" />
    </article>
  );
}
