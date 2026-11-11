'use client'

import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { useLocale } from '@/i18n/locale-provider'

export default function NotFound() {
  const { t } = useLocale()
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-gold">
          <Compass className="h-7 w-7" />
        </span>
        <p className="mt-8 eyebrow text-gold">{t('notFound.eyebrow')}</p>
        <h1 className="display-type mt-4 text-7xl leading-[.82]">
          {t('notFound.title1')}
          <br />
          <em className="font-normal text-gold">{t('notFound.title2')}</em>
        </h1>
        <p className="mt-6 text-sm leading-7 text-paper/60">{t('notFound.copy')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="dark">
            <ArrowLeft className="h-4 w-4" /> {t('goHome')}
          </ButtonLink>
          <Link
            href="/properties"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-paper px-5 text-sm font-bold text-ink"
          >
            {t('exploreProperties')}
          </Link>
        </div>
      </div>
    </main>
  )
}
