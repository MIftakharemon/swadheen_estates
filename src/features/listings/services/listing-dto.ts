import type { ProjectRecord, PropertyRecord } from '@prisma/client'
import type { AdminProjectDto, AdminPropertyDto } from '@/features/listings/types'
import { mapDbProperty } from './db-property.mapper'

// Row → admin API payload: the public web shape plus the bookkeeping the
// panel shows (publication state and timestamps).
export function propertyDto(row: PropertyRecord): AdminPropertyDto {
  return {
    ...mapDbProperty(row),
    dbStatus: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export function projectDto(row: ProjectRecord): AdminProjectDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    description: row.description,
    coverImage: row.coverImage,
    gallery: row.gallery ?? [],
    videoUrl: row.videoUrl ?? null,
    totalUnits: row.totalUnits,
    deliveredAt: row.deliveredAt ? row.deliveredAt.toISOString() : null,
    propertyCount: row._count?.properties ?? 0,
    updatedAt: row.updatedAt.toISOString(),
  }
}
