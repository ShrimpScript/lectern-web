import type { ReactNode } from "react";

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</h1>
      {sub && <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--fg2)" }}>{sub}</p>}
    </div>
  );
}

export function Panel({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)", marginBottom: 16 }}>
      {(title || action) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          {title && <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Row({ children, last }: { children: ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--bd2)", gap: 16 }}>
      {children}
    </div>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "ok" }) {
  return (
    <span
      className="mono"
      style={{ fontSize: 11, color: tone === "ok" ? "var(--fg)" : "var(--fg2)", border: "1px solid var(--bd)", borderRadius: 6, padding: "3px 9px" }}
    >
      {children}
    </span>
  );
}
