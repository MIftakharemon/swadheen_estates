'use client'

import { ArrowRight, Check, Info, Loader2, Mail, Plus, Search, Star, Trash2 } from 'lucide-react'
import { properties } from '@/data/properties'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertyCard } from '@/components/property/property-card'
import { Badge, FeatureBadge, StatusBadge, VerifiedBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { Skeleton, PropertyCardSkeleton } from '@/components/ui/skeleton'

import { useLocale } from '@/i18n/locale-provider'

export default function DesignSystemPage() {
  const { t } = useLocale()
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-shell py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">{t('ds.eyebrow')}</p>
          <h1 className="display-type mt-4 text-6xl leading-[.85] sm:text-8xl">
            {t('ds.title1')}
            <br />
            <em className="font-normal text-terracotta">{t('ds.title2')}</em>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ink/60">{t('ds.intro')}</p>
        </div>
        <section className="mt-20">
          <SectionHeading eyebrow={t('ds.paletteEyebrow')} title={t('ds.paletteTitle')} />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {([
              t('ds.colorPaper'),
              t('ds.colorStone'),
              t('ds.colorInk'),
              t('ds.colorTerracotta'),
              t('ds.colorMoss'),
              t('ds.colorGold'),
              t('ds.colorSuccess'),
              t('ds.colorDanger'),
            ].map((label, index) => (
              <div key={label}>
                <div className={`h-24 rounded-xl border border-line ${[
                  'bg-paper',
                  'bg-stone',
                  'bg-ink',
                  'bg-terracotta',
                  'bg-moss',
                  'bg-gold',
                  'bg-[hsl(var(--success))]',
                  'bg-[hsl(var(--danger))]',
                ][index]}`} />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[.12em] text-ink/50">{label}</p>
              </div>
            )))}
          </div>
        </section>
        <section className="mt-20">
          <SectionHeading eyebrow={t('ds.typeEyebrow')} title={t('ds.typeTitle')} />
          <div className="mt-8 grid gap-8 rounded-panel border border-line bg-stone p-7 md:grid-cols-2">
            <div>
              <p className="display-type text-7xl leading-[.8]">
                {t('ds.typeSample1')}
                <br />
                <em className="font-normal text-terracotta">{t('ds.typeSample2')}</em>
              </p>
              <p className="mt-7 text-sm leading-7 text-ink/60">{t('ds.typeCopy')}</p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-ink/45">{t('ds.numeric')}</p>
              <p className="numeric mt-3 text-5xl font-extrabold tracking-[-.06em]">৳2.85 Cr</p>
              <p className="mt-2 text-sm text-ink/50">{t('ds.metaSample')}</p>
            </div>
          </div>
        </section>
        <section className="mt-20">
          <SectionHeading eyebrow="Controls" title="Every state has a place." />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-panel border border-line bg-paper p-6 shadow-soft">
              <p className="text-xs font-bold text-ink/45">{t('ds.controlsButtons')}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button>
                  {t('ds.primary')} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary">{t('ds.secondary')}</Button>
                <Button variant="outline">{t('ds.outline')}</Button>
                <Button variant="ghost">{t('ds.ghost')}</Button>
                <Button disabled>{t('ds.disabled')}</Button>
                <Button>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('ds.loading')}
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <Badge>{t('ds.neutral')}</Badge>
                <Badge tone="accent">{t('ds.newRelease')}</Badge>
                <Badge tone="success">{t('status.available')}</Badge>
                <Badge tone="warning">{t('status.booked')}</Badge>
                <Badge tone="danger">{t('status.sold')}</Badge>
                <FeatureBadge />
                <VerifiedBadge />
                <StatusBadge status="Upcoming" />
              </div>
            </div>
            <div className="rounded-panel border border-line bg-paper p-6 shadow-soft">
              <p className="text-xs font-bold text-ink/45">{t('ds.controlsInputs')}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="relative sm:col-span-2">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    placeholder={t('ds.searchNeighbourhood')}
                    className="h-12 w-full rounded-xl border border-line bg-stone pl-11 pr-4 text-sm outline-none focus:border-terracotta"
                  />
                </label>
                <input
                  placeholder={t('form.yourName')}
                  className="h-12 rounded-xl border border-line bg-stone px-4 text-sm outline-none focus:border-terracotta"
                />
                <input
                  placeholder={t('form.email')}
                  className="h-12 rounded-xl border border-line bg-stone px-4 text-sm outline-none focus:border-terracotta"
                />
                <select className="h-12 rounded-xl border border-line bg-stone px-4 text-sm outline-none focus:border-terracotta">
                  <option>{t('form.propertyType')}</option>
                  <option>{t('type.land')}</option>
                  <option>{t('type.house')}</option>
                  <option>{t('type.flat')}</option>
                </select>
                <button
                  type="button"
                  className="flex h-12 items-center justify-between rounded-xl border border-danger bg-[hsl(var(--danger)/.05)] px-4 text-left text-sm text-danger"
                >
                  <span>{t('ds.invalidField')}</span>
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20">
          <SectionHeading eyebrow="Cards & loading" title="Photography leads. UI follows." />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <PropertyCard property={properties[0]!} />
            <div className="rounded-panel border border-line bg-paper p-5">
              <p className="mb-5 text-xs font-bold text-ink/45">{t('ds.skeletonParity')}</p>
              <PropertyCardSkeleton />
              <div className="mt-8 grid grid-cols-3 gap-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20 rounded-panel bg-ink p-7 text-paper sm:p-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
                <Check className="h-4 w-4" />
              </span>
              <p className="mt-5 text-sm font-bold">{t('ds.a11y1Title')}</p>
              <p className="mt-2 text-xs leading-5 text-paper/50">{t('ds.a11y1Copy')}</p>
            </div>
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
                <Star className="h-4 w-4" />
              </span>
              <p className="mt-5 text-sm font-bold">{t('ds.a11y2Title')}</p>
              <p className="mt-2 text-xs leading-5 text-paper/50">{t('ds.a11y2Copy')}</p>
            </div>
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
                <Mail className="h-4 w-4" />
              </span>
              <p className="mt-5 text-sm font-bold">{t('ds.a11y3Title')}</p>
              <p className="mt-2 text-xs leading-5 text-paper/50">{t('ds.a11y3Copy')}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
