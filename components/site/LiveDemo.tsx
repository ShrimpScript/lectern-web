"use client";
/* The hero product panel, alive — a looped replay of one real Lectern turn,
   rendered with the app's ACTUAL anatomy (mirrors apps/desktop/src/App.tsx):
   IBM Plex Sans, the /conduct skill chip on the user bubble, the sweeping
   "Thinking…", collapsible machinery rows (Memory · / Routed to / Edited),
   the app's diff tints, and the streaming caret. Pauses while off-screen;
   renders the completed final frame under reduced motion. */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Motion";

const CMD = "/conduct ";
const TASK = "Add a settings page with a dark-mode toggle and wire it into the router.";
const PROMPT = CMD + TASK;

type Seg = { t: string; code?: boolean };
const RESPONSE: Seg[] = [
  { t: "Done — the settings page is live at " },
  { t: "/settings", code: true },
  { t: " with a persisted dark-mode toggle. 24 tests pass." },
];
const RESPONSE_LEN = RESPONSE.reduce((n, s) => n + s.t.length, 0);

const PHASES = ["boot", "typing", "sent", "thinking", "memory", "plan", "routed", "diff", "response", "hold", "reset"] as const;
type Phase = (typeof PHASES)[number];
const at = (p: Phase) => PHASES.indexOf(p);

const appFont = { fontFamily: "var(--font-app), 'IBM Plex Sans', system-ui, sans-serif" } as const;

function TypedSegments({ segs, n }: { segs: Seg[]; n: number }) {
  let left = n;
  return (
    <>
      {segs.map((s, i) => {
        if (left <= 0) return null;
        const take = Math.min(left, s.t.length);
        left -= take;
        const text = s.t.slice(0, take);
        return s.code ? (
          <code
            key={i}
            className="mono"
            style={{ background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 5px", fontSize: "0.88em" }}
          >
            {text}
          </code>
        ) : (
          <span key={i}>{text}</span>
        );
      })}
    </>
  );
}

/* App's Collapsible summary row, verbatim look (non-interactive replay). */
function Row({ mono, open, children }: { mono?: boolean; open?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, maxWidth: "100%", color: "var(--fg3)", fontSize: 12.5 }}>
      <span style={{ flexShrink: 0, fontSize: 10, transform: open ? "rotate(90deg)" : "none", opacity: 0.65, transition: "transform .15s ease" }}>▸</span>
      <span className={mono ? "mono" : undefined} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
    </div>
  );
}

const enter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: EASE },
};

const DIFF_LINES = [
  { kind: "add", text: "export function Settings(){" },
  { kind: "add", text: "  const [dark,set]=useTheme()" },
  { kind: "remove", text: "// todo: settings" },
] as const;

