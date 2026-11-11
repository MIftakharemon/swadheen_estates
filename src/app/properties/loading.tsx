import { Header } from '@/components/layout/header'
import { PropertyGridSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="container-shell py-24">
        <PropertyGridSkeleton count={6} />
      </main>
    </>
  )
}
