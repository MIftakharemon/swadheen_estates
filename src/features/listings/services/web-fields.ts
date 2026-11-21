import type { Property } from '@/types/property'

// Display-only fields the relational Property columns do not cover: Bengali
// texts, the image gallery, summary, amenities, badges, 3D/360/video flags,
// the completion note and the project label/slug. Stored as one JSON blob
// (Property.webFields) so the public catalogue can be served from the DB.
export type PropertyWebFields = {
  titleBn?: string
  locationBn?: string
  image?: string
  gallery?: string[]
  summary?: string
  summaryBn?: string
  descriptionBn?: string
  amenities?: string[]
  amenitiesBn?: string[]
  badges?: string[]
  has3d?: boolean
  has360?: boolean
  hasVideo?: boolean
  completion?: string
  project?: string
  projectSlug?: string
  floorLabel?: string
}

export function parseWebFields(value: unknown): PropertyWebFields {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as PropertyWebFields
}

// Serialises the web-only half of a listing for the webFields column, skipping
// empty values so the JSON stays minimal and falsy flags stay absent.
export function buildWebFields(property: Property): PropertyWebFields {
  const clean = (value: string | undefined) => value?.trim() || undefined
  const list = (values: string[] | undefined) => {
    const kept = (values ?? []).map((item) => item.trim()).filter(Boolean)
    return kept.length ? kept : undefined
  }
  const gallery = list(property.gallery)
  const amenities = list(property.amenities)
  const amenitiesBn = list(property.amenitiesBn)
  const badges = list(property.badges)
  const titleBn = clean(property.titleBn)
  const locationBn = clean(property.locationBn)
  const image = clean(property.image)
  const summary = clean(property.summary)
  const summaryBn = clean(property.summaryBn)
  const descriptionBn = clean(property.descriptionBn)
  const completion = clean(property.completion)
  const project = clean(property.project)
  const projectSlug = clean(property.projectSlug)
  const floorLabel = clean(property.floor)
  return {
    ...(titleBn ? { titleBn } : {}),
    ...(locationBn ? { locationBn } : {}),
    ...(image ? { image } : {}),
    ...(gallery ? { gallery } : {}),
    ...(summary ? { summary } : {}),
    ...(summaryBn ? { summaryBn } : {}),
    ...(descriptionBn ? { descriptionBn } : {}),
    ...(amenities ? { amenities } : {}),
    ...(amenitiesBn ? { amenitiesBn } : {}),
    ...(badges ? { badges } : {}),
    ...(property.has3d ? { has3d: true } : {}),
    ...(property.has360 ? { has360: true } : {}),
    ...(property.hasVideo ? { hasVideo: true } : {}),
    ...(completion ? { completion } : {}),
    ...(project ? { project } : {}),
    ...(projectSlug ? { projectSlug } : {}),
    ...(floorLabel ? { floorLabel } : {}),
  }
}
