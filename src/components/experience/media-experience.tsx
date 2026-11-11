'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  Compass,
  Expand,
  Eye,
  Gauge,
  Headphones,
  Layers3,
  MapPin,
  Maximize2,
  Moon,
  Move3D,
  RotateCcw,
  Ruler,
  Sun,
  Volume2,
  WifiOff,
} from 'lucide-react'
import { useState } from 'react'
import type { Property } from '@/types/property'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InteractiveSiteMap } from '@/components/experience/interactive-site-map'

const HouseModelCanvas = dynamic(
  () => import('@/components/experience/interactive-canvas').then((module) => module.HouseModelCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs font-bold text-ink/45">
        Loading interactive model…
      </div>
    ),
  },
)
const TourCanvas = dynamic(
  () => import('@/components/experience/interactive-canvas').then((module) => module.TourCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs font-bold text-white/60">
        Loading panorama…
      </div>
    ),
  },
)

type ExperienceTab = 'Photos' | '360° tour' | '3D model' | 'Floor plan' | 'Map'

function Control({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex h-10 items-center gap-2 rounded-full border border-white/15 bg-ink/45 px-3 text-[10px] font-bold uppercase tracking-[.11em] text-white backdrop-blur-md transition hover:bg-ink/75',
        active && 'border-gold bg-gold text-ink',
      )}
    >
      {children}
    </button>
  )
}

function TourPanel({ property }: { property: Property }) {
  const [room, setRoom] = useState('Living room')
  const rooms = ['Living room', 'Kitchen', 'Primary suite', 'Terrace']
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-panel bg-ink sm:min-h-[540px]">
      <div className="absolute inset-0">
        <TourCanvas panoramaUrl={property.gallery[1] ?? property.image} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0,rgba(15,20,24,.18)_30%,rgba(15,20,24,.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between">
        <Badge tone="dark" icon={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />}>
          Live panorama · {room}
        </Badge>
        <div className="flex gap-2">
          <div className="pointer-events-auto flex gap-2">
            <Control label="Audio on">
              <Volume2 className="h-3.5 w-3.5" />
            </Control>
            <Control label="Fullscreen">
              <Expand className="h-3.5 w-3.5" />
            </Control>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute left-[52%] top-[38%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="flex h-12 w-12 animate-pulse-ring items-center justify-center rounded-full border-2 border-gold bg-gold/20 text-white">
          <Eye className="h-5 w-5" />
        </span>
        <span className="mt-2 rounded-full bg-ink/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
          You are here
        </span>
      </div>
      <button
        type="button"
        className="pointer-events-auto absolute left-[27%] top-[47%] h-9 w-9 rounded-full border-2 border-white bg-terracotta text-white shadow-float transition hover:scale-110"
        aria-label="Open kitchen hotspot"
        onClick={() => setRoom('Kitchen')}
      >
        ↗
      </button>
      <button
        type="button"
        className="pointer-events-auto absolute right-[24%] top-[33%] h-9 w-9 rounded-full border-2 border-white bg-terracotta text-white shadow-float transition hover:scale-110"
        aria-label="Open primary suite hotspot"
        onClick={() => setRoom('Primary suite')}
      >
        ↗
      </button>
      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="hidden rounded-xl border border-white/15 bg-ink/55 p-3 backdrop-blur-md sm:block">
          <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-white/10 bg-white/10">
            <div className="absolute left-1/2 top-1/2 h-10 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] border border-gold/70" />
            <div className="absolute left-[46%] top-[48%] h-2 w-2 rounded-full bg-gold" />
            <span className="absolute bottom-1 left-2 text-[8px] font-bold uppercase tracking-[.12em] text-white/50">
              Floor plan · L1
            </span>
          </div>
        </div>
        <div className="pointer-events-auto flex min-w-0 gap-1.5 overflow-x-auto rounded-xl border border-white/15 bg-ink/55 p-1.5 backdrop-blur-md">
          {rooms.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRoom(item)}
              className={cn(
                'whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-bold text-white/55 transition hover:text-white',
                item === room && 'bg-white/15 text-white',
              )}
            >
              {item}
            </button>
          ))}
          <Control label="Gyroscope">
            <Compass className="h-3.5 w-3.5" />
          </Control>
          <Control label="VR mode">
            <Headphones className="h-3.5 w-3.5" />
          </Control>
        </div>
      </div>
    </div>
  )
}

