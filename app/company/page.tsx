import type { Metadata } from "next";
import { MarketingPage, Prose, H2 } from "@/components/marketing/Page";

export const metadata: Metadata = { title: "Company — Lectern" };

export default function CompanyPage() {
  return (
    <MarketingPage kicker="Company" title="An engine for the AI you already pay for." lede="We're building the layer that turns interchangeable coding agents into a teammate that remembers.">
      <Prose>
        <H2>Why we exist</H2>
        <p>Coding agents got good fast — and stayed stateless. Each session forgets your project, your conventions, your decisions. We think the durable value isn't another model; it's the engine around it: memory, learned skills, adaptive context, and freedom from lock-in.</p>
        <H2>Principles</H2>
        <p><b style={{ color: "var(--fg)" }}>Local-first.</b> Your code and keys stay on your machine. The cloud is optional and content-blind.</p>
        <p><b style={{ color: "var(--fg)" }}>Backend-agnostic.</b> Bring Claude Code or Antigravity. Switch anytime; keep your memory and skills.</p>
        <p><b style={{ color: "var(--fg)" }}>Linux-native.</b> We build for Linux first — proper packages, systemd, sandboxing — not a Mac port.</p>
        <p><b style={{ color: "var(--fg)" }}>Honest tooling.</b> Show the work — plan, diffs, commands — and never fake progress.</p>
        <H2>Careers</H2>
        <p>We're a small team that ships. If Rust systems work, local-first product design, or developer-tools growth is your thing, write to <a href="/contact" style={{ color: "var(--fg2)" }}>careers@lectern.ai</a>.</p>
      </Prose>
    </MarketingPage>
  );
}
