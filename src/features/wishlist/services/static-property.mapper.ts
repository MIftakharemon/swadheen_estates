import type { PropertyCreateInput } from '@prisma/client'
import type { Property } from '@/types/property'
import { buildPropertyWriteData } from '@/features/listings/services/property-persistence'

// The public catalogue is static data while admin inventory lives in Postgres,
// so the first save mirrors the listing into the Property table (slug-keyed)
// to satisfy the SavedProperty foreign key. Pure and side-effect free — the
// shared builder keeps this row identical to what the admin panel writes.
// projectSlug is dropped here: this mapper has no database to resolve the
// project relation with (the seeded catalogue already carries it).
export function mapStaticProperty(property: Property): PropertyCreateInput {
  const { projectSlug: _projectSlug, ...data } = buildPropertyWriteData(property, {
    sortOrder: 0,
  })
  return data
}
