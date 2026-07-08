import type { Metadata } from "next";
import { H2, NextPage, P, UL, C } from "@/components/docs/DocsBits";

export const metadata: Metadata = { title: "The Hub: skills — Lectern docs", description: "Browse, create, import, and share Lectern skills — recorded macros and learned procedures your agents apply automatically." };

export default function HubDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>The Hub</h1>
      <P>
        A <strong>skill</strong> is a reusable capability Lectern applies for you — either a recorded set of steps or a
        short learned procedure. The Hub is where you browse community skills and manage your own. Matching skills
        auto-apply on a task; you can also attach one explicitly with <C>/skill</C>.
      </P>

      <H2 id="browse">Browse &amp; install</H2>
      <P>
        The Hub lists skills in tiers — official, curated collections, and community — each with what it does and how
        many people use it. Installing one adds it to your local skill set so it can match future tasks. You can browse
        the same catalog <a href="/hub">on this site</a>.
      </P>

      <H2 id="create">Create a skill</H2>
      <UL items={[
        <><strong>Record it.</strong> Start a recording, do the task once, and Lectern captures the concrete steps (commands run, files touched). Exploratory commands like <C>ls</C> or <C>git status</C> are filtered out so the recording stays clean.</>,
        <><strong>Review before saving.</strong> Before it&apos;s stored you can edit the captured steps — rename it, drop a step, fix a command — so a skill is exactly what you meant, not a raw transcript.</>,
        <><strong>Or write one.</strong> A procedural skill is just its rules and steps in a small file; create it from scratch when there&apos;s nothing to record.</>,
      ]} />
      <P>
        A recorded skill <strong>replays its steps</strong> when applied (deterministic, no re-planning tokens); a
        procedural skill guides the model instead. Skills are usage-scored, and one that repeatedly fails pauses itself
        and is surfaced for you to re-enable rather than failing silently.
      </P>

      <H2 id="import">Import a skill</H2>
      <P>
        Have a skill file from someone else? Import it from disk and it joins your set immediately — same as installing
        from the Hub, but from a local bundle. Skills are plain, inspectable files; read one before you run it.
      </P>

      <H2 id="publish">Share your own</H2>
      <P>
        Export a skill to a shareable bundle, or publish it so others can install it from the Hub. Because a skill can
        run commands and edit files, Lectern audits a bundle for prompt-injection and unexpected behavior before it&apos;s
        shared — the same scrutiny you should give anything you import.
      </P>

      <H2 id="safety">Safety</H2>
      <UL items={[
        <>Skills are local files you can read, edit, and delete.</>,
        <>Imported and published skills are audited for injection and surprising behavior.</>,
        <>A failing skill self-pauses; nothing keeps re-running a broken procedure.</>,
      ]} />

      <NextPage href="/docs/desktop" label="The desktop app" />
    </article>
  );
}
