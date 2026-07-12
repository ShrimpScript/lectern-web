"use client";
/* Charts for /studies. Monochrome by design-system rule: series identity rides on
   lightness (ink vs mid-gray), never hue — inherently colorblind-safe. One axis,
   thin bars with rounded data-ends, direct value labels in mono, hover tooltip
   per mark, and a full table view below for accessibility. */
import { useState } from "react";
import type { Study, StudyTask, BrainStudy } from "@/lib/data/studies";

const INK = "var(--fg)";        // conductor — the arm under scrutiny
const MID = "var(--fg-faint)";  // single — the baseline

function fmt(n: number) {
  return n.toLocaleString("en-US");
}
function pct(a: number, b: number) {
  if (!a) return "—";
  const p = Math.round((b / a - 1) * 100);
  return `${p >= 0 ? "+" : ""}${p}%`;
}

/* ── legend ────────────────────────────────────────────────────────────── */
export function Legend() {
  const item = (color: string, label: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: 14, height: 8, borderRadius: 3, background: color, display: "inline-block" }} />
      <span style={{ fontSize: 12.5, color: "var(--fg2)" }}>{label}</span>
    </span>
  );
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      {item(MID, "single — one model, one call")}
      {item(INK, "conductor — plan · execute · review")}
    </div>
  );
}

/* ── grouped horizontal bars: tokens per task ──────────────────────────── */
export function TokensChart({ study }: { study: Study }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...study.tasks.flatMap((t) => [t.single.tokens, t.conductor.tokens]));
  const bar = (t: StudyTask, arm: "single" | "conductor") => {
    const v = t[arm].tokens;
    const w = Math.max(1.5, (v / max) * 100);
    const active = hover === t.id;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 15 }}>
        <div
          aria-label={`${t.id} ${arm}: ${fmt(v)} tokens`}
          style={{
            width: `${w}%`,
            height: arm === "conductor" ? 15 : 15,
            background: arm === "conductor" ? INK : MID,
            borderRadius: "0 4px 4px 0",
            opacity: hover && !active ? 0.35 : 1,
            transition: "opacity 120ms ease, width 400ms ease",
          }}
        />
        <span className="mono" style={{ fontSize: 11, color: active ? "var(--fg)" : "var(--fg-dim)", whiteSpace: "nowrap" }}>
          {fmt(v)}
        </span>
      </div>
    );
  };
  return (
    <div role="figure" aria-label="Mean total tokens per task, single vs conductor">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {study.tasks.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => setHover(t.id)}
            onMouseLeave={() => setHover(null)}
            style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, alignItems: "center", cursor: "default" }}
          >
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 12, color: hover === t.id ? "var(--fg)" : "var(--fg2)" }}>{t.id}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)", marginTop: 1 }}>
                {t.planSteps > 1 ? `${t.planSteps}-step plan` : "1-step"}
                {hover === t.id ? ` · ${pct(t.single.tokens, t.conductor.tokens)} tokens` : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {bar(t, "single")}
              {bar(t, "conductor")}
            </div>
          </div>
        ))}
      </div>
      {/* one x-axis, recessive */}
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, marginTop: 10 }}>
        <span />
        <div style={{ borderTop: "1px solid var(--bd2)", paddingTop: 5, display: "flex", justifyContent: "space-between" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>0</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>mean total tokens per run · max {fmt(max)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── overhead split: where the Conductor's cost concentrates ───────────── */
export function OverheadSplit({ study }: { study: Study }) {
  const groups = [
    { label: "single-step tasks", tasks: study.tasks.filter((t) => t.planSteps <= 1) },
    { label: "multi-step tasks", tasks: study.tasks.filter((t) => t.planSteps > 1) },
  ].map((g) => {
    const s = g.tasks.reduce((a, t) => a + t.single.tokens, 0) / Math.max(1, g.tasks.length);
    const c = g.tasks.reduce((a, t) => a + t.conductor.tokens, 0) / Math.max(1, g.tasks.length);
    return { ...g, overhead: Math.round((c / s - 1) * 100) };
  });
  const max = Math.max(...groups.map((g) => g.overhead), 1);
  return (
    <div role="figure" aria-label="Conductor token overhead by task complexity">
      {groups.map((g) => (
        <div key={g.label} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, alignItems: "center", marginBottom: 10 }}>
          <div className="mono" style={{ fontSize: 12, color: "var(--fg2)", textAlign: "right" }}>
            {g.label}
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>{g.tasks.length} tasks</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: `${Math.max(2, (g.overhead / max) * 100)}%`, height: 15, background: INK, borderRadius: "0 4px 4px 0" }} />
            <span className="mono" style={{ fontSize: 12, color: "var(--fg)" }}>+{g.overhead}%</span>
          </div>
        </div>
      ))}
      <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--fg-dim)", gridColumn: "2" }}>
        Conductor token overhead vs single, grouped by how far the task decomposes.
      </p>
    </div>
  );
}

