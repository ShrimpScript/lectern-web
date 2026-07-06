export function CodeBlock({ cmd }: { cmd: string }) {
  return (
    <div
      className="mono"
      style={{
        background: "var(--term-bg)",
        border: "1px solid var(--bd)",
        borderRadius: 10,
        padding: "13px 16px",
        fontSize: 13.5,
        color: "var(--term-fg)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0 0 14px",
      }}
    >
      <span>
        <span style={{ color: "var(--fg-dim)" }}>$ </span>
        {cmd}
      </span>
      <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>copy</span>
    </div>
  );
}
