"use client";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/Button";
import { HeroField } from "./HeroField";
import { LiveDemo } from "./LiveDemo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.9 } },
};

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Pointer-reactive glow — a soft light that trails the cursor. */
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--fg) 5%, transparent), transparent 70%)`;

  /* Gentle parallax: the demo panel drifts up slower than the page scrolls. */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const panelY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div
      ref={rootRef}
      onPointerMove={(e) => {
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-600);
        my.set(-600);
      }}
      style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--bd2)" }}
    >
      {/* ambient constellation (brain-graph nod) */}
      <motion.div style={{ position: "absolute", inset: 0, y: fieldY }} aria-hidden>
        <HeroField />
      </motion.div>
      {/* radial glow — theme-aware via --fg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--fg) 7%, transparent), transparent 60%)",
        }}
      />
      {/* masked gridlines — theme-aware via --fg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--fg) 3%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--fg) 3%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(80% 70% at 50% 0%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 0%, #000, transparent 75%)",
        }}
      />
      {/* pointer-follow glow */}
      <motion.div aria-hidden style={{ position: "absolute", inset: 0, background: glow }} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          position: "relative",
          maxWidth: 1000,
          margin: "0 auto",
          padding: "96px 28px 70px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          variants={rise}
          className="kicker"
          style={{ letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 28 }}
        >
          You bring the car · we&apos;re the V8
        </motion.div>
        <motion.h1
          variants={rise}
          className="display"
          style={{
            margin: "0 0 6px",
            fontWeight: 900,
            fontSize: "clamp(64px, 13vw, 184px)",
            lineHeight: 0.86,
            letterSpacing: "-0.05em",
            background: "linear-gradient(100deg,#5a5a55 0%,var(--fg) 30%,var(--fg) 70%,#5a5a55 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "sheen 7s linear infinite",
          }}
        >
          LECTERN
        </motion.h1>
        <motion.p
          variants={rise}
          style={{ margin: "28px 0 0", fontSize: 19, lineHeight: 1.55, color: "var(--fg-soft)", maxWidth: 600 }}
        >
          One cockpit for Claude Code and Antigravity — on your desktop and in your terminal.
          Lectern plans each task, routes it to the model that&apos;s best at it, and shares one
          brain and one session history across every surface. Local-first, Linux-first,
          free &amp; open source.
        </motion.p>
        <motion.div
          variants={rise}
          style={{ display: "flex", gap: 12, marginTop: 38, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Button href="/#download" size="lg">Download for Linux</Button>
          <Button href="/docs" variant="ghost" size="lg">Read the docs →</Button>
        </motion.div>
        <motion.div
          variants={rise}
          style={{ marginTop: 22, fontSize: 13, fontWeight: 500, color: "var(--fg-faint)" }}
        >
          .deb + AppImage · free to start
        </motion.div>
      </motion.div>

      <motion.div style={{ position: "relative", maxWidth: 880, margin: "0 auto", padding: "0 28px 92px", y: panelY }}>
        <motion.div
          initial={{ opacity: 0, y: 46, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 19, mass: 1, delay: 0.55 }}
        >
          <LiveDemo />
        </motion.div>
      </motion.div>
    </div>
  );
}
