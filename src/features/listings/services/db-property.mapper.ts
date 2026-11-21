import type { PropertyRecord } from '@prisma/client'
import type { Property } from '@/types/property'
import { parseWebFields } from './web-fields'

const TYPE_TO_WEB: Record<PropertyRecord['type'], Property['type']> = {
  LAND: 'Land',
  HOUSE: 'House',
  FLAT: 'Flat',
}

const INVENTORY_TO_WEB: Record<PropertyRecord['inventory'], Property['status']> = {
  AVAILABLE: 'Available',
  BOOKED: 'Booked',
  SOLD: 'Sold',
  UPCOMING: 'Upcoming',
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

// Maps a Property row (core columns + webFields JSON) back to the exact shape
// the public web renders, so admin edits and additions appear on the site.
export function mapDbProperty(row: PropertyRecord): Property {
  const fields = parseWebFields(row.webFields)
  const gallery = stringArray(fields.gallery)
  const image = optionalString(fields.image) ?? gallery[0] ?? ''
  const titleBn = optionalString(fields.titleBn)
  const locationBn = optionalString(fields.locationBn)
  const summaryBn = optionalString(fields.summaryBn)
  const descriptionBn = optionalString(fields.descriptionBn)
  const amenitiesBn = stringArray(fields.amenitiesBn)
  const completion = optionalString(fields.completion)
  const project = optionalString(fields.project) ?? row.project?.name
  const projectSlug = optionalString(fields.projectSlug) ?? row.project?.slug
  const floor =
    optionalString(fields.floorLabel) ??
    (row.floor !== null && row.floor !== undefined ? String(row.floor) : undefined)
  const facing = optionalString(row.facing)
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    ...(titleBn ? { titleBn } : {}),
    type: TYPE_TO_WEB[row.type],
    status: INVENTORY_TO_WEB[row.inventory],
    location: row.location,
    ...(locationBn ? { locationBn } : {}),
    price: Number(row.priceMinor),
    currency: 'BDT',
    area: Number(row.area),
    areaUnit: row.areaUnit === 'katha' ? 'katha' : 'sq ft',
    ...(row.bedrooms !== null ? { beds: row.bedrooms } : {}),
    ...(row.bathrooms !== null ? { baths: row.bathrooms } : {}),
    ...(floor ? { floor } : {}),
    ...(facing ? { facing } : {}),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    focalPoint: { x: row.focalX, y: row.focalY },
    summary: optionalString(fields.summary) ?? row.description,
    ...(summaryBn ? { summaryBn } : {}),
    description: row.description,
    ...(descriptionBn ? { descriptionBn } : {}),
    amenities: stringArray(fields.amenities),
    ...(amenitiesBn.length ? { amenitiesBn } : {}),
    badges: stringArray(fields.badges),
    featured: row.featured,
    verified: row.verified,
    has3d: fields.has3d === true,
    has360: fields.has360 === true,
    hasVideo: fields.hasVideo === true,
    ...(project ? { project } : {}),
    ...(projectSlug ? { projectSlug } : {}),
    ...(completion ? { completion } : {}),
  }
}
