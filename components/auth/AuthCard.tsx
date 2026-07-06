"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp, type AuthResult } from "@/lib/auth/actions";
import { useToast } from "@/components/toast/ToastProvider";

type Mode = "login" | "signup";

export function AuthCard({ mode, next = "/dashboard", initialError }: { mode: Mode; next?: string; initialError?: string }) {
  const router = useRouter();
  const toast = useToast();
  const isSignup = mode === "signup";
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res: AuthResult = isSignup ? await signUp(formData) : await signIn(formData);
      if (res.ok) {
        if ("demo" in res && res.demo) {
          toast.info("Demo mode — connect a database (DATABASE_URL) to create real accounts.");
          return;
        }
        toast.success(isSignup ? "Account created — welcome to Lectern!" : "Welcome back!");
        router.push(next);
        router.refresh();
      } else {
        setError(res.error);
        toast.error(res.error);
      }
    });
  }

  return (
    <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {isSignup ? "Create your account" : "Sign in to Lectern"}
        </div>
        <div style={{ fontSize: 14, color: "var(--fg-mute)", marginTop: 6 }}>
          {isSignup
            ? "Free to start. Bring your backend; keep your memory forever."
            : "Your memory and skills, wherever you work."}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          border: "1px solid var(--bd)",
          borderRadius: 14,
          padding: 24,
          background: "var(--panel)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {isSignup && <Field name="name" label="NAME" placeholder="Alex Rivera" />}
        <Field name="email" label="EMAIL" placeholder="you@company.com" type="email" mono required />
        <Field name="password" label="PASSWORD" placeholder="••••••••••" type="password" mono required />

        {error && (
          <div
            className="mono"
            style={{ fontSize: 12, color: "#e5687a", border: "1px solid #e5687a55", background: "#e5687a14", borderRadius: 8, padding: "8px 11px" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            textAlign: "center",
            background: "var(--btn)",
            color: "var(--btnfg)",
            border: "none",
            borderRadius: 9,
            padding: 12,
            fontWeight: 600,
            fontSize: 14,
            marginTop: 4,
            cursor: pending ? "default" : "pointer",
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? "…" : isSignup ? "Create account" : "Continue"}
        </button>

        <Divider />

        <ProviderLink provider="google" label="Continue with Google" mode={mode} />
        <ProviderLink provider="github" label="Continue with GitHub" mode={mode} />
      </form>

      <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-dim)" }}>
        {isSignup ? (
          <>Already have an account? <Link href="/login" style={{ color: "var(--fg)", fontWeight: 600 }}>Sign in</Link></>
        ) : (
          <>New here? <Link href="/signup" style={{ color: "var(--fg)", fontWeight: 600 }}>Create an account</Link></>
        )}
      </div>
      {!isSignup && (
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--fg-dim)", marginTop: -10 }}>
          <Link href="/login/reset" style={{ color: "var(--fg2)" }}>Forgot your password?</Link>
        </div>
      )}
    </div>
  );
}

function Field({ name, label, placeholder, type = "text", mono, required }: { name: string; label: string; placeholder: string; type?: string; mono?: boolean; required?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--fg-mute)" }}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={type === "password" ? "current-password" : name}
        placeholder={placeholder}
        className={mono ? "mono" : undefined}
        style={{ border: "1px solid var(--bd)", borderRadius: 9, padding: 12, fontSize: mono ? 13 : 14, color: "var(--fg)", background: "var(--elev)", outline: "none" }}
      />
    </label>
  );
}

function Divider() {
  return (
    <div className="mono" style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fg-ghost)", fontSize: 11, margin: "2px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--bd)" }} />OR<div style={{ flex: 1, height: 1, background: "var(--bd)" }} />
    </div>
  );
}

function ProviderLink({ provider, label, mode }: { provider: "google" | "github"; label: string; mode: Mode }) {
  return (
    <a
      href={`/api/auth/${provider}?mode=${mode}`}
      style={{ textAlign: "center", border: "1px solid var(--bd)", background: "transparent", color: "var(--fg)", borderRadius: 9, padding: 11, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
    >
      {label}
    </a>
  );
}
