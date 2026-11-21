import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { properties as staticProperties, getPropertyBySlug } from '@/data/properties'
import { PropertyDetailPage } from '@/components/property/property-detail'
import {
  getPublishedProperties,
  resolvePublicProperty,
} from '@/features/listings/services/public-listings'

export function generateStaticParams() {
  return staticProperties.map((property) => ({ slug: property.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const property = (await resolvePublicProperty(slug)) ?? getPropertyBySlug(slug)
  if (!property) return { title: 'Property not found' }
  return { title: property.title, description: property.summary, openGraph: { images: [property.image] } }
}

// Refresh every minute so admin edits and new listings appear without a redeploy.
export const revalidate = 60

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // The database decides: published → render, draft/deleted → 404, no database
  // → static catalogue.
  const property = await resolvePublicProperty(slug)
  if (!property) notFound()
  const catalogue = (await getPublishedProperties()) ?? staticProperties
  const related = catalogue.filter((item) => item.slug !== property.slug)
  return <PropertyDetailPage property={property} related={related} />
}
