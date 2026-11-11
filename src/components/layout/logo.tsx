'use client'

import Link from 'next/link'
import { useLocale } from '@/i18n/locale-provider'

export function Logo({ inverse = false }: { inverse?: boolean }) {
  const { t } = useLocale()
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${inverse ? 'text-white' : 'text-ink'}`}
      aria-label={t('a11y.logoHome')}
    >
      <span
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border ${inverse ? 'border-white/40' : 'border-ink/25'}`}
      >
        <span
          className={`h-3.5 w-3.5 rounded-full border ${inverse ? 'border-gold' : 'border-terracotta'}`}
        />
        <span className={`absolute h-1.5 w-1.5 rounded-full ${inverse ? 'bg-gold' : 'bg-terracotta'}`} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-extrabold tracking-[.18em]">SWADHEEN</span>
        <span
          className={`mt-1 text-[8px] font-semibold uppercase tracking-[.27em] ${inverse ? 'text-white/60' : 'text-ink/55'}`}
        >
          {t('logo.estates')}
        </span>
      </span>
    </Link>
  )
}
