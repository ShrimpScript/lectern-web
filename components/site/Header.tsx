"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";

const NAV = [
  { href: "/", label: "Product" },
  { href: "/#platform", label: "Platform" },
  { href: "/pricing", label: "Free & OSS" },
  { href: "/hub", label: "Hub" },
  { href: "/studies", label: "Studies" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function Header() {
  const pathname = usePathname();
  const user = useAuth();

  /* Springy header morph: past ~80px of scroll the bar compacts and the
     wordmark folds away, leaving the podium mark — the logo "changes". */
  const { scrollY } = useScroll();
  const t = useSpring(useTransform(scrollY, [0, 80], [0, 1]), { stiffness: 170, damping: 26, mass: 0.8 });
  const height = useTransform(t, [0, 1], [62, 50]);
  const nameOpacity = useTransform(t, [0, 0.55], [1, 0]);
  const nameX = useTransform(t, [0, 1], [0, -10]);
  const markScale = useTransform(t, [0, 1], [1, 0.92]);
  const markRotate = useTransform(t, [0, 1], [0, -90]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "color-mix(in srgb, var(--backdrop) 72%, transparent)",
        borderBottom: "1px solid var(--bd2)",
      }}
    >
      <motion.div
        className="container"
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
          <motion.div style={{ scale: markScale, rotate: markRotate, display: "flex" }}>
            <LogoMark />
          </motion.div>
          <motion.div style={{ opacity: nameOpacity, x: nameX, display: "flex" }}>
            <Wordmark />
          </motion.div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14.5, fontWeight: 500, letterSpacing: "0.01em" }}>
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{ color: active ? "var(--fg)" : "var(--fg2)", cursor: "pointer" }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="https://github.com/ShrimpScript/lectern" target="_blank" rel="noreferrer" aria-label="Lectern on GitHub"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 34, padding: "0 12px", borderRadius: 999, border: "1px solid var(--bd)", color: "var(--fg)", fontSize: 12.5, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            GitHub
          </a>
          <ThemeToggle />
          <Link href={user ? "/dashboard" : "/login"} style={{ fontSize: 14, color: "var(--fg2)" }}>
            {user ? "Dashboard" : "Sign in"}
          </Link>
          <Button href="/#download" size="md">
            Download
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
