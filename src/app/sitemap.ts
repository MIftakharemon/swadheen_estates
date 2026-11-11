import type { MetadataRoute } from 'next'
import { properties } from '@/data/properties'
import { env } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/properties`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/projects/the-grove-bashundhara`, changeFrequency: 'weekly', priority: 0.8 },
    ...properties.map((property) => ({
      url: `${base}/properties/${property.slug}`,
      changeFrequency: 'daily' as const,
      priority: property.featured ? 0.9 : 0.7,
    })),
  ]
}
