'use client'

import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyStatus } from '@/types/property'
import { useLocale } from '@/i18n/locale-provider'

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'dark'

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-paper/80 text-ink ring-line',
  accent: 'bg-terracotta/10 text-terracotta ring-terracotta/20',
  success: 'bg-[hsl(var(--available)/.12)] text-[hsl(var(--available))] ring-[hsl(var(--available)/.22)]',
  warning: 'bg-[hsl(var(--booked)/.15)] text-[hsl(var(--booked))] ring-[hsl(var(--booked)/.25)]',
  danger: 'bg-[hsl(var(--sold)/.12)] text-[hsl(var(--sold))] ring-[hsl(var(--sold)/.22)]',
  dark: 'bg-moss/90 text-paper ring-white/20',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
  icon,
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
  icon?: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] ring-1 ring-inset backdrop-blur-sm',
        toneStyles[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: PropertyStatus }) {
  const { t } = useLocale()
  const config: Record<PropertyStatus, { tone: BadgeTone; key: 'available' | 'booked' | 'sold' | 'upcoming' }> = {
    Available: { tone: 'success', key: 'available' },
    Booked: { tone: 'warning', key: 'booked' },
    Sold: { tone: 'danger', key: 'sold' },
    Upcoming: { tone: 'accent', key: 'upcoming' },
  }
  const item = config[status]
  return (
    <Badge
      tone={item.tone}
      icon={<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
    >
      {t(item.key)}
    </Badge>
  )
}

export function VerifiedBadge({ dark = false }: { dark?: boolean }) {
  const { t } = useLocale()
  return (
    <Badge tone={dark ? 'dark' : 'neutral'} icon={<Check className="h-3 w-3 text-moss" strokeWidth={2.5} />}>
      {t('verified')}
    </Badge>
  )
}

export function FeatureBadge({ children }: { children?: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <Badge tone="accent" icon={<Sparkles className="h-3 w-3" />}>
      {children ?? t('featured')}
    </Badge>
  )
}