/* ── stat row ──────────────────────────────────────────────────────────── */
export function StatRow({ study }: { study: Study }) {
  const s = study.summary;
  const cell = (value: string, label: string, sub?: string) => (
    <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--bd2)" }}>
      <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--fg2)", marginTop: 3 }}>{label}</div>
      {sub && <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-ghost)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", border: "1px solid var(--bd2)", borderLeft: "none", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--panel)" }}>
      {cell(`${s.singlePass}/${s.singleRuns} · ${s.conductorPass}/${s.conductorRuns}`, "tasks passed, single · conductor", "deterministic graders")}
      {cell(pct(s.singleTokens, s.conductorTokens), "Conductor token overhead", `${fmt(s.singleTokens)} → ${fmt(s.conductorTokens)} mean`)}
      {cell(`${(s.conductorWallS / s.singleWallS).toFixed(1)}×`, "Conductor wall-time cost", `${s.singleWallS}s → ${s.conductorWallS}s mean`)}
    </div>
  );
}

/* ── full table view (the accessible reading of the same data) ─────────── */
export function TaskTable({ study }: { study: Study }) {
  const th: React.CSSProperties = { textAlign: "right", padding: "8px 12px", fontSize: 11, color: "var(--fg-dim)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" };
  const td: React.CSSProperties = { textAlign: "right", padding: "7px 12px", fontSize: 12.5 };
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--bd2)", borderRadius: "var(--radius)" }}>
      <table className="mono" style={{ width: "100%", borderCollapse: "collapse", background: "var(--panel)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--bd2)" }}>
            <th style={{ ...th, textAlign: "left" }}>task</th>
            <th style={th}>plan</th>
            <th style={th}>single tok</th>
            <th style={th}>conductor tok</th>
            <th style={th}>overhead</th>
            <th style={th}>single wall</th>
            <th style={th}>conductor wall</th>
            <th style={th}>passed</th>
          </tr>
        </thead>
        <tbody>
          {study.tasks.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid var(--bd2)" }}>
              <td style={{ ...td, textAlign: "left", color: "var(--fg)" }}>{t.id}</td>
              <td style={{ ...td, color: "var(--fg-dim)" }}>{t.planSteps}</td>
              <td style={{ ...td, color: "var(--fg2)" }}>{fmt(t.single.tokens)}</td>
              <td style={{ ...td, color: "var(--fg2)" }}>{fmt(t.conductor.tokens)}</td>
              <td style={{ ...td, color: "var(--fg)" }}>{pct(t.single.tokens, t.conductor.tokens)}</td>
              <td style={{ ...td, color: "var(--fg-dim)" }}>{t.single.wallS}s</td>
              <td style={{ ...td, color: "var(--fg-dim)" }}>{t.conductor.wallS}s</td>
              <td style={{ ...td, color: "var(--fg2)" }}>{t.single.passed + t.conductor.passed}/{t.single.runs + t.conductor.runs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── head-to-head: raw agent vs Lectern on the same model ──────────────── */
import type { HardStudy } from "@/lib/data/studies";

export function HeadToHeadChart({ study }: { study: HardStudy }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...study.headToHead.flatMap((t) => [t.raw, t.lectern]));
  const bar = (v: number, color: string, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 15 }}>
      <div aria-label={label} style={{ width: `${Math.max(1.5, (v / max) * 100)}%`, height: 15, background: color, borderRadius: "0 4px 4px 0", transition: "width 400ms ease" }} />
      <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", whiteSpace: "nowrap" }}>{fmt(v)}</span>
    </div>
  );
  return (
    <div role="figure" aria-label="Tokens per task: raw Claude Code vs Lectern driving the same model">
      <div style={{ display: "flex", gap: 18, marginBottom: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 14, height: 8, borderRadius: 3, background: MID }} />
          <span style={{ fontSize: 12.5, color: "var(--fg2)" }}>raw Claude Code — no Lectern</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 14, height: 8, borderRadius: 3, background: INK }} />
          <span style={{ fontSize: 12.5, color: "var(--fg2)" }}>Lectern + Claude Code</span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {study.headToHead.map((t) => (
          <div key={t.id} onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}
            style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 12, color: hover === t.id ? "var(--fg)" : "var(--fg2)" }}>{t.id.replace("hard-", "")}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>{hover === t.id ? pct(t.raw, t.lectern) + " with Lectern" : ""}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {bar(t.raw, MID, `${t.id} raw: ${fmt(t.raw)} tokens`)}
              {bar(t.lectern, INK, `${t.id} lectern: ${fmt(t.lectern)} tokens`)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, marginTop: 10 }}>
        <span />
        <div style={{ borderTop: "1px solid var(--bd2)", paddingTop: 5, display: "flex", justifyContent: "space-between" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>0</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-ghost)" }}>total tokens per run · same Claude Code subscription</span>
        </div>
      </div>
    </div>
  );
}

