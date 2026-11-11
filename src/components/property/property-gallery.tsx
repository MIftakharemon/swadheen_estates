'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMotionPreferences } from '@/experience/motion/motion-provider'
import { cn } from '@/lib/utils'

const SLIDE_MS = 4000

export function PropertyGallery({
  images,
  title,
  focalPoint,
  badge,
}: {
  images: string[]
  title: string
  focalPoint?: { x: number; y: number }
  badge?: React.ReactNode
}) {
  const { reducedMotion } = useMotionPreferences()
  const slides = images.length > 0 ? images : ['/icon.svg']
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (reducedMotion || !playing || slides.length < 2) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      SLIDE_MS,
    )
    return () => window.clearInterval(timer)
  }, [playing, reducedMotion, slides.length])

  function select(index: number) {
    setActive((index + slides.length) % slides.length)
    setPlaying(true)
  }

  return (
    <div className="image-frame relative aspect-[4/3] overflow-hidden rounded-panel sm:aspect-[16/10]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slides[active]}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[active] ?? slides[0] ?? '/icon.svg'}
            alt={`${title} — image ${active + 1} of ${slides.length}`}
            fill
            priority={active === 0}
            sizes="(max-width: 640px) 100vw, 64vw"
            className="object-cover"
            style={
              focalPoint
                ? { objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }
                : undefined
            }
          />
        </motion.div>
      </AnimatePresence>

      {/* Multi-image selector — top-left corner */}
      <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] gap-1.5 overflow-x-auto rounded-xl border border-white/25 bg-ink/45 p-1.5 backdrop-blur-md">
        {slides.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => select(index)}
            aria-label={`Show image ${index + 1} of ${slides.length}`}
            aria-pressed={active === index}
            className={cn(
              'relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition sm:h-14 sm:w-20',
              active === index
                ? 'border-gold ring-1 ring-gold'
                : 'border-white/25 opacity-65 hover:opacity-100',
            )}
          >
            <Image src={image} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Counter + transport — bottom-right */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-ink/45 p-1.5 text-white backdrop-blur-md">
        <button
          type="button"
          onClick={() => select(active - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-[10px] font-bold">
          {active + 1}/{slides.length}
        </span>
        <button
          type="button"
          onClick={() => select(active + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((current) => !current)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        </button>
      </div>

      {badge && <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">{badge}</div>}
    </div>
  )
}
