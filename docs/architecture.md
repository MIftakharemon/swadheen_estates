# Swadheen Estates — Architecture

## Product boundary

Swadheen Estates is a single-vendor property company. Inventory is owned and managed by one company; public visitors browse listings and send requests, while authorized staff manage inventory, leads, visits, content and bookings.

```text
Browser
  ├── Public route group (SSR/ISR) ──┐
  ├── Customer portal (session)       ├── Feature services ── Prisma/PostgreSQL
  └── Admin route group (RBAC)       ┘          ├── object storage (signed uploads)
                                                ├── queue (media/reports/notifications)
                                                └── email/SMS/WhatsApp providers
```

## Folder contract

`src/app` contains routing and composition only. `src/features` contains domain behavior. `src/lib` contains infrastructure and cross-cutting policies. Client components are leaf nodes and never own authorization or direct database access.

```text
src/
  app/                 route segments, metadata, loading and error boundaries
  components/          design-system primitives, shells, skeletons
  config/              navigation, feature flags, SEO defaults
  data/                local demo catalog used when DATABASE_URL is absent
  features/            properties, leads, visits, media, auth, users
  lib/                 env, db, auth, security, formatting, cache, storage
  styles/              tokens and global styles
```

## First user journeys

1. A visitor searches or browses the catalog, opens a verified property and sends an enquiry.
2. A visitor switches between photo, tour, floor-plan and map surfaces without losing the property context.
3. A manager opens `/admin`, sees the lead pipeline and can move between inventory, visits and requests.
4. A customer signs in to `/portal` to see saved properties and request status.

## Rendering policy

- Server Components by default; client code is limited to filters, motion, forms, theme and media viewers.
- Listing/detail pages are designed for ISR and tagged invalidation (`property:{id}`, `listing-search`, `project:{id}`).
- 3D, map, chart and rich-editor code is dynamically imported and has a poster-first fallback.
- The demo catalog is a deterministic local fallback, never a claim that production data is persisted without a configured database.
