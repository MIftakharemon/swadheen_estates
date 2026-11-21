import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ListingsBrowser } from '@/components/listings/listings-browser'
import { PropertyGridSkeleton } from '@/components/ui/skeleton'
import { properties as staticProperties } from '@/data/properties'
import { getPublishedProperties } from '@/features/listings/services/public-listings'

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Explore verified land, houses and apartments selected by Swadheen Estates.',
}

// Re-read the catalogue every minute so admin edits and additions go live
// without a redeploy.
export const revalidate = 60

export default async function PropertiesPage() {
  const listings = (await getPublishedProperties()) ?? staticProperties
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 sm:pt-24">
        <Suspense
          fallback={
            <div className="container-shell">
              <PropertyGridSkeleton count={6} />
            </div>
          }
        >
          <ListingsBrowser properties={listings} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
