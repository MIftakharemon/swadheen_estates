'use client'

import { Header } from '@/components/layout/header'
import { useLocale } from '@/i18n/locale-provider'
import {
  PropertyCardSkeleton,
  PropertyGridSkeleton,
  Skeleton,
  AdminDashboardSkeleton,
  HeroSkeleton,
} from '@/components/ui/skeleton'

export default function SkeletonsPage() {
  const { t } = useLocale()
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-shell py-16">
        <p className="eyebrow">{t('dev.eyebrow')}</p>
        <h1 className="display-type mt-4 text-6xl">
          {t('dev.title1')}
          <br />
          <em className="font-normal text-terracotta">{t('dev.title2')}</em>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-ink/60">{t('dev.copy')}</p>
        <section className="mt-12">
          <h2 className="text-sm font-bold">{t('dev.heroSection')}</h2>
          <div className="mt-4">
            <HeroSkeleton />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-sm font-bold">{t('dev.propertyGrid')}</h2>
          <div className="mt-4">
            <PropertyGridSkeleton count={6} />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-sm font-bold">{t('dev.widgetStates')}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-panel border border-line bg-paper p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-5 h-32" />
              <Skeleton className="mt-4 h-3 w-4/5" />
              <Skeleton className="mt-2 h-3 w-3/5" />
            </div>
            <div className="rounded-panel border border-line bg-paper p-5">
              <Skeleton className="h-5 w-1/2" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <PropertyCardSkeleton variant="compact" />
                <PropertyCardSkeleton variant="compact" />
              </div>
            </div>
            <div className="rounded-panel border border-line bg-paper p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-5 h-48" />
              <Skeleton className="mt-4 h-3 w-4/5" />
            </div>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-sm font-bold">{t('dev.adminDashboard')}</h2>
          <div className="mt-4">
            <AdminDashboardSkeleton />
          </div>
        </section>
      </main>
    </div>
  )
}
