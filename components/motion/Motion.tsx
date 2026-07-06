"use client";
/* Motion primitives for the marketing site — thin wrappers over motion/react.
   All entrances are scroll-triggered (whileInView), fire once, and inherit
   MotionConfig reducedMotion="user" so OS-level reduced-motion neutralizes them. */
import { MotionConfig, motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* Calm deceleration curve — matches the app's "calm motion" rule. */
export const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* Gentle spring for scroll entrances — a touch of life without bounce-house. */
export const SPRING = { type: "spring", stiffness: 135, damping: 19, mass: 0.9 } as const;

export function Reveal({
  children,
  delay = 0,
  y = 26,
  amount = 0.35,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...SPRING, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* Parent/child pair for staggered grids and lists. The Stagger carries the
   layout styles (grid/flex); each Item animates in sequence. */
export function Stagger({
  children,
  gap = 0.09,
  amount = 0.2,
  style,
}: {
  children: ReactNode;
  gap?: number;
  amount?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  y = 22,
  style,
}: {
  children: ReactNode;
  y?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: SPRING },
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* Card hover: a restrained lift + hairline border brighten. No color, no glow —
   depth comes from shadow and border weight, per the design language. */
export function LiftCard({
  children,
  style,
  href,
}: {
  children: ReactNode;
  style?: CSSProperties;
  href?: string;
}) {
  const base: CSSProperties = {
    border: "1px solid var(--bd2)",
    borderRadius: 14,
    background: "linear-gradient(180deg, var(--panel), var(--elev))",
    ...style,
  };
  const hover = {
    y: -4,
    borderColor: "var(--bd)",
    boxShadow: "var(--shadow-pop)",
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
  };
  if (href) {
    return (
      <motion.a href={href} whileHover={hover} style={{ ...base, display: "block", color: "inherit" }}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.div whileHover={hover} style={base}>
      {children}
    </motion.div>
  );
}
