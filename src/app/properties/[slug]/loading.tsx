import { Header } from '@/components/layout/header'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-8 h-20 max-w-2xl" />
        <Skeleton className="mt-8 aspect-[16/7] rounded-panel" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
          <Skeleton className="h-96 rounded-panel" />
          <Skeleton className="h-96 rounded-panel" />
        </div>
      </main>
    </>
  )
}
