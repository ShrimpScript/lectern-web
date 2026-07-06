/* Static marketing/content data + dashboard seed data.
   Values mirror the Lectern design (changelog, pricing, dashboard numbers).
   Dashboard figures are seed/mock until wired to real usage rollups
   (see ../../../Lectern-Brain/03-Architecture/Cloud Backend (getlectern.vercel.app).md). */

export type Plan = {
  id: "free" | "pro" | "team";
  name: string;
  priceMonthly: number;
  priceAnnual: number; // per month, billed annually
  unit: string;
  popular?: boolean;
  features: string[];
  cta: string;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    unit: "forever",
    features: ["1 backend connection", "7-day session memory", "Core agent workspace"],
    cta: "Get started",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 20,
    priceAnnual: 16,
    unit: "per month",
    popular: true,
    features: ["Unlimited backends & keys", "Permanent memory", "Learned skills library", "Usage analytics"],
    cta: "Choose Pro",
  },
  {
    id: "team",
    name: "Team",
    priceMonthly: 60,
    priceAnnual: 48,
    unit: "per seat / month",
    features: ["Everything in Pro", "Shared team memory", "SSO & audit log", "Priority support"],
    cta: "Contact sales",
  },
];

export const compareRows: { label: string; free: string; pro: string; team: string }[] = [
  { label: "Backend connections", free: "1", pro: "Unlimited", team: "Unlimited" },
  { label: "Session memory", free: "7 days", pro: "Permanent", team: "Permanent" },
  { label: "Learned skills", free: "—", pro: "✓", team: "Shared" },
  { label: "Usage analytics", free: "—", pro: "✓", team: "✓" },
  { label: "Seats", free: "1", pro: "1", team: "Per seat" },
  { label: "SSO & audit log", free: "—", pro: "—", team: "✓" },
  { label: "Support", free: "Community", pro: "Email", team: "Priority" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do I need my own AI subscription?",
    a: "Yes — Lectern is the engine, not the fuel. Bring Claude Code or Antigravity: Lectern routes work between them and adds the brain — memory, skills, and context — around the AI you already pay for.",
  },
  {
    q: "Where does my code live?",
    a: "On your machine. Lectern runs locally — your keys and source never leave your device.",
  },
  {
    q: "Can I switch backends later?",
    a: "Any time. Your memory and learned skills carry over to whatever engine you connect next.",
  },
  {
    q: "What happens to memory if I downgrade?",
    a: "Free keeps a rolling 7 days. Pro and Team keep it permanently — nothing is deleted while you're paid.",
  },
  {
    q: "Do you train on my code?",
    a: "No. Never. Your repository is used only to serve your own sessions.",
  },
];

export type Release = {
  version: string;
  date: string;
  changes: { tag: "ADDED" | "IMPROVED" | "FIXED" | "RELEASE"; text: string }[];
};

/* Real release history — regenerated from the shipped work on main
   (repo log / merged PRs). Pre-1.0: honest early-access versioning. */
