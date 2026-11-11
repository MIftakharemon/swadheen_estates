import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPropertyBySlug, properties } from '@/data/properties'
import { PropertyDetailPage } from '@/components/property/property-detail'

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) return { title: 'Property not found' }
  return { title: property.title, description: property.summary, openGraph: { images: [property.image] } }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  if (!property) notFound()
  return <PropertyDetailPage property={property} />
}
