import type { PropertyCreateInput } from '@prisma/client'
import type { Property } from '@/types/property'
import type { PropertyFormInput } from '@/features/listings/schemas/listing.schema'
import { buildWebFields } from './web-fields'

const INVENTORY_BY_STATUS: Record<Property['status'], 'AVAILABLE' | 'BOOKED' | 'SOLD' | 'UPCOMING'> = {
  Available: 'AVAILABLE',
  Booked: 'BOOKED',
  Sold: 'SOLD',
  Upcoming: 'UPCOMING',
}

const TYPE_BY_PROPERTY_TYPE: Record<Property['type'], 'LAND' | 'HOUSE' | 'FLAT'> = {
  Land: 'LAND',
  House: 'HOUSE',
  Flat: 'FLAT',
}

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

// What actually gets written to the Property table: relational columns plus
// the webFields JSON, with the project slug left for the caller to resolve
// into a projectId (the Project row may not exist yet).
export type PropertyWriteData = PropertyCreateInput & { projectSlug?: string }

export function buildPropertyWriteData(
  property: Property,
  options?: { sortOrder?: number; published?: boolean },
): PropertyWriteData {
  const projectSlug = property.projectSlug?.trim() || undefined
  return {
    slug: property.slug,
    title: property.title,
    type: TYPE_BY_PROPERTY_TYPE[property.type],
    status: options?.published === false ? 'DRAFT' : 'PUBLISHED',
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
    webFields: buildWebFields(property),
    sortOrder: options?.sortOrder ?? 0,
    ...(projectSlug ? { projectSlug } : {}),
  }
}

// The admin form submits plain strings/booleans; this converts them into the
// public web Property shape so one builder writes every listing.
export function propertyFormToWeb(input: PropertyFormInput): Property {
  return {
    id: '',
    slug: input.slug,
    title: input.title,
    ...(input.titleBn ? { titleBn: input.titleBn } : {}),
    type: input.type,
    status: input.status,
    location: input.location,
    ...(input.locationBn ? { locationBn: input.locationBn } : {}),
    price: input.price,
    currency: 'BDT',
    area: input.area,
    areaUnit: input.areaUnit,
    ...(input.beds !== null ? { beds: input.beds } : {}),
    ...(input.baths !== null ? { baths: input.baths } : {}),
    ...(input.floor ? { floor: input.floor } : {}),
    ...(input.facing ? { facing: input.facing } : {}),
    image: input.image,
    gallery: input.gallery,
    focalPoint: { x: input.focalX, y: input.focalY },
    summary: input.summary,
    ...(input.summaryBn ? { summaryBn: input.summaryBn } : {}),
    description: input.description,
    ...(input.descriptionBn ? { descriptionBn: input.descriptionBn } : {}),
    amenities: input.amenities,
    ...(input.amenitiesBn.length ? { amenitiesBn: input.amenitiesBn } : {}),
    badges: input.badges,
    featured: input.featured,
    verified: input.verified,
    has3d: input.has3d,
    has360: input.has360,
    hasVideo: input.hasVideo,
    ...(input.videoUrl ? { videoUrl: input.videoUrl } : {}),
    ...(input.projectSlug ? { projectSlug: input.projectSlug } : {}),
    ...(input.completion ? { completion: input.completion } : {}),
  }
}
