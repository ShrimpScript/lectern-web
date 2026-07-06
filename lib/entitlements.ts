/* Plan → limits. The cloud is source of truth; the engine caches a signed
   entitlement token and enforces offline-tolerantly.
   Mirrors Lectern-Brain/03-Architecture/Sync, Auth & Entitlements.md +
   Lectern-Brain/01-Product/Pricing & Plans.md */

export type Plan = "free" | "pro" | "team";

export type Limits = {
  backends: number | "unlimited";
  memoryRetentionDays: number | "permanent";
  skills: boolean;
  analytics: boolean;
  sync: boolean;
  team: boolean;
  sso: boolean;
};

export const PLAN_LIMITS: Record<Plan, Limits> = {
  // OSS shift (2026-07-05): Lectern is free — every "plan" resolves to the same
  // everything-included limits. The Plan type survives for wire compatibility.
  free: { backends: "unlimited", memoryRetentionDays: "permanent", skills: true, analytics: true, sync: true, team: true, sso: false },
  pro: { backends: "unlimited", memoryRetentionDays: "permanent", skills: true, analytics: true, sync: true, team: true, sso: false },
  team: { backends: "unlimited", memoryRetentionDays: "permanent", skills: true, analytics: true, sync: true, team: true, sso: false },
};

export function limitsFor(plan: Plan): Limits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function canAddBackend(plan: Plan, current: number): boolean {
  const max = limitsFor(plan).backends;
  return max === "unlimited" || current < max;
}

/** Shape of the signed entitlement token the engine caches (sign with cloud key). */
export type EntitlementToken = {
  subjectId: string;
  plan: Plan;
  limits: Limits;
  issuedAt: number;
  expiresAt: number;
};
