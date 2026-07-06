import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/parts";
import { TokensClient } from "@/components/dashboard/TokensClient";

export const metadata: Metadata = { title: "API tokens — Lectern" };

export default function TokensPage() {
  return (
    <div>
      <PageHeader title="API tokens" sub="Personal tokens for the lectern CLI and CI. Stored hashed — shown once on creation." />
      <TokensClient />
    </div>
  );
}
