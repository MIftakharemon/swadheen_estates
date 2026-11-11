'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { Property } from '@/types/property'

const MediaExperience = dynamic(
  () => import('@/components/experience/media-experience').then((module) => module.MediaExperience),
  {
    ssr: false,
    loading: () => (
      <div className="mt-5 flex min-h-[360px] items-center justify-center rounded-panel border border-line bg-stone text-sm font-semibold text-ink/45">
        Preparing the interactive experience…
      </div>
    ),
  },
)

export function LazyMediaExperience({ property }: { property: Property }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {ready ? (
        <MediaExperience property={property} />
      ) : (
        <div className="mt-5 flex min-h-[360px] items-center justify-center rounded-panel border border-line bg-stone text-sm font-semibold text-ink/45">
          Scroll closer to enter the experience
        </div>
      )}
    </div>
  )
}
