'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { ProjectVideo } from '@/types/video'
import { SectionHeading } from '@/components/ui/section-heading'
import { Skeleton } from '@/components/ui/skeleton'

const YouTubeShowcase = dynamic(
  () => import('@/components/home/youtube-showcase').then((module) => module.YouTubeShowcase),
  {
    ssr: false,
    loading: () => (
      <section className="section-space bg-stone">
        <div className="container-shell">
          <SectionHeading
            eyebrow="From the field · YouTube"
            title="Small moments. A different feeling."
            description="A closer look at the thresholds, materials and light that make a place feel like yours."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <div className="mx-auto aspect-[9/14] w-full max-w-[350px] overflow-hidden rounded-panel">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            <div className="hidden flex-col gap-3 lg:flex">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    ),
  },
)

export function DeferredYouTubeShowcase({ videos }: { videos: ProjectVideo[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(node)
    // Fallback: never leave visitors stuck on the skeleton if the
    // observer does not fire (e.g. restored scroll position quirks).
    const fallback = window.setTimeout(() => setReady(true), 4000)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  if (ready) return <YouTubeShowcase videos={videos} />
  return (
    <div ref={sectionRef}>
      <section className="section-space bg-stone">
        <div className="container-shell">
          <SectionHeading
            eyebrow="From the field · YouTube"
            title="Small moments. A different feeling."
            description="A closer look at the thresholds, materials and light that make a place feel like yours."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <div className="mx-auto aspect-[9/14] w-full max-w-[350px] overflow-hidden rounded-panel">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            <div className="hidden flex-col gap-3 lg:flex">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
