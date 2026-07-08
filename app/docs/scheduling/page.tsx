import type { Metadata } from "next";
import { H2, NextPage, P, Tbl, C, Code } from "@/components/docs/DocsBits";

export const metadata: Metadata = { title: "Scheduling — Lectern docs", description: "Queue a prompt to run later in a workspace; the Lectern daemon runs it when it's due." };

export default function SchedulingDocs() {
  return (
    <article>
      <div className="kicker">Documentation</div>
      <h1 style={{ margin: "14px 0 10px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>Scheduling</h1>
      <P>
        Any prompt can be queued to run later in a specific workspace. The <strong>Schedule</strong> view (desktop) lists
        everything queued across every workspace; the Lectern daemon (<C>lecternd</C>) runs each one when it comes due.
      </P>

      <H2 id="desktop">From the desktop</H2>
      <P>
        Open the clock button in a chat&apos;s composer to queue that prompt in that session&apos;s folder, pick when it
        should run, and it appears in the Schedule view as <C>pending</C>. When the daemon runs it, the status moves to{" "}
        <C>done</C> (or <C>error</C>), and the result is a normal session you can open. The view also clears finished
        entries and cancels pending ones.
      </P>

      <H2 id="cli">From the CLI</H2>
      <Code>{`lectern schedule add --at +2h --backend opencode "run the test suite and summarize failures"
lectern schedule list                 # pending / done / cancelled, with time-to-run
lectern schedule cancel 55151f86      # by the short id the list prints
lectern schedule run-due              # run everything currently due (what the daemon calls)`}</Code>
      <P>
        <C>--at</C> accepts <C>now</C>, a relative offset (<C>+30m</C>, <C>+2h</C>, <C>+1d</C>), or a Unix timestamp.
        Cancel accepts the short id shown by <C>schedule list</C>, and tells you if nothing matched rather than pretending
        it worked.
      </P>

      <H2 id="daemon">How due tasks run</H2>
      <Tbl head={["State", "Meaning"]} rows={[
        [<C key="a">pending</C>, "Queued; not yet due"],
        [<C key="b">running</C>, "Claimed by the daemon and executing (a guard stops two runners double-firing)"],
        [<C key="c">done</C>, "Finished; open it as a session"],
        [<C key="d">error</C> , "The run failed; the reason is recorded"],
        [<C key="e">cancelled</C>, "You cancelled it before it ran"],
      ]} />
      <P>
        The daemon claims a due task atomically before running it, so a second daemon (or a manual <C>run-due</C>) can
        never fire the same task twice. Keep <C>lecternd</C> running for schedules to fire on their own; without it,{" "}
        <C>schedule run-due</C> runs whatever is due on demand.
      </P>

      <NextPage href="/docs/hub" label="The Hub: skills" />
    </article>
  );
}
