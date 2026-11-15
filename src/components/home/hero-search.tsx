'use client'

import { ArrowRight, BedDouble, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'

export function HeroSearch() {
  const router = useRouter()
  const { t } = useLocale()
  const [type, setType] = useState('Any type')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('Any budget')
  const [beds, setBeds] = useState('Beds')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams()
    if (type !== 'Any type') query.set('type', type)
    if (location.trim()) query.set('location', location.trim())
    if (budget !== 'Any budget') query.set('budget', budget)
    if (beds !== 'Beds') query.set('beds', beds)
    router.push(`/properties${query.size ? `?${query.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={submit}
      className="relative z-20 grid gap-2 rounded-panel border border-white/30 bg-paper/95 p-2 shadow-float backdrop-blur-xl dark:bg-ink/90 sm:grid-cols-[1.1fr_1.4fr_1fr_.85fr_auto] sm:rounded-full sm:p-2"
    >
      <label className="group flex items-center gap-3 rounded-full px-4 py-2.5 transition hover:bg-stone">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-ink/45">{t('hero.lookingFor')}</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="mt-1 w-full appearance-none bg-transparent text-xs font-bold text-ink/40 outline-none"
          >
            <option value="Any type">{t('hero.anyType')}</option>
            <option value="Land">{t('type.land')}</option>
            <option value="House">{t('type.house')}</option>
            <option value="Flat">{t('type.flat')}</option>
          </select>
        </span>
      </label>
      <label className="group flex items-center gap-3 rounded-full px-4 py-2.5 transition hover:bg-stone">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <MapPin className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-ink/45">{t('hero.neighbourhood')}</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder={t('hero.neighbourhoodPlaceholder')}
            className="mt-1 w-full bg-transparent text-xs font-bold outline-none placeholder:text-ink/40"
          />
        </span>
      </label>
      <label className="group flex items-center gap-3 rounded-full px-4 py-2.5 transition hover:bg-stone">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <span className="text-sm font-bold">৳</span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-ink/45">{t('hero.budget')}</span>
          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="mt-1 w-full appearance-none bg-transparent text-xs font-bold text-ink/40 outline-none"
          >
            <option value="Any budget">{t('budget.any')}</option>
            <option value="Under ৳1 Cr">{t('budget.under1Cr')}</option>
            <option value="৳1–3 Cr">{t('budget.oneTo3Cr')}</option>
            <option value="Over ৳3 Cr">{t('budget.over3Cr')}</option>
          </select>
        </span>
      </label>
      <label className="group flex items-center gap-3 rounded-full px-4 py-2.5 transition hover:bg-stone">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <BedDouble className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-ink/45">{t('hero.rooms')}</span>
          <select
            value={beds}
            onChange={(event) => setBeds(event.target.value)}
            className="mt-1 w-full appearance-none bg-transparent text-xs font-bold text-ink/40 outline-none"
          >
            <option value="Beds">{t('hero.bedsAny')}</option>
            <option value="2">{t('beds.2plus')}</option>
            <option value="3">{t('beds.3plus')}</option>
            <option value="4">{t('beds.4plus')}</option>
          </select>
        </span>
      </label>
      <Button
        type="submit"
        size="lg"
        className="w-full sm:h-12 sm:w-12 sm:p-0"
        aria-label={t('a11y.searchProperties')}
      >
        <Search className="h-4 w-4" />
        <span className="sm:hidden">{t('hero.findHome')}</span>
        <ArrowRight className="hidden h-4 w-4 sm:inline" />
      </Button>
    </form>
  )
}
