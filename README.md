# Studio — Full-Stack Developer Portfolio & CMS

A premium personal portfolio for a full-stack developer who **builds software for real businesses** — websites, business applications, integrations, and operational systems.

It is a **monolith**: the public site and a full admin CMS live in one Next.js app. Projects, services, site copy, technologies, social links and contact messages are all managed from the UI — **no source changes required to add or edit content.**

Design concept: **"Engineering Ledger"** — editorial magazine grid meets engineering documentation. Warm paper, near-black ink, a single restrained vermilion signal, Sora for expressive statements, IBM Plex Sans for calm body copy, and IBM Plex Mono for technical metadata.

---

## Stack

| Layer | Choice |
|------|--------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom design tokens) |
| Database | PostgreSQL |
| ORM / migrations | Prisma |
| Auth | Session cookie (signed JWT via `jose`) + `bcryptjs` |
| Storage | Pluggable driver (local now; S3 / R2 / MinIO later) |
| Fonts | Sora · IBM Plex Sans · IBM Plex Mono (`next/font`) |

Everything runs in one process. No separate backend, no Express, no microservices.

---

## Prerequisites

- Node.js 20+
- Docker (for the bundled PostgreSQL) **or** any reachable PostgreSQL instance

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
#   - set a strong AUTH_SECRET:  node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
#   - set ADMIN_EMAIL / ADMIN_PASSWORD

# 3. Start PostgreSQL (bundled container on host port 5433)
npm run db:up

# 4. Apply migrations + generate client + seed initial content
npm run db:migrate      # creates the schema
npm run db:seed         # admin user, technologies, 5 real projects, services

# 5. Run
npm run dev             # http://localhost:3000
```

Public site: `http://localhost:3000`
Admin CMS: `http://localhost:3000/admin` (sign in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

> The bundled Postgres runs on **5433** to avoid clashing with any local Postgres on 5432.
> Using your own database? Just point `DATABASE_URL` at it and skip `npm run db:up`.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:up` | Start the Postgres container |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:deploy` | Apply migrations in production (no prompts) |
| `npm run db:seed` | Seed initial content |
| `npm run db:reset` | Drop, re-migrate and re-seed (destructive) |
| `npm run db:studio` | Prisma Studio |
| `npm run setup` | `generate` + `deploy` + `seed` in one go |

---

## What the CMS manages (no code changes)

- **Projects** — full CRUD, publish/unpublish, feature, drag-order (up/down), draft preview.
  Structured editor with tabs: Basic · Content · Technology · Media · Architecture · SEO · Publishing.
  Fields include business problem, solution, capabilities, technical challenges/decisions, outcome,
  architecture (text schematic + image), gallery, per-project SEO/OG.
- **Services** — the "What I build" section.
- **Site content** — hero, about/approach, contact and footer copy, plus social links.
- **Technologies** — created automatically when typed into a project; grouped by capability.
- **Contact messages** — inbox with unread/read/archived states, reply, delete.

New published projects automatically appear on the home page, `/work`, the sitemap, and get their
own case-study page at `/work/<slug>` — with no deployment.

---

## Architecture

```
Browser
  │
  ▼
Next.js (single app)
  ├── Public site        src/app/(site)
  ├── Admin CMS          src/app/admin
  ├── Auth + middleware  src/lib/{auth,session,jwt}.ts · src/middleware.ts
  ├── Server Actions     src/app/admin/actions.ts
  ├── Route Handlers     src/app/api/{contact,upload}
  └── Data access        src/lib/{db,queries,content}.ts (Prisma)
  │
  ▼
PostgreSQL
```

Key directories:

```
prisma/                 schema.prisma · migrations · seed.ts
src/app/(site)/         home, /work, /work/[slug]
src/app/admin/          login, (panel): dashboard, projects, messages, services, content
src/app/api/            contact (public) · upload (auth-guarded)
src/components/         public sections + admin components + shared (CaseStudy, ArchitectureDiagram…)
src/lib/                db, auth, session, jwt, storage, queries, content, validators
public/uploads/         local image storage
```

---

## Authentication

- Admin credentials come from **environment variables** (seeded, never hardcoded in source).
- Passwords are hashed with **bcrypt** (cost 12).
- Sessions are **signed JWTs** in an `httpOnly`, `sameSite=lax` cookie (8h).
- `src/middleware.ts` guards every `/admin/*` route at the edge; server components also call
  `requireAdmin()` as defence in depth. `/api/upload` requires a valid session.
- Rotate `AUTH_SECRET` to invalidate all sessions.

---

## Image storage

`src/lib/storage.ts` exposes a `StorageDriver` interface. The default `local` driver writes to
`public/uploads` and stores the returned URL in the database. To move to S3 / R2 / MinIO, implement
one driver and switch `STORAGE_DRIVER` — **no feature code changes**, because components only ever
read the stored URL.

---

## SEO

- Per-page and per-project metadata + Open Graph / Twitter cards.
- `app/sitemap.ts` (includes every published project) and `app/robots.ts` (blocks `/admin`, `/api`).
- Semantic HTML, structured headings, skip link, reduced-motion support, keyboard-focus states.

---

## Production build & deploy

```bash
npm run build
npm run start        # or a process manager / container
```

Deployment checklist:

1. Provision PostgreSQL, set `DATABASE_URL`.
2. Set a strong `AUTH_SECRET` and real `ADMIN_*` values.
3. Set `NEXT_PUBLIC_SITE_URL` to the public origin (used for canonical/OG/sitemap).
4. Run `npm run db:deploy` then `npm run db:seed` (seed once).
5. `npm run build && npm run start` behind Nginx (or deploy the container).
6. For horizontal scaling or ephemeral filesystems, switch `STORAGE_DRIVER` to object storage.

`.env` is git-ignored; only `.env.example` is committed. No secrets in source.

---

## Content note

Project content is written to be **credible, not fabricated** — no invented clients, testimonials,
metrics or logos. The flagship POS and payment-integration case studies describe real engineering
without exposing confidential details (client shown as *Confidential*). The three modern-web
projects are clearly marked as **placeholder** builds demonstrating front-end capability; replace
them from the admin.
