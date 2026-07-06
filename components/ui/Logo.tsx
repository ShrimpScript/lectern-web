/* The Lectern mark — a podium/lectern glyph (square + upright stand + base bar).
   From Lectern-Brain/02-Design-System/Brand & Identity.md */
export function LogoMark({ size = 22, color }: { size?: number; color?: string }) {
  const c = color ?? "var(--fg)";
  const bar = Math.round(size * 0.5);
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${c}`,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 2, height: bar, background: c }} />
      <div style={{ position: "absolute", bottom: 3, width: bar, height: 2, background: c }} />
    </div>
  );
}

export function Wordmark({ size = 18, color }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.02em",
        color: color ?? "var(--fg)",
      }}
    >
      Lectern
    </span>
  );
}

export function LogoLockup({ href = "/" }: { href?: string }) {
  return (
    <a href={href} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
      <LogoMark />
      <Wordmark />
    </a>
  );
}
