/* Cloud control-plane schema (Drizzle + libSQL/SQLite).
   Local dev: a file DB (zero setup). Production: Turso (free tier) — same driver.
   See Lectern-Brain/06-Build-Plan/Low-Cost Stack.md (ADR-019).
   INVARIANT: this DB stores accounts, counts, entitlements, ciphertext blobs —
   NEVER plaintext source, prompts, or API keys. */
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

const id = () => text("id").primaryKey().$defaultFn(() => randomUUID());
const ts = (name: string) => integer(name, { mode: "timestamp_ms" });
const now = (name: string) => ts(name).$defaultFn(() => new Date());

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  // scrypt hash: scrypt$<saltB64>$<hashB64>; null for OAuth-only users
  passwordHash: text("password_hash"),
  emailVerified: ts("email_verified"),
  twoFactorSecret: text("two_factor_secret"), // TOTP base32; null = disabled
  authProviders: text("auth_providers", { mode: "json" }).$type<string[]>().$defaultFn(() => []),
  createdAt: now("created_at"),
});

// ── Auth: sessions, OAuth accounts, verification/reset tokens ──────────────────
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // SHA-256 hash of the cookie token (token never stored)
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: ts("expires_at").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: now("created_at"),
});

export const oauthAccounts = sqliteTable(
  "oauth_accounts",
  {
    provider: text("provider").$type<"google" | "github">().notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: now("created_at"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) }),
);

export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(), // SHA-256 hash of the emailed token
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  purpose: text("purpose").$type<"email_verify" | "password_reset">().notNull(),
  expiresAt: ts("expires_at").notNull(),
});

// ── Personal/CI/engine API tokens (lk_… ; only the hash is stored) ────────────
export const apiTokens = sqliteTable("api_tokens", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  prefix: text("prefix").notNull(),
  hash: text("hash").notNull(),
  scopes: text("scopes", { mode: "json" }).$type<string[]>().$defaultFn(() => []),
  lastUsedAt: ts("last_used_at"),
  expiresAt: ts("expires_at"),
  createdAt: now("created_at"),
});

// ── OAuth 2.0 Device Authorization Grant (desktop app + CLI → cloud) ──────────
export const deviceCodes = sqliteTable("device_codes", {
  deviceCode: text("device_code").primaryKey(),
  userCode: text("user_code").notNull().unique(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: text("status").$type<"pending" | "approved" | "denied" | "expired">().notNull().default("pending"),
  expiresAt: ts("expires_at").notNull(),
  createdAt: now("created_at"),
});

// ── Orgs / teams ──────────────────────────────────────────────────────────────
export const orgs = sqliteTable("orgs", {
  id: id(),
  name: text("name").notNull(),
  plan: text("plan").$type<"free" | "pro" | "team">().notNull().default("free"),
  ssoConfig: text("sso_config", { mode: "json" }),
  createdAt: now("created_at"),
});

export const memberships = sqliteTable(
  "memberships",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    orgId: text("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
    role: text("role").$type<"owner" | "admin" | "member">().notNull().default("member"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.orgId] }) }),
);

// ── Billing / entitlements ────────────────────────────────────────────────────
export const subscriptions = sqliteTable("subscriptions", {
  id: id(),
  subjectId: text("subject_id").notNull(),
  subjectType: text("subject_type").$type<"user" | "org">().notNull(),
  plan: text("plan").$type<"free" | "pro" | "team">().notNull(),
  seats: integer("seats").notNull().default(1),
  period: text("period").$type<"monthly" | "annual">().notNull().default("monthly"),
  status: text("status").$type<"active" | "past_due" | "canceled">().notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  renewsAt: ts("renews_at"),
});

export const entitlements = sqliteTable("entitlements", {
  subjectId: text("subject_id").primaryKey(),
  limits: text("limits", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  updatedAt: now("updated_at"),
});

// content-free aggregates only (no code/prompts)
export const usageRollup = sqliteTable("usage_rollup", {
  id: id(),
  subjectId: text("subject_id").notNull(),
  day: text("day").notNull(), // YYYY-MM-DD
  backend: text("backend"),
  sessions: integer("sessions").notNull().default(0),
  tokensIn: integer("tokens_in").notNull().default(0),
  tokensOut: integer("tokens_out").notNull().default(0),
  costCents: integer("cost_cents").notNull().default(0),
});

// E2E-encrypted memory/skills blobs. The server stores CIPHERTEXT it cannot read.
// In production the bytes live in object storage (ciphertextUrl); for self-host /
// dev the ciphertext is stored inline (base64) so sync round-trips with no extra infra.
export const syncBlob = sqliteTable("sync_blob", {
  id: id(),
  subjectId: text("subject_id").notNull(),
  workspaceKey: text("workspace_key").notNull(),
  sha256: text("sha256").notNull(),
  size: integer("size").notNull(),
  ciphertextUrl: text("ciphertext_url"),
  ciphertext: text("ciphertext"), // base64 AEAD ciphertext (inline storage)
  updatedAt: now("updated_at"),
});

export const marketplaceItem = sqliteTable("marketplace_item", {
  id: id(),
  type: text("type").$type<"skill" | "function" | "mcp">().notNull(),
  slug: text("slug").notNull().unique(),
  authorId: text("author_id").references(() => users.id),
  versions: text("versions", { mode: "json" }).$type<{ version: string; url: string }[]>().$defaultFn(() => []),
  installs: integer("installs").notNull().default(0),
  signature: text("signature"),
  orgPrivate: integer("org_private", { mode: "boolean" }).notNull().default(false),
});

export const auditEvent = sqliteTable("audit_event", {
  id: id(),
  orgId: text("org_id").references(() => orgs.id),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target"),
  ts: now("ts"),
});

export const releases = sqliteTable("releases", {
  version: text("version").primaryKey(),
  channel: text("channel").$type<"stable" | "beta">().notNull().default("stable"),
  notes: text("notes"),
  artifacts: text("artifacts", { mode: "json" }).$type<{ fmt: string; url: string; sha256: string }[]>().$defaultFn(() => []),
  publishedAt: now("published_at"),
});
