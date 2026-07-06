import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { ResetConfirmForm } from "@/components/auth/ResetConfirmForm";

export const metadata: Metadata = { title: "Reset password — Lectern" };

export default async function ResetConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <ResetConfirmForm token={token} />
      </main>
    </>
  );
}
