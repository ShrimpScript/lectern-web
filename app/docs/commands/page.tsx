import type { Metadata } from "next";
import { H2, NextPage, P, Tbl, UL, C, Code } from "@/components/docs/DocsBits";

export const metadata: Metadata = { title: "Chat commands — Lectern docs", description: "Every slash command in a Lectern chat, and what each one changes about the run." };

export default function CommandsDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Chat commands</h1>
      <P>
        Type <C>/</C> in any chat composer to see the list. Commands either change how the <em>next</em> message runs
        (a sticky mode) or act once. Anything that isn&apos;t a command is sent to the agent as a task.
      </P>

      <H2 id="reference">Reference</H2>
      <Tbl head={["Command", "What it does"]} rows={[
        [<C key="c">/plan</C>, <>Plan mode: the agent proposes changes and shows a diff, but nothing is written to your repo until you accept. The default, safe posture.</>],
        [<C key="c">/apply</C>, <>Apply mode: edits land directly in your working tree as the agent makes them. Use once you trust the run.</>],
        [<C key="c">/conduct</C>, <>Toggle Conductor mode, or <C>/conduct &lt;task&gt;</C> for a single orchestrated run: the goal is planned, sub-tasks fan out to the model best at each, and the result is cross-reviewed. See <a href="/docs/conductor">the Conductor</a>.</>],
        [<C key="c">/one-shot</C>, <>Toggle autonomous build, or <C>/one-shot &lt;brief&gt;</C> for one run: from a short brief the agent plans the full scope and builds it end to end, auto-applying. Runs longer than a normal turn.</>],
        [<C key="c">/skill</C>, <>Attach a learned skill by name (<C>/skill</C> lists them). A recorded skill <strong>replays its steps</strong> on send; a procedural skill guides the next message.</>],
        [<C key="c">/clear</C>, <>Clear the current conversation and start fresh in the same workspace.</>],
        [<C key="c">/help</C>, <>List the available commands inline.</>],
      ]} />

      <H2 id="modes">Plan vs. apply vs. one-shot</H2>
      <P>
        Plan and apply are about <em>who accepts the edits</em>. One-shot is about <em>scope</em>: it hands the agent a
        goal and lets it work autonomously until done. They combine with your chosen model and with Conductor mode.
      </P>
      <UL items={[
        <><strong>Plan</strong> — review every diff before it&apos;s written. Best for unfamiliar code.</>,
        <><strong>Apply</strong> — edits stream straight into the repo. Best once you&apos;re moving fast.</>,
        <><strong>One-shot</strong> — a brief in, a finished change out; the agent plans and executes the whole thing.</>,
      ]} />

      <H2 id="replay">How skill replay works</H2>
      <P>
        When you record a skill, Lectern captures the concrete steps you took (the commands run, files touched, the
        recipe). Attaching that skill with <C>/skill &lt;name&gt;</C> and sending <strong>replays those exact steps</strong>{" "}
        rather than asking the model to re-derive them — deterministic, and it spends no reasoning tokens re-planning a
        procedure you&apos;ve already proven. Skills also auto-apply when a task clearly matches one; the{" "}
        <a href="/docs/hub">Hub</a> is where you create, edit, and share them.
      </P>
      <Code>{`# attach a recorded skill, then send your message to replay it
/skill deploy-preview`}</Code>

      <NextPage href="/docs/conductor" label="The Conductor & routing" />
    </article>
  );
}
