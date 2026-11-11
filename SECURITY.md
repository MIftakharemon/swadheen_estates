# Security posture and threat model

## Scope

This application handles customer names, phones, emails, property enquiries, staff accounts and future booking/payment metadata. Production deployment must use TLS, a managed PostgreSQL instance, a private object bucket, a WAF and a secrets manager.

## Controls implemented in this slice

- Auth.js session cookies with server-side route protection for admin and portal.
- Argon2id password verification; passwords are never logged or returned.
- Zod allowlist validation for public lead input.
- Same-origin validation for the lead mutation.
- In-memory rate limiting for local/demo operation; production must use the configured Redis adapter before horizontal scaling.
- Honeypot field and optional Cloudflare Turnstile verification.
- CSP nonce middleware, `frame-ancestors`, `nosniff`, HSTS, referrer and permissions headers.
- Parameterized Prisma ORM access only in the current code.
- Generic customer-facing errors with redacted server error logging.
- Central RBAC map with assignment-aware sales-agent checks.

## STRIDE table

| Surface      | Spoofing                            | Tampering                                | Repudiation                       | Information disclosure       | Denial of service     | Elevation                    |
| ------------ | ----------------------------------- | ---------------------------------------- | --------------------------------- | ---------------------------- | --------------------- | ---------------------------- |
| Auth/session | Auth.js, HttpOnly cookies, Argon2id | SameSite + origin checks                 | Auth audit adapter required       | generic login errors         | rate limit required   | RBAC + object checks         |
| Public leads | Turnstile/honeypot                  | Zod + server-owned property lookup       | request ID/audit adapter required | minimum PII, redacted logs   | IP limiter            | no privileged action exposed |
| Admin panel  | session + role gate                 | server action schema required            | immutable audit log required      | noindex/private routes       | WAF + Redis limiter   | deny by default `can()`      |
| Uploads      | signed URL identity                 | magic bytes/re-encode required           | asset audit required              | private bucket for documents | size/queue limits     | staff permission required    |
| Payments     | hosted checkout/webhook signature   | server amount/idempotency check required | payment audit required            | no card storage              | gateway limits        | booking permission required  |
| 3D pipeline  | signed asset keys                   | GLB validator/no external URIs required  | publish audit required            | separate cookieless CDN      | size/CPU queue limits | media permission required    |

## Endpoint policy

| Endpoint                 | Auth    | Authorization                                      | Input boundary                                      |
| ------------------------ | ------- | -------------------------------------------------- | --------------------------------------------------- |
| `GET /api/health`        | public  | none                                               | no user input                                       |
| `POST /api/leads`        | public  | same-origin + rate limit                           | `publicLeadSchema`, honeypot, optional Turnstile    |
| `POST /api/uploads/sign` | session | staff `property:write` permission                  | allowlisted content type/size, generated object key |
| `GET/POST /api/auth/*`   | Auth.js | provider rules                                     | Auth.js credential/provider validation              |
| `/admin/**`              | session | staff role; each future mutation must call `can()` | route/domain Zod schemas                            |
| `/portal/**`             | session | current user ownership                             | route/domain Zod schemas                            |

## Upload policy before enabling real media

Use server-generated UUID object keys and short-lived signed PUT URLs. `POST /api/uploads/sign` now enforces staff permission, an allowlist and per-type limits before issuing a five-minute R2/S3 PUT URL. The production finalize worker must verify magic bytes after upload, re-encode images with EXIF removed, reject external GLB buffers/scripts, scan documents, and serve private documents only through expiring signed GET URLs.

## Pre-launch blockers

1. Add TOTP enrollment/challenge and backup-code recovery for Super Admin and Manager.
2. Replace the local memory limiter with Upstash Redis or an equivalent shared store.
3. Add R2/S3 presign + finalize/scan pipeline and image processing worker.
4. Add immutable audit-log service for auth, permissions, property changes, assignments, exports and deletions.
5. Add payment webhook signature/idempotency adapter before exposing bookings/payments.
6. Add HIBP k-anonymity password breach check, password reset flow and session management UI.
7. Run OWASP ASVS L2 review and Lighthouse CI against the deployed domain.

These are intentionally named as gates; the demo UI does not claim those provider-backed operations are active without credentials and workers.
