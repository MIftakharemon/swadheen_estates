'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const slides = images.length > 0 ? images : ['/icon.svg']

  useEffect(() => {
    if (!playing || slides.length < 2) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3000)
    return () => window.clearInterval(timer)
  }, [playing, slides.length])

  function select(index: number) {
    setActive((index + slides.length) % slides.length)
    setPlaying(true)
  }

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slides[active]}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[active] ?? slides[0] ?? '/icon.svg'}
            alt={`${title} image ${active + 1}`}
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-stretch gap-2 sm:bottom-7 sm:left-10 sm:right-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-xl border border-white/20 bg-ink/25 p-1.5 backdrop-blur-md sm:max-w-[70%]">
          {slides.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => select(index)}
              aria-label={`Show project image ${index + 1}`}
              aria-pressed={active === index}
              className={cn(
                'relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border transition sm:h-14 sm:w-20',
                active === index
                  ? 'border-gold ring-1 ring-gold'
                  : 'border-white/20 opacity-65 hover:opacity-100',
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="flex self-end items-center gap-1.5 rounded-full border border-white/20 bg-ink/25 p-1.5 text-white backdrop-blur-md">
          <button
            type="button"
            onClick={() => select(active - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
            aria-label="Previous project image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-9 text-center text-[10px] font-bold">
            {active + 1}/{slides.length}
          </span>
          <button
            type="button"
            onClick={() => select(active + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
            aria-label="Next project image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
            aria-label={playing ? 'Pause project image slider' : 'Play project image slider'}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  )
}
