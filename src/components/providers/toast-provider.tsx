'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type ToastAction = { label: string; href: string }

export type ToastInput = {
  title: string
  description?: string
  action?: ToastAction
  tone?: 'default' | 'error'
}

type ToastItem = ToastInput & { id: number }

type ToastContextValue = {
  toast: (input: ToastInput) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 6500
const ERROR_DURATION = 9000

// Lightweight in-app toast used for transient feedback (e.g. the wishlist
// login prompt). Rendered once at the root layout.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current + 1
      nextId.current = id
      setItems((current) => [...current, { ...input, id }].slice(-3))
      window.setTimeout(() => dismiss(id), input.tone === 'error' ? ERROR_DURATION : DEFAULT_DURATION)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(22rem,calc(100vw-2rem))]"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto w-full rounded-2xl border bg-paper px-4 py-3 shadow-float',
                item.tone === 'error' ? 'border-danger/40' : 'border-line',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-ink">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-[11px] leading-5 text-ink/60">{item.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-ink/40 transition hover:bg-stone hover:text-ink"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              {item.action && (
                <Link
                  href={item.action.href}
                  onClick={() => dismiss(item.id)}
                  className="mt-2.5 inline-flex h-8 items-center rounded-full bg-terracotta px-4 text-[11px] font-extrabold text-white transition hover:bg-terracotta-deep"
                >
                  {item.action.label}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
