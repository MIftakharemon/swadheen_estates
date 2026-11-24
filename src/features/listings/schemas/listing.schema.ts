import { z } from 'zod'

// Shared vocabulary between the public catalogue, the admin form and the API —
// one schema so the admin panel can edit every field the web renders.
export const listingTypes = ['Land', 'House', 'Flat'] as const
export const listingStatuses = ['Available', 'Booked', 'Sold', 'Upcoming'] as const
export const areaUnits = ['sq ft', 'katha'] as const
export const listingKinds = ['PROPERTY', 'PROJECT'] as const

export type ListingKind = (typeof listingKinds)[number]
export type ListingType = (typeof listingTypes)[number]
export type ListingStatus = (typeof listingStatuses)[number]

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes only.')

// Images may be absolute URLs or site-relative paths; empty is allowed (the
// mapper falls back to the first gallery image).
const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === '' || /^https?:\/\//.test(value) || value.startsWith('/'), {
    message: 'Enter an image URL.',
  })

// Video links are URLs only — the admin panel never uploads video files.
const videoUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === '' || /^https?:\/\//.test(value), {
    message: 'Enter a video URL.',
  })

const lineList = (maxItems: number, maxLength: number) =>
  z.array(z.string().trim().min(1).max(maxLength)).max(maxItems)

export const propertyFormSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(2).max(160),
  titleBn: z.string().trim().max(160).default(''),
  type: z.enum(listingTypes),
  // Availability shown on the public card.
  status: z.enum(listingStatuses),
  // Publication state — drafts never reach the public site.
  published: z.boolean().default(true),
  location: z.string().trim().min(2).max(160),
  locationBn: z.string().trim().max(160).default(''),
  price: z.number().positive().max(1_000_000_000_000),
  area: z.number().positive().max(1_000_000),
  areaUnit: z.enum(areaUnits).default('sq ft'),
  beds: z.number().int().min(0).max(50).nullable().default(null),
  baths: z.number().int().min(0).max(50).nullable().default(null),
  floor: z.string().trim().max(40).default(''),
  facing: z.string().trim().max(60).default(''),
  image: imageUrlSchema.default(''),
  gallery: z.array(imageUrlSchema).max(12).default([]),
  summary: z.string().trim().max(300).default(''),
  summaryBn: z.string().trim().max(300).default(''),
  description: z.string().trim().max(4000).default(''),
  descriptionBn: z.string().trim().max(4000).default(''),
  amenities: lineList(30, 80).default([]),
  amenitiesBn: lineList(30, 80).default([]),
  badges: lineList(6, 40).default([]),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  has3d: z.boolean().default(false),
  has360: z.boolean().default(false),
  hasVideo: z.boolean().default(false),
  videoUrl: videoUrlSchema.default(''),
  projectSlug: z
    .string()
    .trim()
    .max(120)
    .default('')
    .refine((value) => value === '' || /^[a-z0-9-]+$/.test(value), {
      message: 'Use lowercase letters, numbers and dashes only.',
    }),
  completion: z.string().trim().max(60).default(''),
  focalX: z.number().int().min(0).max(100).default(50),
  focalY: z.number().int().min(0).max(100).default(50),
})

export const projectFormSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).default(''),
  coverImage: imageUrlSchema.default(''),
  gallery: z.array(imageUrlSchema).max(12).default([]),
  videoUrl: videoUrlSchema.default(''),
  totalUnits: z.number().int().min(0).max(100_000).default(0),
  // ISO date (yyyy-mm-dd) or empty for "not delivered yet".
  deliveredAt: z.string().trim().max(40).default(''),
})

// Add/edit payload: the admin picks whether the listing is a property or a
// project, and it lands in the matching section of the public web.
export const listingSaveSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('PROPERTY'), property: propertyFormSchema }),
  z.object({ kind: z.literal('PROJECT'), project: projectFormSchema }),
])

export const listingKindSchema = z.enum(listingKinds)

export type PropertyFormInput = z.infer<typeof propertyFormSchema>
export type ProjectFormInput = z.infer<typeof projectFormSchema>
export type ListingSaveInput = z.infer<typeof listingSaveSchema>
