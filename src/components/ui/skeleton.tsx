import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('shimmer rounded-md', className)} {...props} />
}

export function PropertyCardSkeleton({
  variant = 'grid',
}: {
  variant?: 'grid' | 'list' | 'compact' | 'map'
}) {
  if (variant === 'list')
    return (
      <div className="flex gap-4 rounded-panel border border-line p-3">
        <Skeleton className="h-32 w-44 shrink-0" />
        <div className="flex flex-1 flex-col gap-3 py-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="mt-auto h-4 w-1/3" />
        </div>
      </div>
    )
  if (variant === 'map')
    return (
      <div className="w-72 rounded-panel border border-line bg-paper p-2">
        <Skeleton className="aspect-[4/3]" />
        <div className="space-y-3 p-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    )
  return (
    <div className={cn('space-y-4', variant === 'compact' && 'flex gap-3 space-y-0')}>
      <Skeleton className={cn('aspect-[4/3] w-full', variant === 'compact' && 'h-20 w-24 shrink-0')} />
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[680px] bg-stone p-8">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-24 h-20 max-w-2xl" />
      <Skeleton className="mt-5 h-4 max-w-md" />
      <Skeleton className="mt-10 h-16 max-w-3xl rounded-panel" />
    </div>
  )
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-panel" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-panel" />
    </div>
  )
}
