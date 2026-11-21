import { describe, expect, it } from 'vitest'
import {
  listingSaveSchema,
  projectFormSchema,
  propertyFormSchema,
} from '@/features/listings/schemas/listing.schema'

const validProperty = {
  slug: 'gulshan-garden-house',
  title: 'Gulshan garden house',
  titleBn: 'গুলশান গার্ডেন হাউস',
  type: 'House' as const,
  status: 'Available' as const,
  published: true,
  location: 'Gulshan, Dhaka',
  locationBn: 'গুলশান, ঢাকা',
  price: 28500000,
  area: 3200,
  areaUnit: 'sq ft' as const,
  beds: 4,
  baths: 4,
  floor: 'Level 03',
  facing: 'South-east',
  image: 'https://images.example/house.jpg',
  gallery: ['https://images.example/1.jpg'],
  summary: 'A calm family home.',
  summaryBn: 'শান্ত পারিবারিক বাড়ি।',
  description: 'Long description.',
  descriptionBn: 'দীর্ঘ বিবরণ।',
  amenities: ['Backup generator'],
  amenitiesBn: ['ব্যাকআপ জেনারেটর'],
  badges: ['Verified'],
  featured: true,
  verified: true,
  has3d: true,
  has360: false,
  hasVideo: false,
  projectSlug: '',
  completion: 'Ready to move',
  focalX: 45,
  focalY: 60,
}

describe('propertyFormSchema', () => {
  it('accepts a complete property form', () => {
    const parsed = propertyFormSchema.safeParse(validProperty)
    expect(parsed.success).toBe(true)
  })

  it('rejects an empty slug', () => {
    const parsed = propertyFormSchema.safeParse({ ...validProperty, slug: ' ' })
    expect(parsed.success).toBe(false)
  })

  it('rejects a negative price', () => {
    const parsed = propertyFormSchema.safeParse({ ...validProperty, price: -1 })
    expect(parsed.success).toBe(false)
  })

  it('defaults nullable beds/baths to null', () => {
    const parsed = propertyFormSchema.safeParse({ ...validProperty, beds: null, baths: null })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.beds).toBeNull()
      expect(parsed.data.baths).toBeNull()
    }
  })
})

describe('projectFormSchema', () => {
  it('accepts a complete project form', () => {
    const parsed = projectFormSchema.safeParse({
      slug: 'parkside-banani',
      name: 'Parkside, Banani',
      location: 'Banani, Dhaka',
      description: 'A garden-first address.',
      coverImage: 'https://images.example/cover.jpg',
      totalUnits: 32,
      deliveredAt: '',
    })
    expect(parsed.success).toBe(true)
  })

  it('rejects a project without a name', () => {
    const parsed = projectFormSchema.safeParse({
      slug: 'parkside-banani',
      name: '',
      location: 'Banani, Dhaka',
      description: '',
      coverImage: '',
      totalUnits: 0,
      deliveredAt: '',
    })
    expect(parsed.success).toBe(false)
  })
})

describe('listingSaveSchema', () => {
  it('discriminates property payloads', () => {
    const parsed = listingSaveSchema.safeParse({ kind: 'PROPERTY', property: validProperty })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.kind).toBe('PROPERTY')
  })

  it('discriminates project payloads', () => {
    const parsed = listingSaveSchema.safeParse({
      kind: 'PROJECT',
      project: {
        slug: 'parkside-banani',
        name: 'Parkside, Banani',
        location: 'Banani, Dhaka',
        description: '',
        coverImage: '',
        totalUnits: 32,
        deliveredAt: '',
      },
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.kind).toBe('PROJECT')
  })

  it('rejects a payload with neither kind', () => {
    expect(listingSaveSchema.safeParse({}).success).toBe(false)
  })
})
