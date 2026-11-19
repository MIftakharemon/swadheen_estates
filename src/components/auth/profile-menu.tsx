'use client'

import Link from 'next/link'
import { CircleUserRound, LayoutDashboard, LogOut, Shapes } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/i18n/locale-provider'

const STAFF_ROLES = ['SUPER_ADMIN', 'MANAGER', 'SALES_AGENT', 'CONTENT_EDITOR']

function initialsOf(name: string | null | undefined, email: string | null | undefined) {
  const source = (name ?? email ?? '?').trim()
  return (
    source
      .split(/\s+/)
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  )
}

// The header's account entry: anonymous visitors get sign-in / create-account
// links, signed-in users get their space, admin panel (staff) and sign out.
export function ProfileMenu({ overlay = false }: { overlay?: boolean }) {
  const { t } = useLocale()
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const user = session?.user
  const signedIn = status === 'authenticated' && Boolean(user)
  const nextParam = encodeURIComponent(pathname || '/')
  const isStaff = Boolean(user?.role && STAFF_ROLES.includes(user.role))

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

  async function handleSignOut() {
    setOpen(false)
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t('profile.menu')}
        aria-expanded={open}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full transition',
          overlay ? 'hover:bg-white/10' : 'hover:bg-stone',
        )}
      >
        {signedIn && user ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta text-[10px] font-extrabold leading-none text-white">
            {initialsOf(user.name, user.email)}
          </span>
        ) : (
          <CircleUserRound className="h-4 w-4" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper text-ink shadow-float">
          {signedIn && user ? (
            <>
              <div className="border-b border-line px-4 py-3">
                <p className="truncate text-xs font-extrabold">{user.name ?? user.email}</p>
                {user.email && <p className="mt-0.5 truncate text-[10px] text-ink/50">{user.email}</p>}
              </div>
              <nav className="p-1.5">
                <Link
                  href="/portal"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition hover:bg-stone"
                >
                  <Shapes className="h-3.5 w-3.5 text-terracotta" /> {t('profile.mySpace')}
                </Link>
                {isStaff && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition hover:bg-stone"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-terracotta" /> {t('profile.adminPanel')}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition hover:bg-stone"
                >
                  <LogOut className="h-3.5 w-3.5 text-ink/45" /> {t('profile.signOut')}
                </button>
              </nav>
            </>
          ) : (
            <>
              <div className="border-b border-line px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-ink/45">
                  {t('profile.menu')}
                </p>
              </div>
              <div className="space-y-1.5 p-3">
                <Link
                  href={`/login?next=${nextParam}`}
                  onClick={() => setOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl border border-line text-xs font-extrabold transition hover:border-terracotta hover:text-terracotta"
                >
                  {t('profile.signIn')}
                </Link>
                <Link
                  href={`/register?next=${nextParam}`}
                  onClick={() => setOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl bg-terracotta text-xs font-extrabold text-white transition hover:bg-terracotta-deep"
                >
                  {t('profile.createAccount')}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
