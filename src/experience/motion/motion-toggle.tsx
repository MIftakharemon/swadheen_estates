'use client'

import { Accessibility, Gauge } from 'lucide-react'
import { useMotionPreferences } from '@/experience/motion/motion-provider'
import { useLocale } from '@/i18n/locale-provider'

export function MotionToggle({ dark = false }: { dark?: boolean }) {
  const { reducedMotion, slowMotion, setReducedMotion, setSlowMotion } = useMotionPreferences()
  const { t } = useLocale()
  const styles = dark
    ? 'border-white/10 text-paper/80 hover:border-gold hover:text-paper'
    : 'border-line text-ink/60 hover:border-terracotta hover:text-terracotta'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setReducedMotion(!reducedMotion)}
        aria-pressed={reducedMotion}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition ${styles}`}
      >
        <Accessibility className="h-3.5 w-3.5" /> {reducedMotion ? t('motionReduced') : t('reduceMotion')}
      </button>
      <button
        type="button"
        onClick={() => setSlowMotion(!slowMotion)}
        aria-pressed={slowMotion}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition ${styles}`}
      >
        <Gauge className="h-3.5 w-3.5" /> {slowMotion ? t('slowFilmOn') : t('slowFilm')}
      </button>
    </div>
  )
}
