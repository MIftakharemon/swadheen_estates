import type { PrismaClient } from '@prisma/client'
import { getPropertyBySlug } from '@/data/properties'
import { mapStaticProperty } from './static-property.mapper'

type Db = PrismaClient

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2002'
}

// The public catalogue is static data; a property the admin has not mirrored
// yet is created from that listing the first time somebody saves it.
async function resolvePropertyId(db: Db, slug: string): Promise<string | null> {
  const existing = await db.property.findUnique({ where: { slug }, select: { id: true } })
  if (existing) return existing.id

  const listing = getPropertyBySlug(slug)
  if (!listing) return null
  try {
    const created = await db.property.upsert({
      where: { slug },
      update: {},
      create: mapStaticProperty(listing),
      select: { id: true },
    })
    return created.id
  } catch (error) {
    // Two visitors saving the same new listing at once — re-read the winner.
    if (isUniqueViolation(error)) {
      const row = await db.property.findUnique({ where: { slug }, select: { id: true } })
      if (row) return row.id
    }
    throw error
  }
}

export async function listSavedSlugs(userId: string): Promise<string[]> {
  const { db } = await import('@/lib/db')
  const rows = await db.savedProperty.findMany({
    where: { userId },
    select: { property: { select: { slug: true } } },
  })
  return rows.map((row) => row.property.slug)
}

// Returns the resulting state, or null when the slug matches no property.
export async function toggleSavedProperty(
  userId: string,
  slug: string,
): Promise<{ saved: boolean } | null> {
  const { db } = await import('@/lib/db')
  const propertyId = await resolvePropertyId(db, slug)
  if (!propertyId) return null

  const key = { userId_propertyId: { userId, propertyId } }
  const existing = await db.savedProperty.findUnique({ where: key })
  if (existing) {
    await db.savedProperty.delete({ where: key })
    return { saved: false }
  }
  try {
    await db.savedProperty.create({ data: { userId, propertyId } })
  } catch (error) {
    if (isUniqueViolation(error)) return { saved: true }
    throw error
  }
  return { saved: true }
}
