"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/lib/auth/actions";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/usage", label: "Usage" },
  { href: "/dashboard/backends", label: "Backends & keys" },
  { href: "/dashboard/tokens", label: "API tokens" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 14, position: "sticky", top: 90, alignSelf: "start" }}>
      <div className="kicker" style={{ fontSize: 11, letterSpacing: "0.16em", padding: "6px 10px", marginBottom: 6 }}>Account</div>
      {NAV.map((n) => {
        const active = n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              fontWeight: active ? 600 : 400,
              background: active ? "var(--panel2)" : "transparent",
              border: active ? "1px solid var(--bd)" : "1px solid transparent",
              color: active ? "var(--fg)" : "var(--fg2)",
            }}
          >
            {n.label}
          </Link>
        );
      })}
      <div style={{ marginTop: 18, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
        <button
          onClick={() => start(async () => { await signOut(); router.push("/"); router.refresh(); })}
          disabled={pending}
          style={{ textAlign: "left", background: "transparent", border: "1px solid var(--bd)", color: "var(--fg2)", borderRadius: 8, padding: "8px 12px", fontSize: 13, cursor: "pointer" }}
        >
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
