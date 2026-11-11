'use client'

import { Languages } from 'lucide-react'
import { useLocale } from '@/i18n/locale-provider'

export function LanguageToggle({ overlay = false }: { overlay?: boolean }) {
  const { locale, setLocale, t } = useLocale()
  const next = locale === 'en' ? 'bn' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={next === 'bn' ? t('a11y.switchToBengali') : t('a11y.switchToEnglish')}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[10px] font-bold uppercase tracking-[.12em] transition ${overlay ? 'hover:bg-white/10' : 'hover:bg-stone'}`}
    >
      <Languages className="h-3.5 w-3.5" /> {locale === 'en' ? 'বাংলা' : 'EN'}
    </button>
  )
}