export function ArmsTable({ study }: { study: HardStudy }) {
  const th: React.CSSProperties = { textAlign: "right", padding: "8px 12px", fontSize: 11, color: "var(--fg-dim)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" };
  const td: React.CSSProperties = { textAlign: "right", padding: "7px 12px", fontSize: 12.5 };
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--bd2)", borderRadius: "var(--radius)" }}>
      <table className="mono" style={{ width: "100%", borderCollapse: "collapse", background: "var(--panel)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--bd2)" }}>
            <th style={{ ...th, textAlign: "left" }}>arm</th>
            <th style={th}>passed</th>
            <th style={th}>mean tokens</th>
            <th style={th}>mean wall</th>
          </tr>
        </thead>
        <tbody>
          {study.arms.map((a) => (
            <tr key={a.id} style={{ borderBottom: "1px solid var(--bd2)" }}>
              <td style={{ ...td, textAlign: "left" }}>
                <span style={{ color: "var(--fg)" }}>{a.label}</span>
                <span style={{ color: "var(--fg-ghost)", fontSize: 11 }}> · {a.note}</span>
              </td>
              <td style={{ ...td, color: "var(--fg)" }}>{a.passed}/{a.runs}</td>
              <td style={{ ...td, color: a.comparable ? "var(--fg2)" : "var(--fg-ghost)" }}>
                {a.meanTokens == null ? "—" : fmt(a.meanTokens)}{!a.comparable && " †"}
              </td>
              <td style={{ ...td, color: "var(--fg2)" }}>{a.meanWallS}s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mono" style={{ margin: 0, padding: "8px 12px", fontSize: 10.5, color: "var(--fg-ghost)", borderTop: "1px solid var(--bd2)" }}>
        † cache-accounting artifact — not comparable across backends; read cost from wall time.
      </p>
    </div>
  );
}

/* ── brain isolation: pass rate per arm (the headroom win) ─────────────── */
export function BrainResult({ study }: { study: BrainStudy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {study.arms.map((a) => {
        const rate = a.runs ? a.passed / a.runs : 0;
        return (
          <div
            key={a.id}
            style={{ display: "grid", gridTemplateColumns: "minmax(0, 190px) 1fr auto", alignItems: "center", gap: 14 }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: a.highlight ? 700 : 600, color: a.highlight ? "var(--fg)" : "var(--fg2)" }}>
                {a.label}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>{a.note}</div>
            </div>
            <div
              aria-label={`${a.label}: ${a.passed} of ${a.runs} passed`}
              style={{ height: 16, background: "var(--bd2)", borderRadius: 4, overflow: "hidden" }}
            >
              <div style={{ width: `${rate * 100}%`, height: "100%", background: a.highlight ? INK : MID, borderRadius: 4, transition: "width 500ms ease" }} />
            </div>
            <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: a.highlight ? "var(--fg)" : "var(--fg-dim)", minWidth: 42, textAlign: "right" }}>
              {a.passed}/{a.runs}
            </span>
          </div>
        );
      })}
    </div>
  );
}
