"use client";
import { useState } from "react";

type Period = "monthly" | "annual";

export function BillingClient() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function checkout(plan: "pro" | "team") {
    setBusy(plan);
    setNote(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, period }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setNote(friendly(data.error));
    } catch {
      setNote("Network error.");
    } finally {
      setBusy(null);
    }
  }

  async function portal() {
    setBusy("portal");
    setNote(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setNote(friendly(data.error));
    } catch {
      setNote("Network error.");
    } finally {
      setBusy(null);
    }
  }

  const pro = period === "annual" ? 16 : 20;
  const team = period === "annual" ? 48 : 60;

  return (
    <div>
      <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.1em" }}>CURRENT PLAN</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>Free</div>
          <div style={{ fontSize: 13, color: "var(--fg-mute)", marginTop: 2 }}>1 backend · 7-day memory</div>
        </div>
        <button onClick={portal} disabled={busy !== null} style={ghost}>Manage billing →</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 3, background: "var(--chrome)", border: "1px solid var(--bd)", borderRadius: 10, padding: 4, fontSize: 13, fontWeight: 600 }}>
          <Seg active={period === "monthly"} onClick={() => setPeriod("monthly")}>Monthly</Seg>
          <Seg active={period === "annual"} onClick={() => setPeriod("annual")}>Annual −20%</Seg>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
        <PlanCard name="Pro" price={pro} features={["Unlimited backends", "Permanent memory", "Learned skills", "Usage analytics"]} cta="Upgrade to Pro" busy={busy === "pro"} onClick={() => checkout("pro")} highlight />
        <PlanCard name="Team" price={team} unit="/seat" features={["Everything in Pro", "Shared memory & skills", "SSO & audit log", "Priority support"]} cta="Upgrade to Team" busy={busy === "team"} onClick={() => checkout("team")} />
      </div>

      {note && <div className="mono" style={{ marginTop: 14, fontSize: 12, color: "var(--fg2)", border: "1px dashed var(--bd)", borderRadius: 8, padding: "10px 12px" }}>{note}</div>}

      <div style={{ border: "1px solid var(--bd2)", borderRadius: 13, padding: 20, background: "var(--elev)", marginTop: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Invoices</div>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>No invoices yet — they'll appear here after your first payment.</div>
      </div>
    </div>
  );
}

function friendly(err?: string): string {
  if (err === "billing_unconfigured" || err === "price_unconfigured") return "Billing isn't configured in this environment yet (Stripe keys + price IDs needed). The flow is wired and will work once configured.";
  if (err === "not_configured") return "Demo mode — connect a database + Stripe to enable real checkout.";
  if (err === "unauthenticated") return "Please sign in first.";
  if (err === "no_subscription") return "No active subscription to manage yet.";
  return err ?? "Something went wrong.";
}

const ghost: React.CSSProperties = { background: "transparent", border: "1px solid var(--bd)", color: "var(--fg)", borderRadius: 9, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" };

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <div onClick={onClick} style={{ padding: "8px 18px", borderRadius: 7, cursor: "pointer", background: active ? "var(--btn)" : "transparent", color: active ? "var(--btnfg)" : "var(--fg2)" }}>{children}</div>;
}

function PlanCard({ name, price, unit = "/mo", features, cta, busy, onClick, highlight }: { name: string; price: number; unit?: string; features: string[]; cta: string; busy: boolean; onClick: () => void; highlight?: boolean }) {
  return (
    <div style={{ border: highlight ? "1.5px solid color-mix(in srgb, var(--fg) 40%, transparent)" : "1px solid var(--bd2)", borderRadius: 16, padding: 24, background: highlight ? "linear-gradient(180deg, var(--panel), var(--elev))" : "var(--panel)" }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>{name}</div>
      <div style={{ margin: "12px 0 2px", fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>${price}<span className="mono" style={{ fontSize: 13, color: "var(--fg-dim)", fontWeight: 400 }}>{unit}</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "18px 0" }}>
        {features.map((f) => <div key={f} style={{ fontSize: 14, color: "var(--fg2)" }}>— {f}</div>)}
      </div>
      <button onClick={onClick} disabled={busy} style={{ width: "100%", background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 9, padding: 11, fontWeight: 600, fontSize: 14, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
        {busy ? "…" : cta}
      </button>
    </div>
  );
}
