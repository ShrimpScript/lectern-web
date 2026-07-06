"use client";
import { createContext, useContext } from "react";
import type { SessionUser } from "@/lib/auth/session";

/* Server-resolved session user, surfaced to client components (e.g. the header)
   so the nav can reflect auth state. `import type` keeps the server-only
   session module out of the client bundle. */
const AuthContext = createContext<SessionUser | null>(null);

export function AuthProvider({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth(): SessionUser | null {
  return useContext(AuthContext);
}
