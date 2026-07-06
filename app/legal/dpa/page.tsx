import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/Legal";

export const metadata: Metadata = { title: "Data Processing Addendum — Lectern" };

export default function DpaPage() {
  return (
    <LegalDoc
      title="Data Processing Addendum"
      updated="June 26, 2026"
      sections={[
        { h: "Scope", p: ["This DPA applies where Lectern processes personal data on behalf of a customer (controller) under GDPR/UK GDPR/CCPA. Lectern acts as processor for cloud account, billing, and opt-in usage/sync data."] },
        { h: "Nature of processing", p: ["Because Lectern is local-first, the bulk of processing (code, prompts) happens on the customer's own devices and is not processed by Lectern. Cloud processing is limited to account data, content-free usage counts, and end-to-end-encrypted sync blobs."] },
        { h: "Subprocessors", p: ["We use a limited set of subprocessors, listed at /legal/subprocessors. We provide notice of changes and impose equivalent data-protection obligations on each."] },
        { h: "Security", p: ["Encryption in transit and at rest; E2E encryption of sync blobs; least-privilege access; signed releases. See the Security page."] },
        { h: "Data subject requests & deletion", p: ["We assist controllers with access/erasure requests and delete or return personal data on termination, subject to legal retention requirements."] },
        { h: "Contact", p: ["dpo@getlectern.vercel.app"] },
      ]}
    />
  );
}
