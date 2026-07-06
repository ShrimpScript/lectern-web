"use client";
import { createContext, useCallback, useContext, useState } from "react";

/* Global toast/notification system. Wrap the app once (in the root layout) and call
   useToast() anywhere: const toast = useToast(); toast.success("Saved"). */

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastApi = {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastCtx = createContext<ToastApi>({
  show: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export function useToast(): ToastApi {
  return useContext(ToastCtx);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++nextId;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove],
  );

  const api: ToastApi = {
    show,
    success: (m) => show(m, "success"),
    error: (m) => show(m, "error"),
    info: (m) => show(m, "info"),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 9999,
          maxWidth: 380,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const accent =
    toast.type === "success" ? "#34d399" : toast.type === "error" ? "#f87171" : "var(--fg3, #9aa0a6)";
  const icon = toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "•";
  return (
    <div
      role="status"
      style={{
        pointerEvents: "auto",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: "var(--panel, #15161a)",
        border: "1px solid var(--bd, #2a2b31)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: "var(--radius-sm, 8px)",
        padding: "10px 12px",
        boxShadow: "var(--shadow-pop, 0 10px 34px rgba(0,0,0,.45))",
        color: "var(--fg, #e7e7ea)",
        fontSize: 13,
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        animation: "lectern-toast-in .18s ease-out",
      }}
    >
      <span style={{ color: accent, fontWeight: 700, lineHeight: 1.4 }}>{icon}</span>
      <span style={{ flex: 1, lineHeight: 1.45 }}>{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "var(--fg3, #9aa0a6)",
          cursor: "pointer",
          fontSize: 15,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
