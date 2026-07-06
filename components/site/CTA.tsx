"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Motion";

export function CTA() {
  return (
    <div className="container" style={{ padding: "110px 28px 116px", textAlign: "center" }}>
      <motion.h2
        className="display"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 110, damping: 17, mass: 0.9 }}
        style={{
          margin: 0,
          fontSize: "clamp(44px, 7vw, 72px)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          background: "linear-gradient(100deg,#5a5a55 0%,var(--fg) 30%,var(--fg) 70%,#5a5a55 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "sheen 7s linear infinite",
        }}
      >
        Start the engine.
      </motion.h2>
      <Reveal delay={0.12}>
        <p style={{ margin: "20px 0 0", fontSize: 18, color: "var(--fg2)" }}>
          Free to download. Bring your own backend. Keep your memory forever.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <Button href="/#download" size="lg">Download for Linux</Button>
          <Button href="/pricing" variant="ghost" size="lg">See pricing</Button>
        </div>
      </Reveal>
    </div>
  );
}
