import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Sign in — Lectern" };

const ERRORS: Record<string, string> = {
  oauth_unconfigured: "Social sign-in isn't configured in this environment yet. Use email + password, or configure the OAuth provider.",
  oauth_state: "Sign-in session expired. Please try again.",
  oauth_failed: "Couldn't complete social sign-in. Please try again.",
  unknown_provider: "Unknown sign-in provider.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <AuthCard mode="login" next={next ?? "/dashboard"} initialError={error ? ERRORS[error] ?? "Sign-in failed." : undefined} />
      </main>
    </>
  );
}
