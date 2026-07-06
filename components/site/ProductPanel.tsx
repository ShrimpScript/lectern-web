/* The hero "product panel" — a faithful static render of a Lectern turn:
   prompt → thinking → plan → diff → response, with a Memory/Skill rail.
   Mirrors the Lectern Website design hero panel. */
const mono = { fontFamily: "var(--font-mono), monospace" } as const;

export function ProductPanel() {
  return (
    <div
      style={{
        border: "1px solid var(--bd)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--elev)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "11px 15px",
          background: "var(--chrome)",
          borderBottom: "1px solid var(--bd2)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ width: 11, height: 11, borderRadius: "50%", border: "1.4px solid var(--bd)" }}
          />
        ))}
        <span className="mono" style={{ marginLeft: 8, fontSize: 12, color: "var(--fg-mute)" }}>
          lectern — acme-web — main
        </span>
        <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--fg-faint)" }}>
          claude code
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 230px" }}>
        {/* conversation */}
        <div
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            borderRight: "1px solid var(--bd2)",
          }}
        >
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "78%",
              background: "var(--panel2)",
              border: "1px solid var(--bd)",
              borderRadius: "11px 11px 3px 11px",
              padding: "11px 14px",
              fontSize: 14,
            }}
          >
            Add a settings page with a dark-mode toggle and wire it into the router.
          </div>

          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12, color: "var(--fg-mute)" }}>
            thinking
            <span style={{ display: "inline-flex", gap: 3 }}>
              {[0, 0.2, 0.4].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--fg-mute)",
                    animation: `dotpulse 1.2s ${d}s infinite`,
                  }}
                />
              ))}
            </span>
          </div>

          <div style={{ border: "1px solid var(--bd)", borderRadius: 9, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
            <div className="kicker" style={{ fontSize: 11 }}>Plan</div>
            <div style={{ fontSize: 13, color: "var(--fg2)" }}>
              ✓&nbsp; Create <span className="mono" style={{ fontSize: 12, color: "var(--fg)" }}>app/settings.tsx</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--fg2)" }}>
              ✓&nbsp; Register <span className="mono" style={{ fontSize: 12, color: "var(--fg)" }}>/settings</span> route
            </div>
            <div style={{ fontSize: 13, color: "var(--fg3)" }}>•&nbsp; Run test suite</div>
          </div>

          <div className="mono" style={{ border: "1px solid var(--bd)", borderRadius: 9, overflow: "hidden", fontSize: 12 }}>
            <div style={{ padding: "8px 12px", background: "var(--chrome)", color: "var(--fg-mute)", display: "flex", justifyContent: "space-between" }}>
              <span>app/settings.tsx</span>
              <span style={{ color: "var(--fg2)" }}>+42 −4</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              <div style={{ display: "flex", gap: 10, padding: "1px 12px", background: "var(--hov)" }}>
                <span style={{ color: "var(--fg3)" }}>+</span>
                <span style={{ color: "var(--term-fg)" }}>export function Settings(){"{"}</span>
              </div>
              <div style={{ display: "flex", gap: 10, padding: "1px 12px", background: "var(--hov)" }}>
                <span style={{ color: "var(--fg3)" }}>+</span>
                <span style={{ color: "var(--term-fg)" }}>&nbsp;&nbsp;const [dark,set]=useTheme()</span>
              </div>
              <div style={{ display: "flex", gap: 10, padding: "1px 12px" }}>
                <span style={{ color: "var(--fg-faint)" }}>−</span>
                <span style={{ color: "var(--fg3)", textDecoration: "line-through" }}>// todo: settings</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--fg2)" }}>
            Done. The settings page is live at{" "}
            <span className="mono" style={{ fontSize: 12, color: "var(--fg)" }}>/settings</span>{" "}
            with a persisted dark-mode toggle. 24 tests pass.
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 16,
                background: "var(--fg)",
                marginLeft: 3,
                verticalAlign: -2,
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        </div>

        {/* memory / skill rail */}
        <div style={{ padding: "16px 14px", background: "var(--tree)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="kicker" style={{ fontSize: 11 }}>Memory</div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: "var(--fg2)", borderLeft: "1px solid var(--bd)", paddingLeft: 10 }}>
            Uses your existing <span style={{ color: "var(--fg)" }}>ThemeProvider</span> — recalled from session #41.
          </div>
          <div className="kicker" style={{ fontSize: 11, marginTop: 6 }}>Skill</div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: "var(--fg2)", borderLeft: "1px solid var(--bd)", paddingLeft: 10 }}>
            “add-route” · learned from this repo
          </div>
        </div>
      </div>
    </div>
  );
}
