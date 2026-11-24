export type PropertyType = 'Land' | 'House' | 'Flat'
export type PropertyStatus = 'Available' | 'Booked' | 'Sold' | 'Upcoming'

export type Property = {
  id: string
  slug: string
  title: string
  titleBn?: string
  type: PropertyType
  status: PropertyStatus
  location: string
  locationBn?: string
  price: number
  currency: 'BDT'
  area: number
  areaUnit: 'sq ft' | 'katha'
  beds?: number
  baths?: number
  floor?: string
  facing?: string
  image: string
  gallery: string[]
  focalPoint: { x: number; y: number }
  summary: string
  summaryBn?: string
  description: string
  descriptionBn?: string
  amenities: string[]
  amenitiesBn?: string[]
  badges: string[]
  featured: boolean
  verified: boolean
  has3d: boolean
  has360: boolean
  hasVideo: boolean
  // Optional video link — stored as a URL only, never a file upload.
  videoUrl?: string | null
  project?: string
  projectSlug?: string
  completion?: string
}
