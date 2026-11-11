# Build Plan and Delivery Map

## Architecture diagram

```text
Next App Router
  ├─ public marketing / catalog / property detail
  ├─ portal (customer session)
  └─ admin (RBAC + audit log)
         ↓ thin route handlers / server actions
features → services → Prisma → PostgreSQL
                    ↘ object storage / queue / notifications
```

## Route map

| Route                | Purpose                                    | Rendering                     |
| -------------------- | ------------------------------------------ | ----------------------------- |
| `/`                  | editorial home and search entry            | server + client islands       |
| `/properties`        | filterable inventory                       | server shell + client browser |
| `/properties/[slug]` | gallery, specs, request card, 3D surfaces  | ISR detail                    |
| `/projects/[slug]`   | development and availability               | ISR                           |
| `/portal`            | saved items and request timeline           | authenticated                 |
| `/admin`             | KPI, leads, visits and inventory shortcuts | authorized                    |
| `/design-system`     | component/state QA                         | development utility           |
| `/dev/skeletons`     | skeleton parity QA                         | development utility           |
| `/api/leads`         | validated public enquiry endpoint          | POST + rate limit             |

## Build phases

1. Foundation, security headers, tokens, accessible primitives, Prisma schema and seed.
2. Property CRUD seams, media metadata, catalog/detail public experience.
3. Dynamic 360/model/floor-plan viewers with poster and WebGL fallbacks.
4. Lead forms, CRM pipeline, visit scheduling and notification adapters.
5. Customer portal, bookings, installment ledger and hosted payment adapters.
6. CMS, blog, SEO, sitemap, language routing and content moderation.
7. Reports, background jobs, PWA shell, observability and deployment.
8. Security review, Lighthouse budgets, E2E critical flows and handoff.

## Cache/tag strategy

| Surface            | Tag                  | TTL       | Invalidation                |
| ------------------ | -------------------- | --------- | --------------------------- |
| published property | `property:{id}`      | 5 min ISR | publish/edit/archive        |
| listing search     | `listing-search`     | 60 sec    | inventory status/price edit |
| project inventory  | `project:{id}`       | 5 min     | unit status change          |
| company settings   | `settings:public`    | 1 hour    | settings publish            |
| dashboard KPIs     | `dashboard:{userId}` | 30 sec    | lead/booking mutation       |

## Security threat model summary

| Asset     | Threat                        | Control                                                                   |
| --------- | ----------------------------- | ------------------------------------------------------------------------- |
| Sessions  | theft/fixation                | Auth.js/Better Auth, HttpOnly cookies, rotation, short admin expiry       |
| Leads     | spam/PII exposure             | Zod, Turnstile, honeypot, rate limit, redacted logs                       |
| Admin     | IDOR/privilege escalation     | central `can()` map plus object checks in every action                    |
| Uploads   | polyglot/SSRF/malware         | signed keys, size/type/magic-byte checks, re-encode, scan queue           |
| 3D assets | external URI/script injection | GLB validator, no external buffers, separate cookieless CDN               |
| Payments  | forged/replayed events        | hosted checkout, signature verification, idempotency, server amount check |

## Skeleton inventory

`Skeleton`, `PropertyCard`, `PropertyGrid`, `SearchBar`, `HeroSection`, `GalleryBento`, `PropertyDetail`, `SpecTable`, `AmenitiesGrid`, `EnquiryCard`, `MapPanel`, `TourViewer`, `ModelViewer`, `ProjectUnitGrid`, `Timeline`, `Stats`, `BlogCard`, `PortalDashboard`, `RequestTimeline`, `AdminKpis`, `AdminTable`, `Kanban`, `Calendar`, `MediaGrid`, `ReportTable`.

## CI pipeline

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test -- --coverage`
5. `npm run build`
6. Playwright critical journeys and Lighthouse CI budgets in the deployment environment.
