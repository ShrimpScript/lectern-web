import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/Legal";

export const metadata: Metadata = { title: "Terms of Service — Lectern" };

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="June 26, 2026"
      sections={[
        { h: "Agreement", p: ["By downloading or using Lectern you agree to these terms. If you use Lectern for an organization, you agree on its behalf."] },
        { h: "The service", p: ["Lectern is an engine that orchestrates AI coding backends you supply. You are responsible for your own backend subscriptions/keys and for complying with those providers' terms."] },
        { h: "Plans & billing", p: ["Paid plans (Pro, Team) are billed via Stripe, monthly or annually. You can cancel anytime; access continues through the paid period. Fees are non-refundable except where required by law."] },
        { h: "Acceptable use", p: ["Don't use Lectern to violate the law, infringe rights, or abuse connected providers. Don't attempt to exfiltrate other users' data or break the marketplace's signing/sandboxing."] },
        { h: "Your content", p: ["You retain all rights to your code and data. We claim no ownership and do not train on it."] },
        { h: "Warranty & liability", p: ["The service is provided \"as is.\" To the extent permitted by law, our liability is limited to the amount you paid in the prior 12 months."] },
        { h: "Changes", p: ["We may update these terms; material changes will be announced. Continued use constitutes acceptance."] },
        { h: "Contact", p: ["legal@lectern.ai"] },
      ]}
    />
  );
}
