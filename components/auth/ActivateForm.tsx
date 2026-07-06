"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useToast } from "@/components/toast/ToastProvider";
import { EASE } from "@/components/motion/Motion";

export function ActivateForm({ initialCode = "" }: { initialCode?: string }) {
  const toast = useToast();
  const [code, setCode] = useState(initialCode);
  const [state, setState] = useState<"idle" | "working" | "approved" | "denied" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function act(action: "approve" | "deny") {
    setState("working");
    setMsg("");
    try {
      const res = await fetch("/api/device/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_code: code, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setState(action === "deny" ? "denied" : "approved");
        if (action === "deny") toast.info("Device request denied.");
        else toast.success("Device connected — you're signed in on the app.");
      } else {
        setState("error");
        setMsg(data.error ?? "Something went wrong.");
        toast.error(data.error ?? "Couldn't process the code.");
      }
    } catch {
      setState("error");
      setMsg("Network error.");
      toast.error("Network error — please try again.");
    }
  }

  if (state === "approved") {
    return (
      <Done
        ok
        title="Device connected"
        body="You can return to the Lectern app — it's now signed in, and your plan's entitlements are live."
      />
    );
  }
  if (state === "denied") {
    return <Done title="Request denied" body="The device was not connected. You can close this tab." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Connect a device</div>
        <div style={{ fontSize: 14, color: "var(--fg-mute)", marginTop: 6 }}>
          Enter the code shown by <span className="mono" style={{ fontSize: 13, color: "var(--fg2)" }}>lectern login</span> or
          the desktop app to sign it in.
        </div>
      </div>
      <motion.div
        animate={state === "error" ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          border: "1px solid var(--bd)",
          borderRadius: 14,
          padding: 24,
          background: "var(--panel)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="WDJB-MJHT"
          className="mono"
          autoFocus
          style={{
            border: "1px solid var(--bd)",
            borderRadius: 9,
            padding: "14px 12px",
            fontSize: 20,
            letterSpacing: "0.18em",
            textAlign: "center",
            color: "var(--fg)",
            background: "var(--elev)",
            outline: "none",
          }}
        />
        {state === "error" && (
          <div className="mono" style={{ fontSize: 12, color: "#e5687a" }}>{msg}</div>
        )}
        <button
          onClick={() => act("approve")}
          disabled={!code || state === "working"}
          style={{
            background: "var(--btn)",
            color: "var(--btnfg)",
            border: "none",
            borderRadius: 9,
            padding: 12,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            opacity: !code || state === "working" ? 0.7 : 1,
          }}
        >
          {state === "working" ? "…" : "Approve & connect"}
        </button>
        <button
          onClick={() => act("deny")}
          disabled={!code || state === "working"}
          style={{
            background: "transparent",
            color: "var(--fg2)",
            border: "1px solid var(--bd)",
            borderRadius: 9,
            padding: 10,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Deny
        </button>
      </motion.div>
      <div className="mono" style={{ textAlign: "center", fontSize: 11.5, lineHeight: 1.6, color: "var(--fg-faint)" }}>
        codes expire after a few minutes · approving links the device to your account
      </div>
    </motion.div>
  );
}

function Done({ title, body, ok }: { title: string; body: string; ok?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        width: "100%",
        maxWidth: 400,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
        className="mono"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "1.5px solid " + (ok ? "var(--fg)" : "var(--bd)"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: ok ? "var(--fg)" : "var(--fg-mute)",
        }}
      >
        {ok ? "✓" : "—"}
      </motion.div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg2)" }}>{body}</div>
      {ok && (
        <div className="mono" style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>
          you can close this tab
        </div>
      )}
    </motion.div>
  );
}
