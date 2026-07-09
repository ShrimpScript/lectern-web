import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/Legal";

export const metadata: Metadata = { title: "Privacy Policy — Lectern" };

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="June 26, 2026"
      sections={[
        { h: "The short version", p: ["Lectern is local-first. Your source code, prompts, and API keys stay on your device. The cloud (getlectern.vercel.app) only ever receives, with your opt-in, anonymous usage counts and end-to-end-encrypted memory/skills blobs we cannot read. We never train on your data."] },
        { h: "What stays on your device", p: ["Repository contents, conversations/prompts, and backend credentials (API keys, tokens) are stored locally — in files we manage and in your system keychain. They are never transmitted to our servers."] },
        { h: "What the cloud collects", p: ["Account data (email, name, plan) for authentication and billing.", "Opt-in usage telemetry: counts only (sessions, tokens, cost, backend used) — no code or prompts.", "Optional sync: end-to-end-encrypted blobs of memory/skills plus minimal metadata (ids, sizes, timestamps). We store ciphertext."] },
        { h: "What we send to model providers", p: ["When you use a backend (Claude Code or Antigravity), the context for your task goes to that provider — that is the engine you chose. Lectern minimizes what is sent and uses local embeddings for indexing so memory-building does not fan out. We add no extra hop."] },
        { h: "Cookies", p: ["We use a strictly-necessary session cookie for authentication. Analytics, if any, are privacy-respecting and disclosed."] },
        { h: "Your rights", p: ["Export or delete your data at any time from Settings, or by contacting hello@getlectern.vercel.app. We honor GDPR/CCPA requests."] },
        { h: "Contact", p: ["hello@getlectern.vercel.app"] },
      ]}
    />
  );
}
