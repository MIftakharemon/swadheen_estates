'use client'

import Link from 'next/link'
import { WifiOff } from 'lucide-react'
import { useLocale } from '@/i18n/locale-provider'

export default function OfflinePage() {
  const { t } = useLocale()
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-gold">
          <WifiOff className="h-7 w-7" />
        </span>
        <p className="mt-8 eyebrow text-gold">{t('offline.eyebrow')}</p>
        <h1 className="display-type mt-4 text-7xl leading-[.82]">
          {t('offline.title1')}
          <br />
          <em className="font-normal text-gold">{t('offline.title2')}</em>
        </h1>
        <p className="mt-6 text-sm leading-7 text-paper/60">{t('offline.copy')}</p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-paper px-5 text-sm font-bold text-ink"
        >
          {t('tryAgain')}
        </Link>
      </div>
    </main>
  )
}
