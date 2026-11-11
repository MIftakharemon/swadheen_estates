import { Header } from '@/components/layout/header'
import { HeroSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <HeroSkeleton />
        <section className="section-space">
          <div className="container-shell space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-panel" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