function ModelPanel({ property }: { property: Property }) {
  const [mode, setMode] = useState<'furnished' | 'empty'>('furnished')
  const [lighting, setLighting] = useState<'day' | 'night'>('day')
  const [cutaway, setCutaway] = useState(false)
  return (
    <div
      className={cn(
        'relative min-h-[460px] overflow-hidden rounded-panel border border-line p-4 transition sm:min-h-[540px] sm:p-5',
        lighting === 'night' ? 'bg-[#17202b]' : 'bg-[#dfe3df]',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 transition duration-500',
          lighting === 'night' && 'brightness-[.55] contrast-125',
        )}
      >
        <HouseModelCanvas />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(46,57,63,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(46,57,63,.12)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition',
          cutaway &&
            'bg-[linear-gradient(125deg,transparent_38%,hsl(var(--terracotta)/.12)_39%,transparent_60%)]',
        )}
      />
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between">
        <Badge tone="neutral" icon={<Move3D className="h-3 w-3" />}>
          Interactive model · {property.title}
        </Badge>
        <span className="pointer-events-auto">
          <Control label="Fullscreen">
            <Maximize2 className="h-3.5 w-3.5" />
          </Control>
        </span>
      </div>
      <div className="absolute left-1/2 top-8 hidden -translate-x-1/2 rounded-full bg-ink/70 px-3 py-2 text-[10px] font-semibold text-white/80 backdrop-blur sm:block">
        Drag to rotate · pinch to zoom
      </div>
      <div className="pointer-events-auto absolute bottom-5 left-5 right-5 flex flex-col gap-3 rounded-panel border border-ink/10 bg-paper/80 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setMode('furnished')}
            className={cn(
              'rounded-full px-3 py-2 text-[10px] font-bold',
              mode === 'furnished' ? 'bg-ink text-paper' : 'text-ink/55',
            )}
          >
            Furnished
          </button>
          <button
            type="button"
            onClick={() => setMode('empty')}
            className={cn(
              'rounded-full px-3 py-2 text-[10px] font-bold',
              mode === 'empty' ? 'bg-ink text-paper' : 'text-ink/55',
            )}
          >
            Unfurnished
          </button>
          <button
            type="button"
            onClick={() => setCutaway(!cutaway)}
            className={cn(
              'rounded-full px-3 py-2 text-[10px] font-bold',
              cutaway ? 'bg-terracotta text-white' : 'text-ink/55',
            )}
          >
            <Layers3 className="mr-1 inline h-3 w-3" />
            Cutaway
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setLighting('day')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              lighting === 'day' ? 'bg-gold text-ink' : 'text-ink/45',
            )}
            aria-label="Day lighting"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setLighting('night')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              lighting === 'night' ? 'bg-ink text-paper' : 'text-ink/45',
            )}
            aria-label="Night lighting"
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-terracotta px-3 text-[10px] font-bold text-white"
          >
            <Move3D className="h-3.5 w-3.5" /> View in AR
          </button>
        </div>
      </div>
    </div>
  )
}

