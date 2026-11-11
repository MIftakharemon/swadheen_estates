'use client'

import { LocateFixed, MapPin, Minus, Plus, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Property } from '@/types/property'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Point = { id: string; label: string; x: number; y: number; detail: string }
const points: Point[] = [
  { id: 'home', label: 'The property', x: 54, y: 48, detail: 'Your selected address' },
  { id: 'school', label: 'International school', x: 27, y: 31, detail: '8 min by car' },
  { id: 'park', label: 'Community park', x: 73, y: 28, detail: '3 min walk' },
  { id: 'airport', label: 'Airport road', x: 78, y: 72, detail: '18 min by car' },
]

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function InteractiveSiteMap({ property }: { property: Property }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ x: 0, y: 0, scale: 1, centerX: 0, centerY: 0, distance: 0 })
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const [selected, setSelected] = useState('home')

  function clampScale(value: number) {
    return Math.min(Math.max(value, 0.8), 2.4)
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 1) {
      gesture.current = { ...view, centerX: event.clientX, centerY: event.clientY, distance: 0 }
    } else if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values())
      if (!first || !second) return
      gesture.current = {
        ...view,
        centerX: (first.x + second.x) / 2,
        centerY: (first.y + second.y) / 2,
        distance: distance(first, second),
      }
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const active = Array.from(pointers.current.values())
    if (active.length === 1) {
      const point = active[0]
      if (!point) return
      setView((current) => ({
        ...current,
        x: gesture.current.x + point.x - gesture.current.centerX,
        y: gesture.current.y + point.y - gesture.current.centerY,
      }))
    } else if (active.length >= 2) {
      const first = active[0]
      const second = active[1]
      if (!first || !second) return
      const centerX = (first.x + second.x) / 2
      const centerY = (first.y + second.y) / 2
      const nextDistance = distance(first, second)
      setView({
        x: gesture.current.x + centerX - gesture.current.centerX,
        y: gesture.current.y + centerY - gesture.current.centerY,
        scale:
          gesture.current.distance > 0
            ? clampScale(gesture.current.scale * (nextDistance / gesture.current.distance))
            : gesture.current.scale,
      })
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function zoom(factor: number) {
    setView((current) => ({ ...current, scale: clampScale(current.scale * factor) }))
  }

  function reset() {
    setView({ x: 0, y: 0, scale: 1 })
    setSelected('home')
  }

  const selectedPoint = points.find((point) => point.id === selected) ?? points[0]

  return (
    <div
      ref={viewportRef}
      className="relative min-h-[460px] touch-none select-none overflow-hidden rounded-panel border border-line bg-[#dfe3df] bg-[radial-gradient(circle_at_65%_30%,#f2efe5_0,#dfe3df_45%,#bdc8c1_100%)] cursor-grab active:cursor-grabbing sm:min-h-[540px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={(event) => {
        event.preventDefault()
        zoom(event.deltaY > 0 ? 0.9 : 1.1)
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0,rgba(255,255,255,.25)_48%,rgba(40,63,55,.18)_100%)]" />
      <div
        className="absolute left-1/2 top-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative h-full w-full transition-transform duration-100"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale}) rotateX(4deg) rotateZ(-1deg)`,
          }}
        >
          <svg viewBox="0 0 1000 700" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect width="1000" height="700" fill="#d5ded5" />
            <path
              d="M-40 170 C180 130 260 250 430 190 S720 72 1050 160"
              fill="none"
              stroke="#f8f5eb"
              strokeWidth="34"
            />
            <path
              d="M-20 520 C150 450 270 550 440 475 S760 350 1040 460"
              fill="none"
              stroke="#f8f5eb"
              strokeWidth="28"
            />
            <path
              d="M125 -20 C170 150 80 280 190 400 S380 560 330 740"
              fill="none"
              stroke="#f8f5eb"
              strokeWidth="25"
            />
            <path
              d="M700 -30 C650 110 760 260 650 390 S610 590 700 740"
              fill="none"
              stroke="#f8f5eb"
              strokeWidth="30"
            />
            <path
              d="M-20 170 C180 130 260 250 430 190 S720 72 1050 160"
              fill="none"
              stroke="#aebdaf"
              strokeWidth="2"
              strokeDasharray="10 10"
            />
            <path
              d="M-20 520 C150 450 270 550 440 475 S760 350 1040 460"
              fill="none"
              stroke="#aebdaf"
              strokeWidth="2"
              strokeDasharray="10 10"
            />
            <path
              d="M125 -20 C170 150 80 280 190 400 S380 560 330 740"
              fill="none"
              stroke="#aebdaf"
              strokeWidth="2"
              strokeDasharray="10 10"
            />
            <path
              d="M700 -30 C650 110 760 260 650 390 S610 590 700 740"
              fill="none"
              stroke="#aebdaf"
              strokeWidth="2"
              strokeDasharray="10 10"
            />
            <path d="M310 245 L565 245 L625 355 L410 390 Z" fill="#91a88e" opacity=".7" />
            <path d="M335 275 L545 270 L580 335 L425 360 Z" fill="#789375" opacity=".7" />
            <path d="M720 150 L900 120 L940 235 L760 265 Z" fill="#c6d0c2" />
            <path d="M65 300 L245 285 L285 390 L90 410 Z" fill="#c8d2c6" />
            <circle cx="150" cy="115" r="52" fill="#a7bea3" opacity=".7" />
            <circle cx="845" cy="520" r="76" fill="#9fb59c" opacity=".65" />
          </svg>
          {points.map((point) => (
            <button
              key={point.id}
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setSelected(point.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              aria-label={`Select ${point.label}`}
              aria-pressed={selected === point.id}
            >
              <span
                className={cn(
                  'block rounded-full border-4 border-paper shadow-float transition',
                  point.id === 'home' ? 'h-12 w-12 bg-terracotta' : 'h-8 w-8 bg-moss',
                  selected === point.id && 'scale-125 ring-4 ring-gold/50',
                )}
              />
              <MapPin
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white"
                fill="currentColor"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/60 bg-paper/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-ink shadow-soft">
        <MapPin className="mr-1.5 inline h-3.5 w-3.5 text-terracotta" />
        {property.location}
      </div>
      <div className="absolute right-5 top-5 flex flex-col gap-1.5 rounded-xl border border-white/50 bg-paper/90 p-1.5 shadow-soft">
        <button
          type="button"
          onClick={() => zoom(1.2)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-stone"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => zoom(0.82)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-stone"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-stone"
          aria-label="Reset map"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="rounded-xl border border-line bg-paper/90 p-3 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-terracotta">
            {selectedPoint?.label}
          </p>
          <p className="mt-1 text-sm font-bold">
            {selectedPoint?.id === 'home' ? property.title : selectedPoint?.detail}
          </p>
          <p className="mt-1 text-[10px] text-ink/45">
            {selectedPoint?.id === 'home'
              ? 'Drag to look around · pinch or wheel to zoom'
              : 'Tap another marker to explore'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">
            <LocateFixed className="mr-1 inline h-3 w-3" /> Interactive site map
          </Badge>
          <Badge tone="neutral">{Math.round(view.scale * 100)}%</Badge>
        </div>
      </div>
    </div>
  )
}