export function LiveDemo() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25 });
  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  /* Start from the SSR empty frame (no hydration mismatch); the effect
     immediately completes it under reduced motion. */
  const [phase, setPhase] = useState<Phase>("boot");
  const [typedN, setTypedN] = useState(0);
  /* Cursor actor (mission B7) — the app's onboarding language ported to the site:
     glides to MEASURED positions (the growing text edge, then the chip-morph spot),
     presses, fades. Same curve as the app (.45,.1,.25,1). */
  const convoRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; on: boolean; pressed: boolean }>({ x: 560, y: 40, on: false, pressed: false });
  const cursorToBubbleEdge = (dx = 6, dy = 0) => {
    const c = convoRef.current, b = bubbleRef.current;
    if (!c || !b) return;
    const cr = c.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    setCursor((p) => ({ ...p, x: br.right - cr.left + dx, y: br.top - cr.top + br.height / 2 + dy, on: true }));
  };
  const cursorToBubbleStart = () => {
    const c = convoRef.current, b = bubbleRef.current;
    if (!c || !b) return;
    const cr = c.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    setCursor((p) => ({ ...p, x: br.left - cr.left + 26, y: br.top - cr.top + 14, on: true }));
  };
  const [planN, setPlanN] = useState(0);
  const [diffN, setDiffN] = useState(0);
  const [respN, setRespN] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase("hold");
      setTypedN(PROMPT.length);
      setPlanN(3);
      setDiffN(3);
      setRespN(RESPONSE_LEN);
      return;
    }
    let alive = true;
    const sleep = async (ms: number) => {
      let remaining = ms;
      let last = performance.now();
      while (alive && remaining > 0) {
        await new Promise((r) => setTimeout(r, 50));
        const now = performance.now();
        if (inViewRef.current && document.visibilityState === "visible") remaining -= now - last;
        last = now;
      }
    };
    (async () => {
      while (alive) {
        setPhase("boot");
        setTypedN(0);
        setPlanN(0);
        setDiffN(0);
        setRespN(0);
        setCursor({ x: 560, y: 40, on: false, pressed: false });
        await sleep(700);
        if (!alive) break;
        setPhase("typing");
        for (let i = 1; i <= PROMPT.length && alive; i++) {
          setTypedN(i);
          if (i === 1 || i % 9 === 0) requestAnimationFrame(() => cursorToBubbleEdge());
          await sleep(15);
        }
        requestAnimationFrame(() => cursorToBubbleStart());
        await sleep(300);
        setPhase("sent");
        setCursor((p) => ({ ...p, pressed: true }));
        await sleep(190);
        setCursor((p) => ({ ...p, pressed: false }));
        await sleep(410);
        setPhase("thinking");
        setCursor((p) => ({ ...p, on: false }));
        await sleep(1600);
        setPhase("memory");
        await sleep(750);
        setPhase("plan");
        await sleep(500);
        setPlanN(1);
        await sleep(520);
        setPlanN(2);
        await sleep(650);
        setPhase("routed");
        await sleep(800);
        setPhase("diff");
        await sleep(420);
        setDiffN(1);
        await sleep(280);
        setDiffN(2);
        await sleep(280);
        setDiffN(3);
        await sleep(700);
        setPlanN(3);
        await sleep(600);
        setPhase("response");
        for (let i = 1; i <= RESPONSE_LEN && alive; i++) {
          setRespN(i);
          await sleep(13);
        }
        setPhase("hold");
        await sleep(4600);
        setPhase("reset");
        await sleep(480);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduced]);

  const p = at(phase);
  const sent = p >= at("sent");
  const showThinking = p >= at("thinking") && p < at("memory");
  const showMemory = p >= at("memory");
  const showPlan = p >= at("plan");
  const routed = p >= at("routed");
  const showDiff = p >= at("diff");
  const showResp = p >= at("response");
  const testsDone = planN >= 3;

  return (
    <div>
      <div
        ref={rootRef}
        style={{
          border: "1px solid var(--bd)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--bg)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 15px",
            background: "var(--chrome)",
            borderBottom: "1px solid var(--bd2)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", border: "1.4px solid var(--bd)" }} />
          ))}
          <span className="mono" style={{ marginLeft: 8, fontSize: 12, color: "var(--fg-mute)" }}>
            lectern — acme-web — main
          </span>
          <motion.span
            key={routed ? "routed" : "conductor"}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mono"
            style={{ marginLeft: "auto", fontSize: 12, color: "var(--fg-faint)" }}
          >
            {routed ? "claude code · Opus 4.8" : "conductor"}
          </motion.span>
        </div>

        {/* conversation — the app's real anatomy */}
        <motion.div
          ref={convoRef}
          animate={{ opacity: phase === "reset" ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            ...appFont,
            padding: "20px 22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 13,
            minHeight: 396,
            position: "relative",
          }}
        >
          {!reduced && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fg)" stroke="var(--bg)" strokeWidth="1.4" aria-hidden
              style={{ position: "absolute", left: 0, top: 0, zIndex: 6, pointerEvents: "none", opacity: cursor.on ? 1 : 0, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.35))", transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${cursor.pressed ? 0.82 : 1})`, transition: "transform .8s cubic-bezier(.45,.1,.25,1), opacity .45s ease" }}>
              <path d="M5 3l14 8-6.5 1.5L9 19z" />
            </svg>
          )}
          {typedN > 0 && (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "82%",
                background: "var(--panel2)",
                border: "1px solid var(--bd)",
                borderRadius: "13px 13px 4px 13px",
                padding: "10px 14px",
                fontSize: 14,
                lineHeight: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {sent && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "var(--fg)",
                    border: "1px solid var(--fg)",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  conduct
                </motion.span>
              )}
              <span ref={bubbleRef} style={{ whiteSpace: "pre-wrap" }}>
                {sent ? (
                  TASK
                ) : (
                  <>
                    <span className="mono" style={{ fontSize: 13, color: "var(--fg2)" }}>{PROMPT.slice(0, Math.min(typedN, CMD.length))}</span>
                    {typedN > CMD.length ? PROMPT.slice(CMD.length, typedN) : null}
                    <span className="demo-caret" />
                  </>
                )}
              </span>
            </div>
          )}

          {showThinking && (
            <motion.div {...enter} style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              <span className="demo-think">Thinking…</span>
            </motion.div>
          )}

          {showMemory && (
            <motion.div {...enter}>
              <Row>Memory · recalled your ThemeProvider from session #41</Row>
            </motion.div>
          )}

          {showPlan && (
            <motion.div
              {...enter}
              style={{
                border: "1px solid var(--bd)",
                borderRadius: 10,
                padding: "13px 15px",
                display: "flex",
                flexDirection: "column",
                gap: 7,
                background: "var(--panel)",
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg2)", letterSpacing: "-0.01em" }}>Plan</div>
              {[
                { done: planN >= 1, text: <>Create <code className="mono" style={{ background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 5px", fontSize: "0.88em" }}>app/settings.tsx</code></> },
                { done: planN >= 2, text: <>Register the <code className="mono" style={{ background: "var(--chrome)", border: "1px solid var(--bd2)", borderRadius: 5, padding: "1px 5px", fontSize: "0.88em" }}>/settings</code> route</> },
                { done: testsDone, text: <>Run the test suite</> },
              ].map((st, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, lineHeight: 1.5, color: st.done ? "var(--fg)" : "var(--fg2)" }}>
                  <span style={{ color: st.done ? "var(--fg)" : "var(--fg3)" }}>{st.done ? "✓" : "•"}</span>
                  <span>{st.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {routed && (
            <motion.div {...enter}>
              <Row>Routed to Opus 4.8</Row>
            </motion.div>
          )}

          {showDiff && (
            <motion.div {...enter} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Row mono open>
                <span style={{ display: "inline-flex", gap: 10 }}>
                  Edited app/settings.tsx <span style={{ opacity: 0.8 }}>+42 −4</span>
                </span>
              </Row>
              <div style={{ paddingLeft: 18 }}>
                <div className="mono" style={{ background: "var(--elev)", border: "1px solid var(--bd2)", borderRadius: 8, padding: "8px 0", lineHeight: 1.5, fontSize: 12 }}>
                  {DIFF_LINES.slice(0, diffN).map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      style={{
                        padding: "0 11px",
                        whiteSpace: "pre",
                        color: l.kind === "add" ? "var(--diffAddFg)" : "var(--diffRmFg)",
                        background: l.kind === "add" ? "var(--diffAddBg)" : "var(--diffRmBg)",
                      }}
                    >
                      {l.kind === "add" ? "+ " : "− "}
                      {l.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {showResp && (
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg)" }}>
              <TypedSegments segs={RESPONSE} n={respN} />
              {phase === "response" && <span className="demo-caret" />}
            </div>
          )}
        </motion.div>
      </div>
      <div className="mono" style={{ textAlign: "center", marginTop: 14, fontSize: 11.5, color: "var(--fg-faint)" }}>
        replay — a real Lectern turn
      </div>
    </div>
  );
}
