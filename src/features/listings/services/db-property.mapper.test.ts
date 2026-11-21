import { describe, expect, it } from 'vitest'
import { properties } from '@/data/properties'
import { mapDbProperty } from '@/features/listings/services/db-property.mapper'
import {
  buildPropertyWriteData,
  propertyFormToWeb,
} from '@/features/listings/services/property-persistence'
import type { PropertyRecord } from '@prisma/client'
import type { Property } from '@/types/property'

// Simulates the row the database stores for a listing written by the admin
// panel (or the seed sync): core columns + webFields JSON + project relation.
function toRecord(property: Property, index: number): PropertyRecord {
  const write = buildPropertyWriteData(property, { sortOrder: index })
  return {
    id: `row-${index}`,
    slug: write.slug,
    title: write.title,
    type: write.type,
    status: write.status ?? 'PUBLISHED',
    inventory: write.inventory ?? 'AVAILABLE',
    location: write.location,
    city: write.city,
    description: write.description,
    priceMinor: BigInt(write.priceMinor as number),
    currency: 'BDT',
    area: write.area as number,
    areaUnit: write.areaUnit ?? 'sq ft',
    bedrooms: write.bedrooms ?? null,
    bathrooms: write.bathrooms ?? null,
    floor: write.floor ?? null,
    facing: write.facing ?? null,
    featured: write.featured ?? false,
    verified: write.verified ?? false,
    focalX: write.focalX ?? 50,
    focalY: write.focalY ?? 50,
    webFields: write.webFields ?? null,
    sortOrder: write.sortOrder ?? 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    publishedAt: null,
    projectId: null,
    ...(property.projectSlug
      ? { project: { name: property.project ?? property.projectSlug, slug: property.projectSlug } }
      : {}),
  }
}

describe('buildPropertyWriteData → mapDbProperty round trip', () => {
  it('preserves every public listing in the static catalogue', () => {
    for (const [index, property] of properties.entries()) {
      const mapped = mapDbProperty(toRecord(property, index))
      expect(mapped.slug, property.slug).toBe(property.slug)
      expect(mapped.title, property.slug).toBe(property.title)
      expect(mapped.type, property.slug).toBe(property.type)
      expect(mapped.status, property.slug).toBe(property.status)
      expect(mapped.location, property.slug).toBe(property.location)
      expect(mapped.price, property.slug).toBe(property.price)
      expect(mapped.area, property.slug).toBe(property.area)
      expect(mapped.areaUnit, property.slug).toBe(property.areaUnit)
      expect(mapped.image, property.slug).toBe(property.image)
      expect(mapped.gallery, property.slug).toEqual(property.gallery)
      expect(mapped.summary, property.slug).toBe(property.summary)
      expect(mapped.description, property.slug).toBe(property.description)
      expect(mapped.amenities, property.slug).toEqual(property.amenities)
      expect(mapped.badges, property.slug).toEqual(property.badges)
      expect(mapped.featured, property.slug).toBe(property.featured)
      expect(mapped.verified, property.slug).toBe(property.verified)
      expect(mapped.focalPoint, property.slug).toEqual(property.focalPoint)
      expect(mapped.titleBn, property.slug).toBe(property.titleBn)
      expect(mapped.locationBn, property.slug).toBe(property.locationBn)
      expect(mapped.summaryBn, property.slug).toBe(property.summaryBn)
      expect(mapped.descriptionBn, property.slug).toBe(property.descriptionBn)
      expect(mapped.amenitiesBn, property.slug).toEqual(property.amenitiesBn)
      expect(mapped.has3d, property.slug).toBe(property.has3d)
      expect(mapped.has360, property.slug).toBe(property.has360)
      expect(mapped.hasVideo, property.slug).toBe(property.hasVideo)
      expect(mapped.projectSlug, property.slug).toBe(property.projectSlug)
      expect(mapped.completion, property.slug).toBe(property.completion)
      expect(mapped.beds, property.slug).toBe(property.beds ?? undefined)
      expect(mapped.baths, property.slug).toBe(property.baths ?? undefined)
    }
  })

  it('maps floor prose to a null column but keeps the label in webFields', () => {
    const property = properties.find((item) => item.floor && !/^\d+$/.test(item.floor))
    expect(property, 'catalogue should contain a prose floor label').toBeTruthy()
    const record = toRecord(property!, 0)
    expect(record.floor).toBeNull()
    const mapped = mapDbProperty(record)
    expect(mapped.floor).toBe(property!.floor)
  })
})

describe('propertyFormToWeb', () => {
  it('builds a web Property the persistence builder accepts', () => {
    const base = properties[0]!
    const write = buildPropertyWriteData(propertyFormToWeb({ ...formFor(base) }), {
      sortOrder: 3,
    })
    expect(write.slug).toBe(base.slug)
    expect(write.sortOrder).toBe(3)
    expect(write.status).toBe('PUBLISHED')
  })
})

// Minimal valid form payload derived from a catalogue entry.
function formFor(property: Property) {
  return {
    slug: property.slug,
    title: property.title,
    titleBn: property.titleBn ?? '',
    type: property.type,
    status: property.status,
    published: true,
    location: property.location,
    locationBn: property.locationBn ?? '',
    price: property.price,
    area: property.area,
    areaUnit: property.areaUnit,
    beds: property.beds ?? null,
    baths: property.baths ?? null,
    floor: property.floor ?? '',
    facing: property.facing ?? '',
    image: property.image,
    gallery: property.gallery,
    summary: property.summary,
    summaryBn: property.summaryBn ?? '',
    description: property.description,
    descriptionBn: property.descriptionBn ?? '',
    amenities: property.amenities,
    amenitiesBn: property.amenitiesBn ?? [],
    badges: property.badges,
    featured: property.featured,
    verified: property.verified,
    has3d: property.has3d,
    has360: property.has360,
    hasVideo: property.hasVideo,
    projectSlug: property.projectSlug ?? '',
    completion: property.completion ?? '',
    focalX: property.focalPoint.x,
    focalY: property.focalPoint.y,
  }
}
