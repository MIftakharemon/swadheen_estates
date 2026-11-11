# Delivery status

## Working now

- Phase 1 foundation: strict TypeScript, tokenized light/dark design system, Next 16 App Router conventions, CSP/security headers, proxy, Auth.js session boundary, RBAC primitives, Prisma schema/migration/config, Docker and CI.
- Phase 2 public slice: home, catalogue filters, detail pages, metadata/JSON-LD, enquiry capture, property seed data and exact-dimension skeletons.
- Phase 3 visual slice: dynamic React Three Fiber model canvas, panorama canvas, floor-plan interaction, map-style fallback, poster-first controls and AR-ready action surface.
- Phase 4 first slice: lead pipeline, admin inventory, visits calendar, media library, reports, settings and customer portal surfaces.
- Cross-cutting: signed R2 upload URL boundary, magic-byte utility tests, rate limiting, origin validation, service worker/offline route, sitemap/robots/manifest and security documentation.

## Actual verification

| Check                                    | Result                       |
| ---------------------------------------- | ---------------------------- |
| `npm run format:check`                   | PASS                         |
| `npm run lint`                           | PASS                         |
| `npm run typecheck`                      | PASS                         |
| `npm test`                               | PASS — 15 tests              |
| `npm run build`                          | PASS — 35 routes             |
| `npm run e2e`                            | PASS — 4 Playwright journeys |
| `DATABASE_URL=... npx prisma validate`   | PASS                         |
| `POST /api/leads` smoke request          | 201                          |
| unauthenticated `POST /api/uploads/sign` | 401                          |

## Required before real production traffic

These are provider-backed operational gates, not hidden mock functionality:

1. Set a real `AUTH_SECRET`, PostgreSQL URL and seed/invite staff users.
2. Add TOTP enrollment/challenge and backup-code recovery before allowing Manager/Super Admin production access.
3. Configure Redis-backed rate limits, Turnstile, R2/S3 and the media finalize/scan worker.
4. Add Resend/SMS/WhatsApp adapters and notification queue delivery.
5. Add immutable audit-log hooks to every admin mutation and export.
6. Add hosted payment/webhook adapter before bookings or installments are enabled.
7. Run deployed-domain Lighthouse, dependency scanning, ASVS review and backup restore drill.

The application intentionally fails closed for missing upload storage and redirects unauthenticated protected routes rather than pretending those integrations are live.
