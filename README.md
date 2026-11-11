# Swadheen Estates

Premium single-vendor real estate experience for land, houses and apartments. The initial release is a working Next.js App Router application with a public catalogue, property detail experience, enquiry capture, protected customer space, protected admin workspace, Prisma/PostgreSQL schema, accessible tokens and local demo fallback data.

## What is included

- Editorial home page with premium property search entry, featured inventory, projects, journal and CTA.
- Filterable `/properties` catalogue with URL-synced type filters, search, budget, bedrooms, area, grid/list/map views and saved/compare UI states.
- Property detail pages with bento gallery, specs, enquiry form, 360°/3D model/floor-plan/map experience surfaces and related inventory.
- Lead endpoint with Zod validation, same-origin check, honeypot, IP rate limit and optional Cloudflare Turnstile verification.
- Auth.js credentials authentication with Argon2id password verification, optional Google provider and server-side RBAC gates for `/admin` and `/portal`.
- Admin dashboard, inventory table, Kanban lead pipeline, visits calendar, media library, reports and settings surfaces.
- Customer portal dashboard with saved properties and request timeline.
- Light/dark design tokens, reduced-motion handling, exact-dimension skeleton route, design-system route, metadata, sitemap, robots, security headers and health endpoint.
- Prisma schema, initial migration, seed script and Docker/PostgreSQL development environment.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- npm 10+
- PostgreSQL 15+ for persistence (the public UI also runs against deterministic demo data without a database)

## Local setup

```bash
cp .env.example .env
npm install
npm run db:generate
```

To use PostgreSQL locally:

```bash
docker compose up -d postgres
# set DATABASE_URL from .env.example, then:
npm run db:migrate -- --name init
SEED_ADMIN_PASSWORD='use-a-unique-password-12+' npm run db:seed
npm run dev
```

Open:

- Public site: http://localhost:3000
- Catalogue: http://localhost:3000/properties
- Design system: http://localhost:3000/design-system
- Skeleton QA: http://localhost:3000/dev/skeletons
- Login: http://localhost:3000/login
- Admin: http://localhost:3000/admin (requires a seeded staff user)
- Health: http://localhost:3000/api/health

The seeded manager account is `manager@swadheen.example`. Set `SEED_ADMIN_PASSWORD` before seeding; no password is committed or printed by the seed.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
```

`npm run clean` removes local build output (`.next`, coverage, Playwright reports and traces, the TypeScript build cache, and editor caches) without touching source or dependencies. Run it before sharing or archiving the project.

The current unit suite covers formatting, RBAC object checks, lead schema validation and rate-limit boundaries. Playwright covers catalogue → detail → enquiry, protected workspace redirects and invalid enquiry behavior. E2E requires the local server and external Unsplash image access.

## Production configuration

Copy `.env.example` into the deployment secret store. Required production values include:

- `DATABASE_URL` with TLS and a least-privilege application user.
- `AUTH_SECRET` with at least 32 random characters.
- `R2_*` for direct signed media uploads and a separate cookieless public asset domain.
- `RESEND_API_KEY`, SMS gateway and WhatsApp Business credentials for notifications.
- `NEXT_PUBLIC_MAPBOX_TOKEN` for the Mapbox adapter.
- `TURNSTILE_SECRET_KEY` and site key for public forms.
- `SENTRY_DSN`, Redis and queue credentials for observability/background work.

Provider adapters are intentionally configuration-driven. The current UI remains usable without those accounts, while production deployment must enable the corresponding services before accepting real customer data.

The signed upload boundary is available at `POST /api/uploads/sign` for staff with `property:write`. It returns a five-minute PUT URL only when R2/S3 credentials are configured. A production finalize/scan worker must still validate magic bytes, image re-encoding and GLB safety before marking the asset public.

## Deployment

### Docker/VPS

```bash
docker compose up -d postgres
docker build -t swadheen-estates .
docker run --env-file .env -p 3000:3000 swadheen-estates
```

Run migrations as a release step with `npx prisma migrate deploy`, then start the container. Do not run `migrate dev` in production.

### Vercel

Use the repository root as the project root, add environment variables in the Vercel project, provision PostgreSQL separately, and run `npx prisma migrate deploy` in a controlled release job. Configure R2/Mapbox/Turnstile domains in CSP before enabling those features.

## Architecture and delivery docs

- `docs/architecture.md` — dependency direction and application boundaries.
- `docs/plan.md` — phased build plan, route map, cache strategy and skeleton inventory.
- `docs/design-brief.md` — visual direction, palette and typography rationale.
- `docs/motion-spec.md` — motion timings and reduced-motion rules.
- `docs/design-qa.md` — responsive/accessibility review checklist.
- `docs/admin-guide.md` — operating the admin workspace.
- `SECURITY.md` — threat model, endpoint policy and pre-launch gates.
