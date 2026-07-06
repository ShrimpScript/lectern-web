"use client";
import { useState } from "react";
import { useToast } from "@/components/toast/ToastProvider";

export function ContactForm() {
  const toast = useToast();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErr("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message") }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("sent");
        toast.success("Message sent — we'll be in touch shortly.");
      } else {
        setState("error");
        setErr(data.error ?? "Failed to send.");
        toast.error(data.error ?? "Failed to send your message.");
      }
    } catch {
      setState("error");
      setErr("Network error.");
      toast.error("Network error — please try again.");
    }
  }

  if (state === "sent") {
    return <div style={{ fontSize: 16, color: "var(--fg)" }}>Thanks — we'll be in touch shortly. ✓</div>;
  }

  const field: React.CSSProperties = { border: "1px solid var(--bd)", borderRadius: 9, padding: 12, fontSize: 14, color: "var(--fg)", background: "var(--elev)", outline: "none", width: "100%" };
  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
      <input name="name" placeholder="Name" style={field} />
      <input name="email" type="email" required placeholder="you@company.com" style={field} />
      <textarea name="message" required rows={5} placeholder="How can we help?" style={{ ...field, resize: "vertical" }} />
      {state === "error" && <div className="mono" style={{ fontSize: 12, color: "#e5687a" }}>{err}</div>}
      <button type="submit" disabled={state === "sending"} style={{ alignSelf: "start", background: "var(--btn)", color: "var(--btnfg)", border: "none", borderRadius: 9, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
