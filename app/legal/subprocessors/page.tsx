import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/Legal";

export const metadata: Metadata = { title: "Subprocessors — Lectern" };

export default function SubprocessorsPage() {
  return (
    <LegalDoc
      title="Subprocessors"
      updated="June 26, 2026"
      sections={[
        { h: "Overview", p: ["Lectern uses the subprocessors below for cloud features only. None receive your source code, prompts, or API keys (those stay on your device). We require equivalent data-protection terms from each."] },
        { h: "Current subprocessors", p: [
          "Vercel — web hosting / edge for getlectern.vercel.app.",
          "Neon — managed Postgres (accounts, usage rollups, entitlements, sync index).",
          "Stripe — payment processing and billing.",
          "Resend — transactional email (verification, receipts, invites).",
          "Object storage (S3-compatible / Vercel Blob) — end-to-end-encrypted sync blobs and release artifacts (ciphertext only).",
        ] },
        { h: "Note on AI providers", p: ["The model backends you connect (e.g. Anthropic, OpenAI) are NOT our subprocessors — you choose and contract with them directly, and your task context goes to them by your choice, not via us."] },
        { h: "Changes", p: ["We post updates here and notify customers of material changes. Contact hello@getlectern.vercel.app to subscribe to change notices."] },
      ]}
    />
  );
}
