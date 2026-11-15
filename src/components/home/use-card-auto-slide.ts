'use client'

import { useEffect, type RefObject } from 'react'
import { useMotionPreferences } from '@/experience/motion/motion-provider'

export function useCardAutoSlide(
  scrollerRef: RefObject<HTMLElement | null>,
  cardSelector: string,
  enabled: boolean,
) {
  const { reducedMotion } = useMotionPreferences()

  useEffect(() => {
    if (!enabled || reducedMotion) return
    const scroller = scrollerRef.current
    if (!scroller) return
    const id = window.setInterval(() => {
      if (!scroller.clientWidth) return
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>(cardSelector))
      const [first, second] = cards
      if (!first || !second) return
      const step = second.offsetLeft - first.offsetLeft
      if (!step) return
      // Land exactly on a card boundary so each slide shows one full card,
      // even when a manual swipe left the row between two cards.
      const pad = parseFloat(window.getComputedStyle(scroller).scrollPaddingLeft) || 0
      const current = Math.min(
        cards.length - 1,
        Math.max(0, Math.round((scroller.scrollLeft + pad - first.offsetLeft) / step)),
      )
      const target = cards[current + 1 >= cards.length ? 0 : current + 1]
      if (!target) return
      scroller.scrollTo({ left: target.offsetLeft - pad, behavior: 'smooth' })
    }, 4200)
    return () => window.clearInterval(id)
  }, [cardSelector, enabled, reducedMotion, scrollerRef])
}
