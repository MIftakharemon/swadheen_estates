import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ListingsBrowser } from '@/components/listings/listings-browser'
import { PropertyGridSkeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Explore verified land, houses and apartments selected by Swadheen Estates.',
}

export default function PropertiesPage() {
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
          <ListingsBrowser />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
