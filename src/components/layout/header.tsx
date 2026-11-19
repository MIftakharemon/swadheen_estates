'use client'

import Link from 'next/link'
import { ArrowUpRight, Heart, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { publicNavigation } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button'
import { Logo } from '@/components/layout/logo'
import { useTheme } from '@/components/providers/theme-provider'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { ProfileMenu } from '@/components/auth/profile-menu'
import { useLocale } from '@/i18n/locale-provider'

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const { t } = useLocale()
  const labels: Record<string, string> = {
    Home: t('home'),
    Properties: t('properties'),
    Projects: t('projects'),
    'Our approach': t('approach'),
    Journal: t('journal'),
  }
  return (
    <header
      className={cn(
        'z-50 w-full',
        overlay
          ? 'absolute left-0 top-0 text-white'
          : 'relative border-b border-line bg-paper/95 backdrop-blur-xl',
      )}
    >
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Logo inverse={overlay} />
        <nav className={cn('hidden items-center gap-7 lg:flex', overlay ? 'text-white/75' : 'text-ink/65')}>
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-xs font-semibold transition hover:text-terracotta',
                (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) &&
                  (overlay ? 'text-gold' : 'text-terracotta'),
              )}
            >
              {labels[item.label] ?? item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/properties"
            className={cn(
              'hidden h-10 w-10 items-center justify-center rounded-full transition sm:inline-flex',
              overlay ? 'hover:bg-white/10' : 'hover:bg-stone',
            )}
            aria-label={t('a11y.searchProperties')}
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/portal"
            className={cn(
              'hidden h-10 w-10 items-center justify-center rounded-full transition sm:inline-flex',
              overlay ? 'hover:bg-white/10' : 'hover:bg-stone',
            )}
            aria-label={t('a11y.savedProperties')}
          >
            <Heart className="h-4 w-4" />
          </Link>
          <button
            onClick={toggleTheme}
            className={cn(
              'hidden h-10 w-10 items-center justify-center rounded-full transition sm:inline-flex',
              overlay ? 'hover:bg-white/10' : 'hover:bg-stone',
            )}
            aria-label={theme === 'light' ? t('a11y.switchToDark') : t('a11y.switchToLight')}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <ProfileMenu overlay={overlay} />
          <LanguageToggle overlay={overlay} />
          <ButtonLink
            href="/properties"
            size="sm"
            variant={overlay ? 'dark' : 'secondary'}
            className="hidden sm:inline-flex"
          >
            {t('nav.exploreHomes')} <ArrowUpRight className="h-3.5 w-3.5" />
          </ButtonLink>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden',
              overlay ? 'bg-white/10' : 'bg-stone',
            )}
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div
          className={cn(
            'border-t px-5 pb-7 pt-5 lg:hidden',
            overlay ? 'border-white/15 bg-ink/95' : 'border-line bg-paper',
          )}
        >
          <nav className="flex flex-col gap-1">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                onClick={() => setOpen(false)}
                href={item.href}
                className={cn(
                  'rounded-xl px-3 py-3 text-sm font-semibold hover:bg-stone',
                  (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) &&
                    (overlay ? 'bg-white/10 text-gold' : 'bg-stone text-terracotta'),
                )}
              >
                {labels[item.label] ?? item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/portal"
              className="rounded-xl border border-line px-3 py-3 text-center text-xs font-semibold"
            >
              {t('nav.savedHomes')}
            </Link>
            <Link
              href="/properties"
              className="rounded-xl bg-terracotta px-3 py-3 text-center text-xs font-semibold text-white"
            >
              {t('nav.browseInventory')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
