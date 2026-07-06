"use client";
/* Shared rig for the docs' live demos — the same replay language as the hero
   LiveDemo and the app's onboarding scenes: a timed phase machine that pauses
   off-screen, renders the finished frame under reduced motion, and a cursor
   that glides to MEASURED element positions (never hardcoded coordinates). */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export function usePhases(steps: readonly number[], loopPause = 2600) {
  // steps[i] = ms to hold phase i; loops forever; returns [phase, containerRef, reduced]
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (reduced) { setPhase(steps.length - 1); return; }
    if (!inView) return;
    let alive = true;
    let i = phase;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!alive) return;
      const hold = i === steps.length - 1 ? loopPause : steps[i];
      t = setTimeout(() => {
        if (!alive) return;
        i = (i + 1) % steps.length;
        setPhase(i);
        tick();
      }, hold);
    };
    tick();
    return () => { alive = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);
  return [phase, ref, !!reduced] as const;
}

/** Cursor that centers on a measured target element (stage-relative). */
export function useCursor(stageRef: React.RefObject<HTMLDivElement | null>) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [pressed, setPressed] = useState(false);
  const moveTo = (el: Element | null | undefined, dx = 0, dy = 0) => {
    const stage = stageRef.current;
    if (!el || !stage) return;
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPos({ x: r.left - s.left + r.width / 2 + dx, y: r.top - s.top + r.height / 2 + dy });
  };
  const press = () => { setPressed(true); setTimeout(() => setPressed(false), 180); };
  return { pos, moveTo, press, pressed, hide: () => setPos(null) };
}

export function CursorArrow({ pos, pressed }: { pos: { x: number; y: number } | null; pressed: boolean }) {
  if (!pos) return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fg)" stroke="var(--bg)" strokeWidth="1.4"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 30, pointerEvents: "none",
        transform: `translate(${pos.x}px, ${pos.y}px) scale(${pressed ? 0.82 : 1})`,
        transition: "transform .55s cubic-bezier(.3,1,.4,1)" }}>
      <path d="M5 3l14 8-6.5 1.5L9 19z" />
    </svg>
  );
}

export const demoFont = { fontFamily: "var(--font-app), 'IBM Plex Sans', system-ui, sans-serif" } as const;

/** Framed stage with the standard docs-demo chrome. */
export function Stage({ label, children, stageRef, height = 320 }: {
  label: string; children: React.ReactNode; stageRef: React.RefObject<HTMLDivElement | null>; height?: number;
}) {
  return (
    <div style={{ margin: "18px 0 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span aria-hidden style={{ width: 20, height: 20, borderRadius: 6, border: "1px solid var(--bd)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--fg2)" }}>▶</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-dim)" }}>Live demo · {label}</span>
      </div>
      <div ref={stageRef} aria-hidden
        style={{ position: "relative", overflow: "hidden", height, border: "1px solid var(--bd)", borderRadius: 14, background: "var(--panel, var(--elev))", ...demoFont }}>
        {children}
      </div>
    </div>
  );
}

/** Typed-out text helper. */
export function typed(full: string, active: boolean, done: boolean, ms: number, phaseKey: number) {
  // deterministic typing without per-char timers: CSS steps via key’d animation
  return { full, active, done, ms, phaseKey };
}
export function Typer({ text, on, done, speed = 34 }: { text: string; on: boolean; done: boolean; speed?: number }) {
  const [n, setN] = useState(done ? text.length : 0);
  useEffect(() => {
    if (done) { setN(text.length); return; }
    if (!on) { setN(0); return; }
    setN(0);
    const iv = setInterval(() => setN((v) => {
      if (v >= text.length) { clearInterval(iv); return v; }
      return v + 1;
    }), speed);
    return () => clearInterval(iv);
  }, [on, done, text, speed]);
  return <>{text.slice(0, n)}{on && n < text.length ? <span style={{ borderLeft: "2px solid var(--fg)", marginLeft: 1 }} /> : null}</>;
}
