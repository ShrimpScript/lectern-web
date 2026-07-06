# Lectern — Web (lectern.ai)

Marketing site + **web dashboard** (the cloud control plane) for Lectern. Built
from the Claude design and the architecture brain at `~/Documents/Lectern-Brain`.

> Lectern is the **engine** that wraps the AI coding agent you already pay for.
> This web app is the **cloud control plane only**: marketing, auth, billing,
> usage analytics, API tokens, device login, and E2E-encrypted sync index.
> It never touches user source, prompts, or API keys.

## Stack (chosen to be free / low-cost)
| Concern | Choice | Cost |
|---|---|---|
| Framework | Next.js (App Router) + React 19 + TS | free |
| Database | **libSQL/SQLite** — local file in dev, **Turso** in prod | free tier |
| Auth | **Custom session auth** (node:crypto scrypt + manual OAuth) | free, no deps |
| Email | **Resend** via REST | free tier (3k/mo) |
| Hosting | **Vercel** Hobby | free |
| Rate limit | in-memory (dev) → Upstash Redis (prod) | free tier |

See `~/Documents/Lectern-Brain/06-Build-Plan/Low-Cost Stack.md`.

## Quick start (zero external accounts)
```bash
npm install
npm run setup     # creates .data/lectern-dev.db and all tables (libSQL)
npm run dev       # http://localhost:3000  — real auth/billing work locally
```
Then sign up at `/signup`, or use the seeded demo account in dev:
**demo@lectern.local / lectern-demo-1234**.

`npm run build` — production build / typecheck. `npm run db:studio` — browse the DB.

## What works right now (no secrets needed)
- ✅ **Email + password auth** — real signup/login/logout, scrypt-hashed, httpOnly sessions.
- ✅ **Auth-gated dashboard** — `/dashboard` requires a session; redirects to `/login`.
- ✅ **API tokens** — create/list/revoke (hashed, shown once).
- ✅ **Device login** — `/api/device/*` + `/activate` (the desktop/CLI → cloud bridge).
- ✅ **Password reset + email verification** flows (links log to console without email configured).
- ✅ **Health** — `/api/health` (DB ping + service status).
- ✅ All marketing/legal/blog/docs pages, sitemap, robots, security headers, rate limiting.

## What needs credentials (gated; flows are fully wired)
Set these in `.env` (see `.env.example`) to light up:
- **OAuth** — `AUTH_GOOGLE_ID/SECRET`, `AUTH_GITHUB_ID/SECRET` (create free OAuth apps).
- **Email** — `RESEND_API_KEY` (else email no-ops + logs in dev).
- **Production DB** — `DATABASE_URL` (Turso `libsql://…`) + `DATABASE_AUTH_TOKEN`.

## Deploy (free path)
1. Create a **Turso** DB (free): `turso db create lectern && turso db tokens create lectern`.
2. `DATABASE_URL` + `DATABASE_AUTH_TOKEN` → run `npm run db:push` against it once.
3. Deploy to **Vercel** (free); set env vars; point a domain.
   `${SITE}/api/auth/{google,github}/callback`.

## Routes
| Area | Routes |
|---|---|
| Marketing | `/`, `/pricing`, `/docs`, `/changelog`, `/blog`, `/security`, `/company`, `/customers`, `/contact`, `/legal/*` |
| Auth | `/login`, `/signup`, `/login/reset`, `/login/reset/[token]`, `/verify/[token]`, `/activate` |
| Dashboard (authed) | `/dashboard` + `/usage` `/backends` `/tokens` `/billing` `/team` `/activity` `/settings` |

## Privacy invariant (enforced in code)
The cloud never receives source, prompts, or API keys. `/api/usage/ingest` rejects
any content-bearing field; sync stores ciphertext only; secrets live in your local
keychain, not here.

## Project layout
```
app/         routes (marketing, auth, dashboard, api)
components/  site/ pricing/ docs/ changelog/ auth/ dashboard/ marketing/ ui/
lib/         auth/ (password,session,oauth,tokens,bearer,actions) · billing/ · email/ · db/ · ratelimit
```
Part of the planned monorepo (`~/Documents/Lectern/`).
