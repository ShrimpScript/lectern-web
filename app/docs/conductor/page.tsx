import type { Metadata } from "next";
import { H2, NextPage, P, Tbl, UL, C, Code } from "@/components/docs/DocsBits";
import { ConductDemo } from "@/components/docs/demos/ConductDemo";

export const metadata: Metadata = { title: "The Conductor & routing — Lectern docs", description: "How Auto picks a model per task, and how /conduct plans, fans out, and cross-reviews a goal across providers." };

export default function ConductorDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>The Conductor &amp; routing</h1>
      <P>
        Lectern can drive several agents at once — Claude Code, Antigravity (Gemini), OpenCode and its free/OpenRouter
        models. Two mechanisms decide <em>which</em> model does <em>what</em>: <strong>Auto</strong> routing for single
        tasks, and the <strong>Conductor</strong> (<C>/conduct</C>) for multi-step goals.
      </P>

      <H2 id="auto">Auto: one task, the right model</H2>
      <P>
        With the model set to <strong>Auto</strong>, each task is routed by rules you can read and edit in{" "}
        <C>~/.lectern/routing.json</C> (open it from Settings → Routing). Rules match on the shape of the task and send
        it to a fitting model; an optional fast classifier breaks ties on ambiguous prompts.
      </P>
      <Tbl head={["Task looks like", "Routed to", "Why"]} rows={[
        ["A one-word fix or rename", "A small, fast model (e.g. Haiku)", "Cheap and instant; no reasoning needed"],
        ["Architecture / a hard bug", "A strong reasoner (e.g. Opus)", "Depth matters more than latency"],
        ["Screenshot / visual task", "A vision model (e.g. Gemini Flash)", "Best at images, and fast"],
        ["No rule matches", "Your default, or the classifier's pick", "Sensible fallback, never a hard fail"],
      ]} />
      <P>Routing is fully local and inspectable — nothing is sent anywhere to decide where a task goes.</P>

      <H2 id="conduct">/conduct: a goal across providers</H2>
      <P>
        <C>/conduct &lt;goal&gt;</C> treats the request as a project, not a single turn. It runs four stages:
      </P>
      <UL items={[
        <><strong>Plan</strong> — the goal is decomposed into concrete sub-tasks with their dependencies.</>,
        <><strong>Route</strong> — each sub-task is classified and assigned to the model best suited to it (same idea as Auto, per step).</>,
        <><strong>Fan out</strong> — independent sub-tasks run <em>in parallel</em>, each in its own git worktree so they can&apos;t collide.</>,
        <><strong>Cross-review &amp; merge</strong> — a <em>different</em> provider reviews each result before it&apos;s merged back, so no single model grades its own work.</>,
      ]} />
      <ConductDemo />
      <P>
        The cross-provider review is the point: a bug one model introduces is often caught by another with different
        blind spots. You can run it as a one-off (<C>/conduct fix the flaky test and document it</C>) or toggle it on for
        a session.
      </P>

      <H2 id="worktrees">Why parallel steps stay safe</H2>
      <P>
        Fanned-out steps each get an isolated git worktree, so two agents editing at once never overwrite each other.
        Results merge back only after review; a step that fails review is redone rather than silently accepted.
      </P>

      <H2 id="cli">From the CLI</H2>
      <Code>{`lectern conduct "add rate limiting to the API and cover it with tests"
# plans, routes each sub-task, runs independent ones in parallel,
# cross-reviews across providers, then merges`}</Code>

      <NextPage href="/docs/brain" label="The brain: memory & recall" />
    </article>
  );
}
