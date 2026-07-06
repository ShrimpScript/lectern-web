import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "ghost";
type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "lg";
  style?: CSSProperties;
  onClick?: () => void;
};

function styleFor(variant: Variant, size: "md" | "lg"): CSSProperties {
  const pad = size === "lg" ? "14px 24px" : "9px 15px";
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    borderRadius: 10,
    padding: pad,
    fontWeight: 600,
    fontSize: size === "lg" ? 15 : 14,
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "opacity .15s ease, background .15s ease",
  };
  if (variant === "primary") {
    return { ...base, background: "var(--btn)", color: "var(--btnfg)" };
  }
  return { ...base, background: "transparent", color: "var(--fg)", borderColor: "var(--bd)" };
}

export function Button({ children, href, variant = "primary", size = "md", style, onClick }: Props) {
  const s = { ...styleFor(variant, size), ...style };
  if (href) {
    const external = href.startsWith("http");
    if (external) return <a href={href} style={s}>{children}</a>;
    return <Link href={href} style={s}>{children}</Link>;
  }
  return <button type="button" style={s} onClick={onClick}>{children}</button>;
}
