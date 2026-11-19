import { describe, expect, it } from 'vitest'
import { getPropertyBySlug } from '@/data/properties'
import { mapStaticProperty } from '@/features/wishlist/services/static-property.mapper'

describe('mapStaticProperty', () => {
  it('mirrors a static listing into a Property create input', () => {
    const listing = getPropertyBySlug('the-grove-3a')
    expect(listing).toBeTruthy()
    if (!listing) return

    const created = mapStaticProperty(listing)
    expect(created.slug).toBe('the-grove-3a')
    expect(created.type).toBe('FLAT')
    expect(created.status).toBe('PUBLISHED')
    expect(created.inventory).toBe('AVAILABLE')
    expect(created.city).toBe('Dhaka')
    expect(created.description).toBe(listing.description)
    expect(BigInt(created.priceMinor as bigint)).toBe(BigInt(28500000))
    expect(created.area).toBe(2180)
    expect(created.bedrooms).toBe(3)
    expect(created.featured).toBe(true)
    expect(created.verified).toBe(true)
    expect(created.focalX).toBe(52)
    // "Level 03" is prose, not an integer — the column stays null.
    expect(created.floor).toBeNull()
  })

  it('derives the city from the last segment of the location', () => {
    const listing = getPropertyBySlug('uttara-south-terrace')
    expect(listing).toBeTruthy()
    if (!listing) return
    expect(mapStaticProperty(listing).city).toBe('Uttara')
  })
})
