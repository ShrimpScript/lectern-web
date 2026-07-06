import type { Metadata } from "next";
import { PageHeader, Panel, Row, Pill } from "@/components/dashboard/parts";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings — Lectern" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  const name = user?.name ?? "Alex Rivera";
  const email = user?.email ?? "alex@acme.com";

  return (
    <div>
      <PageHeader title="Settings" sub="Account, security, and preferences." />

      <Panel title="Profile">
        <Row><span style={{ color: "var(--fg2)", fontSize: 14 }}>Name</span><span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span></Row>
        <Row last><span style={{ color: "var(--fg2)", fontSize: 14 }}>Email</span><span style={{ fontWeight: 600, fontSize: 14 }}>{email}</span></Row>
      </Panel>

      <Panel title="Security">
        <Row><span style={{ color: "var(--fg2)", fontSize: 14 }}>Password</span><span className="mono" style={{ fontSize: 12, color: "var(--fg2)", border: "1px solid var(--bd)", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>Change</span></Row>
        <Row>
          <div><div style={{ fontSize: 14, color: "var(--fg)" }}>Two-factor authentication</div><div style={{ fontSize: 12.5, color: "var(--fg-mute)", marginTop: 2 }}>TOTP via an authenticator app.</div></div>
          <Pill>Off · Enable</Pill>
        </Row>
        <Row last>
          <div><div style={{ fontSize: 14, color: "var(--fg)" }}>Active sessions</div><div style={{ fontSize: 12.5, color: "var(--fg-mute)", marginTop: 2 }}>Sign out other devices.</div></div>
          <span className="mono" style={{ fontSize: 12, color: "var(--fg2)", cursor: "pointer" }}>Manage</span>
        </Row>
      </Panel>

      <Panel title="Notifications">
        <Row><span style={{ fontSize: 14, color: "var(--fg2)" }}>Product updates &amp; changelog</span><Pill tone="ok">On</Pill></Row>
        <Row last><span style={{ fontSize: 14, color: "var(--fg2)" }}>Usage alerts</span><Pill tone="ok">On</Pill></Row>
      </Panel>

      <Panel title="Privacy &amp; data">
        <Row><span style={{ fontSize: 14, color: "var(--fg2)" }}>Anonymous usage telemetry</span><Pill>Opt-in · Off</Pill></Row>
        <Row><span style={{ fontSize: 14, color: "var(--fg2)" }}>Export my data</span><span className="mono" style={{ fontSize: 12, color: "var(--fg2)", cursor: "pointer" }}>Request export</span></Row>
        <Row last>
          <span style={{ fontSize: 14, color: "#e5687a" }}>Delete account</span>
          <span className="mono" style={{ fontSize: 12, color: "#e5687a", border: "1px solid #e5687a55", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>Delete…</span>
        </Row>
      </Panel>
    </div>
  );
}
