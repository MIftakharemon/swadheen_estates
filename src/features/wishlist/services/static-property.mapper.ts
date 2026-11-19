import type { InventoryStatus as DbInventoryStatus, PropertyCreateInput } from '@prisma/client'
import type { Property } from '@/types/property'

const INVENTORY_BY_STATUS: Record<Property['status'], DbInventoryStatus> = {
  Available: 'AVAILABLE',
  Booked: 'BOOKED',
  Sold: 'SOLD',
  Upcoming: 'UPCOMING',
}

// The public catalogue is static data while admin inventory lives in Postgres,
// so the first save mirrors the listing into the Property table (slug-keyed)
// to satisfy the SavedProperty foreign key. Pure and side-effect free.
function cityFrom(location: string): string {
  const parts = location.split(',')
  const last = parts[parts.length - 1]?.trim()
  return last && last.length <= 40 ? last : 'Dhaka'
}

// Static listings describe floors as prose ("Level 03", "3 levels"); the
// database column is a plain integer, so only exact digits survive.
function floorNumber(value: string | undefined): number | null {
  if (!value) return null
  const trimmed = value.trim()
  return /^\d+$/.test(trimmed) ? Number(trimmed) : null
}

export function mapStaticProperty(property: Property): PropertyCreateInput {
  return {
    slug: property.slug,
    title: property.title,
    type: property.type === 'Land' ? 'LAND' : property.type === 'House' ? 'HOUSE' : 'FLAT',
    status: 'PUBLISHED',
    inventory: INVENTORY_BY_STATUS[property.status],
    location: property.location,
    city: cityFrom(property.location),
    description: property.description || property.summary,
    priceMinor: BigInt(Math.round(property.price)),
    area: property.area,
    areaUnit: property.areaUnit,
    bedrooms: property.beds ?? null,
    bathrooms: property.baths ?? null,
    floor: floorNumber(property.floor),
    facing: property.facing ?? null,
    featured: property.featured,
    verified: property.verified,
    focalX: property.focalPoint.x,
    focalY: property.focalPoint.y,
    publishedAt: new Date(),
  }
}