export const releases: Release[] = [
  {
    version: "v0.5.0",
    date: "Jul 5, 2026",
    changes: [
      { tag: "ADDED", text: "Lectern is open source — the whole ecosystem (engine, desktop, TUI, site) is now Apache-2.0 on GitHub, built in public with free unlimited CI." },
      { tag: "ADDED", text: "TUI v3 — an OpenCode-class terminal cockpit: fuzzy dialogs for sessions/models/themes, one command registry (slash + ^X chords + self-generating /help), sticky run modes, full-screen diff viewer, and a single binary via `lectern tui`." },
      { tag: "ADDED", text: "Cross-surface sessions — chats live in the engine store, so a session started in the TUI appears in the desktop with full history, and renames from any surface win everywhere." },
      { tag: "ADDED", text: "Preview rail — edited files, images, and links render beside the chat; your pick stays pinned while the agent works." },
      { tag: "ADDED", text: "Terminal upgrades — tileable sessions with drag-resize, and the embedded terminal can target Docker containers or SSH hosts when they exist on your machine (auto-detected, hidden otherwise)." },
      { tag: "ADDED", text: "/skill and /mcp commands for real — attach a learned skill or target a connected MCP server straight from the composer." },
      { tag: "FIXED", text: "The big freeze — 57 IO commands moved off the UI thread and MCP probes are capped + cached, taking cold interactivity from ~37s to ~3s." },
      { tag: "ADDED", text: "Unsigned Windows/macOS builds from public CI on the downloads page, with honest install instructions (no certs, by design)." },
    ],
  },
  {
    version: "v0.4.0",
    date: "Jul 2, 2026",
    changes: [
      { tag: "ADDED", text: "OpenCode backend — OpenRouter and ~75 providers through one harness, with built-in free models that need no API key at all." },
      { tag: "ADDED", text: "lectern tui — a terminal cockpit with session sidebar, live streaming, model picker, /conduct mode, and read-only brain/skills panels, driven by lecternd's new session IPC." },
      { tag: "ADDED", text: "One-click MCP catalog (12 verified servers) with search — one add registers the server in Claude Code, OpenCode, and Antigravity together, with truthful per-agent chips." },
      { tag: "ADDED", text: "Remote access section: Telegram channel status, split from MCP tools, with a strict no-approvals-from-chat security posture." },
      { tag: "ADDED", text: "Clean output mode, chat folders with drag-and-drop, chat export/import (JSON + Markdown), shareable theme files, a Usage page, and a per-chat context meter." },
      { tag: "ADDED", text: "Marketplace trust chain: sha256 integrity from hub to install, an official tier, in-app skill docs, and an AI security audit (free-model powered) gating every publish." },
      { tag: "ADDED", text: "Encrypted session bundles (scrypt + XChaCha20-Poly1305) — move a session between machines today; the payload format cross-device sync will ship." },
      { tag: "IMPROVED", text: "Cockpit clarity pass: custom selects and switches everywhere, truthful provider rows, visible routing config, and an onboarding tour whose cursor tracks real elements." },
      { tag: "IMPROVED", text: "Windows and macOS engine builds now validated in CI (dispatch matrix); skills that keep failing pause themselves; a user profile rides along with every run." },
    ],
  },
  {
    version: "v0.3.0",
    date: "Jul 1, 2026",
    changes: [
      { tag: "IMPROVED", text: "Desktop startup bundle cut from 1.06 MB to 321 KB — the editor now loads on first file-open." },
      { tag: "ADDED", text: "LECTERN_DEBUG tracing across the whole pipeline: backend spawns, Conductor routing, recall, and cloud sync." },
      { tag: "IMPROVED", text: "Accessibility and calm-motion pass — global keyboard focus rings, full reduced-motion support, dark/light parity across diff and brain-graph views." },
      { tag: "IMPROVED", text: "Actionable error messages when Claude Code or Antigravity isn't signed in, instead of raw stderr." },
      { tag: "FIXED", text: "The site now only advertises the Linux packages that actually ship (.deb + AppImage)." },
    ],
  },
  {
    version: "v0.2.0",
    date: "Jun 30, 2026",
    changes: [
      { tag: "ADDED", text: "Skills marketplace with a Git-backed community hub — browse, install, and publish skills your agents keep." },
      { tag: "ADDED", text: "Optional cloud link: device pairing via lectern login, end-to-end-encrypted sync, and entitlements — the cloud sees counts and ciphertext, never code." },
      { tag: "ADDED", text: "lecternd + lectern serve for scheduled and headless runs." },
    ],
  },
  {
    version: "v0.1.0",
    date: "Jun 28, 2026",
    changes: [
      { tag: "RELEASE", text: "First working engine + desktop app: streaming chat, plans, diffs, and a terminal over Claude Code and Antigravity." },
      { tag: "ADDED", text: "The Conductor — plan a task, route each step to the best model, fan out across git worktrees, cross-review between providers." },
      { tag: "ADDED", text: "The brain: persistent memory, recorded skills, a learned machine profile, and a graph of your codebase." },
    ],
  },
];

/* Hosted artifact URLs — single source of truth for the Downloads section and
   /api/releases. Null until public hosting exists (early access). */
export const artifacts: { appimage: string | null; deb: string | null } = {
  appimage: null,
  deb: null,
};

/* ---- Dashboard seed data (mock until real usage rollups land) ---- */
export const dashboard = {
  user: { name: "Alex Rivera", email: "alex@acme.com", plan: "Pro", renews: "Jul 12" },
  stats: [
    { label: "SESSIONS · JUN", value: "142", note: "+18% vs. May" },
    { label: "TOKENS · JUN", value: "1.24M", note: "62% of Pro pool" },
    { label: "COST · JUN", value: "$48.20", note: "est. $74 at month end" },
  ],
  usageSeries: [34, 52, 41, 66, 58, 78, 90, 71, 62, 84, 55, 72], // % heights
  backends: [
    { name: "Claude Code", sub: "local · ~/bin/claude", used: "used 2h ago" },
    { name: "Antigravity", sub: "workspace token", used: "yesterday" },
  ],
  activity: [
    { when: "2h ago", repo: "acme-web", text: "settings page shipped" },
    { when: "1d ago", repo: "payments-api", text: "webhook fix merged" },
    { when: "2d ago", repo: "marketing", text: "3 sessions" },
    { when: "3d ago", repo: "acme-web", text: "auth refactor" },
  ],
};

export const docsNav = [
  { group: "Getting started", items: ["Quickstart", "Install", "Connect a backend"] },
  { group: "Concepts", items: ["The workspace", "Memory", "Skills", "Adaptive context"] },
  { group: "Reference", items: ["CLI", "Keyboard", "Config", "Privacy"] },
];
