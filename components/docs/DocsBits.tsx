import Link from "next/link";

/* Shared building blocks for the docs (OSS docs expansion, 2026-07-05).
   DemoSlot = a placeholder that DESCRIBES a future animated preview (same
   JS-driven cursor-scene language as onboarding) without pretending one
   exists yet — Zeke commissions the animations later. */

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return <h2 id={id} style={{ margin: "38px 0 12px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", scrollMarginTop: 90 }}>{children}</h2>;
}
export function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ margin: "24px 0 8px", fontSize: 16.5, fontWeight: 700 }}>{children}</h3>;
}
export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.65, color: "var(--fg-soft)" }}>{children}</p>;
}
export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0 0 16px", paddingLeft: 20, display: "grid", gap: 7 }}>
      {items.map((it, i) => <li key={i} style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--fg-soft)" }}>{it}</li>)}
    </ul>
  );
}
export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mono" style={{ fontSize: 12, padding: "1.5px 6px", border: "1px solid var(--bd)", borderBottom: "2px solid var(--bd)", borderRadius: 6, background: "var(--elev)" }}>{children}</kbd>;
}
export function Tbl({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: "auto", margin: "0 0 18px", border: "1px solid var(--bd)", borderRadius: 10 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13.5 }}>
        <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: "left", padding: "9px 12px", borderBottom: "1px solid var(--bd)", fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-dim)" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "9px 12px", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--bd2)", color: "var(--fg-soft)", lineHeight: 1.5 }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}
/** Planned interactive preview — description only, by design. */
export function DemoSlot({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ margin: "18px 0 22px", border: "1px dashed var(--bd)", borderRadius: 12, padding: "16px 18px", background: "var(--elev)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span aria-hidden style={{ width: 22, height: 22, borderRadius: 7, border: "1px solid var(--bd)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--fg2)" }}>▶</span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-dim)" }}>Interactive demo · planned</span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 650 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg2)", marginTop: 4 }}>{desc}</div>
    </div>
  );
}
/** A monospace command / code block. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mono" style={{ margin: "0 0 16px", padding: "12px 14px", background: "var(--elev)", border: "1px solid var(--bd)", borderRadius: 10, overflowX: "auto", fontSize: 12.5, lineHeight: 1.7, color: "var(--fg)" }}>{children}</pre>
  );
}
/** Inline monospace token. */
export function C({ children }: { children: React.ReactNode }) {
  return <span className="mono" style={{ fontSize: "0.92em" }}>{children}</span>;
}
export function NextPage({ href, label }: { href: string; label: string }) {
  return (
    <div style={{ marginTop: 44, paddingTop: 20, borderTop: "1px solid var(--bd2)" }}>
      <Link href={href} style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", borderBottom: "1px solid var(--bd)" }}>Next: {label} →</Link>
    </div>
  );
}
