'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useToast } from '@/components/providers/toast-provider'
import { useLocale } from '@/i18n/locale-provider'

const EMPTY: Record<string, true> = {}

export type WishlistPropertyRef = { slug: string }

type WishlistContextValue = {
  ready: boolean
  isSaved: (slug: string) => boolean
  toggleSaved: (property: WishlistPropertyRef) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

// Wishlist state for the whole app. Saving requires an account: anonymous
// visitors get a toast with a sign-in link instead of a silent failure.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const { toast } = useToast()
  const { t } = useLocale()
  const pathname = usePathname()
  const [saved, setSaved] = useState<Record<string, true>>({})

  const authenticated = status === 'authenticated'
  const activeSaved = authenticated ? saved : EMPTY

  useEffect(() => {
    if (status !== 'authenticated') return
    let cancelled = false
    async function load() {
      try {
        const response = await fetch('/api/wishlist')
        if (!response.ok) throw new Error('wishlist_unavailable')
        const data = (await response.json()) as { slugs?: string[] }
        if (cancelled) return
        const next: Record<string, true> = {}
        for (const slug of data.slugs ?? []) next[slug] = true
        setSaved(next)
      } catch {
        // Reads as "nothing saved" — a failed toggle surfaces its own toast.
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [status])

  const promptSignIn = useCallback(() => {
    toast({
      title: t('toast.loginRequiredTitle'),
      description: t('toast.loginRequiredBody'),
      action: { label: t('profile.signIn'), href: `/login?next=${encodeURIComponent(pathname)}` },
    })
  }, [pathname, t, toast])

  const applySaved = useCallback((slug: string, value: boolean) => {
    setSaved((current) => {
      const next = { ...current }
      if (value) next[slug] = true
      else delete next[slug]
      return next
    })
  }, [])

  const toggleSaved = useCallback(
    (property: WishlistPropertyRef) => {
      if (status === 'loading') return
      if (status !== 'authenticated') {
        promptSignIn()
        return
      }
      const willSave = !activeSaved[property.slug]
      applySaved(property.slug, willSave)
      void (async () => {
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: property.slug }),
          })
          if (response.status === 401) {
            applySaved(property.slug, !willSave)
            promptSignIn()
            return
          }
          if (!response.ok) throw new Error('wishlist_toggle_failed')
          const data = (await response.json()) as { saved?: boolean }
          applySaved(property.slug, Boolean(data.saved))
        } catch {
          applySaved(property.slug, !willSave)
          toast({
            title: t('toast.saveFailedTitle'),
            description: t('toast.saveFailedBody'),
            tone: 'error',
          })
        }
      })()
    },
    [status, activeSaved, applySaved, promptSignIn, toast, t],
  )

  const value = useMemo<WishlistContextValue>(
    () => ({
      ready: authenticated,
      isSaved: (slug: string) => Boolean(activeSaved[slug]),
      toggleSaved,
    }),
    [authenticated, activeSaved, toggleSaved],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