function FloorPlanPanel() {
  const [selected, setSelected] = useState('Living / dining')
  const rooms = [
    { name: 'Living / dining', area: '31.2 m²', className: 'col-span-7 row-span-5 bg-[#d2b996]' },
    { name: 'Kitchen', area: '12.4 m²', className: 'col-span-5 row-span-3 bg-[#bdc9ba]' },
    { name: 'Primary suite', area: '18.8 m²', className: 'col-span-5 row-span-4 bg-[#d9b4a6]' },
    { name: 'Bedroom 02', area: '13.2 m²', className: 'col-span-3 row-span-4 bg-[#c6c7d2]' },
    { name: 'Study', area: '9.8 m²', className: 'col-span-4 row-span-4 bg-[#d7cf9e]' },
  ]
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-panel border border-line bg-stone p-4 sm:min-h-[540px] sm:p-5">
      <div className="flex items-center justify-between">
        <Badge tone="neutral" icon={<Ruler className="h-3 w-3" />}>
          Level 03 · 2,180 sq ft
        </Badge>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-ink/50">
          <Compass className="h-4 w-4" /> North
        </div>
      </div>
      <div className="mx-auto mt-12 grid h-[330px] max-w-xl grid-cols-12 grid-rows-12 gap-1.5 rounded-sm border-4 border-ink/35 bg-paper p-2 shadow-soft">
        {rooms.map((room) => (
          <button
            key={room.name}
            type="button"
            onClick={() => setSelected(room.name)}
            className={cn(
              'relative overflow-hidden border border-ink/10 p-2 text-left transition hover:brightness-105',
              room.className,
              selected === room.name && 'z-10 ring-2 ring-terracotta ring-offset-2 ring-offset-stone',
            )}
          >
            <span className="block text-[9px] font-extrabold uppercase leading-3 tracking-[.06em] text-ink/75">
              {room.name}
            </span>
            <span className="mt-1 block text-[9px] text-ink/55">{room.area}</span>
          </button>
        ))}
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-line bg-paper/80 p-3 backdrop-blur">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-terracotta">Selected room</p>
          <p className="mt-1 text-sm font-bold">{selected}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[10px] font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Isometric
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-3 text-[10px] font-bold text-paper"
          >
            <Move3D className="h-3.5 w-3.5" /> Walkthrough
          </button>
        </div>
      </div>
    </div>
  )
}

function MapPanel({ property }: { property: Property }) {
  return <InteractiveSiteMap property={property} />
}

export function MediaExperience({ property }: { property: Property }) {
  const [tab, setTab] = useState<ExperienceTab>('Photos')
  const tabs: ExperienceTab[] = ['Photos', '360° tour', '3D model', 'Floor plan', 'Map']
  return (
    <section id="experience" className="mt-14 scroll-mt-24">
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-line px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              'relative shrink-0 whitespace-nowrap rounded-t-xl px-3 py-3 text-xs font-bold transition sm:px-5',
              tab === item ? 'text-terracotta' : 'text-ink/45 hover:text-ink',
            )}
          >
            {item}
            {tab === item && (
              <span className="absolute inset-x-3 -bottom-[5px] h-0.5 bg-terracotta sm:inset-x-5" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === 'Photos' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="image-frame aspect-[4/3] rounded-panel sm:row-span-2 sm:aspect-auto">
              <Image
                src={property.gallery[0] ?? property.image}
                alt={property.title}
                fill
                sizes="(max-width: 640px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="image-frame aspect-[4/3] rounded-panel">
              <Image
                src={property.gallery[1] ?? property.image}
                alt={`${property.title} interior`}
                fill
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="image-frame aspect-[4/3] rounded-panel">
              <Image
                src={property.gallery[2] ?? property.image}
                alt={`${property.title} kitchen`}
                fill
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        {tab === '360° tour' && <TourPanel property={property} />}
        {tab === '3D model' && <ModelPanel property={property} />}
        {tab === 'Floor plan' && <FloorPlanPanel />}
        {tab === 'Map' && <MapPanel property={property} />}
      </div>
    </section>
  )
}

export function ExperienceFallback({ kind = '3D tour' }: { kind?: string }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-panel border border-line bg-stone text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-terracotta shadow-soft">
        <WifiOff className="h-5 w-5" />
      </div>
      <h3 className="display-type mt-5 text-3xl">This {kind} is taking a breath.</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink/55">
        We always keep a still image and floor plan available while an interactive surface loads.
      </p>
      <Button variant="outline" className="mt-5">
        <Gauge className="h-4 w-4" /> Use poster view
      </Button>
    </div>
  )
}
