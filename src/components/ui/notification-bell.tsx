'use client'

import { Bell, CheckCheck, Inbox } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-provider'

type NotificationItem = {
  id: string
  type: string
  title: string
  body?: string | null
  link?: string | null
  meta?: Record<string, string | null> | null
  read: boolean
  createdAt: string
}

// Shared bell for the admin panel and the customer portal. Clicking it opens the
// notification list, shows the unread count and lets the reader clear the badge.
export function NotificationBell({
  scope,
  tone = 'plain',
  className,
}: {
  scope: 'admin' | 'user'
  tone?: 'plain' | 'stone'
  className?: string
}) {
  const { t, locale } = useLocale()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/notifications?scope=${scope}`)
      if (!response.ok) throw new Error('notifications_unavailable')
      const data = (await response.json()) as { notifications?: NotificationItem[]; unread?: number }
      setItems(data.notifications ?? [])
      setUnread(data.unread ?? 0)
      setFailed(false)
    } catch {
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [scope])

  useEffect(() => {
    // Loads the unread badge on mount; `load` is async, so state settles after paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function toggleOpen() {
    const next = !open
    setOpen(next)
    if (next) {
      setLoading(true)
      await load()
    }
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      })
    } catch {
      // The visual state still clears locally; the server state catches up next load.
    }
    setItems((current) => current.map((item) => ({ ...item, read: true })))
    setUnread(0)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => void toggleOpen()}
        aria-label={t('notifications')}
        aria-expanded={open}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone',
          tone === 'stone' && 'bg-stone',
        )}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="pointer-events-none absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full border-2 border-paper bg-terracotta px-0.5 text-[8px] font-extrabold leading-none text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper shadow-float">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/45">
              {t('notifications')}
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="flex items-center gap-1 text-[10px] font-bold text-terracotta transition hover:text-terracotta-deep"
              >
                <CheckCheck className="h-3 w-3" /> {t('notif.markAllRead')}
              </button>
            )}
          </div>
          <ul className="max-h-[22rem] divide-y divide-line overflow-y-auto">
            {items.length === 0 && (
              <li className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                <Inbox className="h-5 w-5 text-ink/25" />
                <p className="text-xs font-semibold text-ink/45">
                  {loading ? t('notif.loading') : failed ? t('notif.failed') : t('notif.empty')}
                </p>
              </li>
            )}
            {items.map((item) => {
              const meta = item.meta ?? {}
              const label =
                item.type === 'VIEWING_REQUEST'
                  ? t('notif.viewingRequest')
                  : item.type === 'NEW_ACCOUNT'
                    ? t('notif.newAccount')
                    : t('notifications')
              const detail = [item.body, meta.property].find(Boolean) ?? null
              const contact = [meta.phone, meta.email].filter(Boolean).join(' · ') || null
              const content = (
                <div className="flex gap-2.5">
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      item.read ? 'bg-transparent' : 'bg-terracotta',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[.12em] text-terracotta">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-ink">{item.title}</p>
                    {detail && <p className="mt-1 truncate text-[11px] text-ink/55">{detail}</p>}
                    {contact && (
                      <p className="mt-1 truncate text-[10px] text-ink/45">{contact}</p>
                    )}
                    <p className="mt-1.5 text-[10px] font-semibold text-ink/40">
                      {formatDateTime(item.createdAt, locale)}
                    </p>
                  </div>
                </div>
              )
              return (
                <li key={item.id}>
                  {item.link ? (
                    <Link
                      href={item.link}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block px-4 py-3 transition hover:bg-stone/70',
                        !item.read && 'bg-terracotta/5',
                      )}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className={cn('px-4 py-3', !item.read && 'bg-terracotta/5')}>
                      {content}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
