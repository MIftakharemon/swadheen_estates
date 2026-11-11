# Adding a feature

1. Define the user journey and failure state.
2. Add a Zod schema before accepting input.
3. Add or update the Prisma migration and indexes.
4. Put business rules in `src/features/<domain>/services`; keep route handlers thin.
5. Add server authentication and object-level `can()` checks before mutations.
6. Add a matching widget skeleton and `loading.tsx` fallback.
7. Add unit coverage for the service and a Playwright journey for the user outcome.
8. Run lint, typecheck, tests, build and the relevant visual/accessibility route.

Do not put secrets, database calls or authorization decisions in client components. Do not spread request bodies into Prisma writes.
