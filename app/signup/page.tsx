import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Create account — Lectern" };

export default function SignupPage() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "calc(100vh - 62px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 28px",
        }}
      >
        <AuthCard mode="signup" />
      </main>
    </>
  );
}
