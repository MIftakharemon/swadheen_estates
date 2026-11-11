'use client'

import Link from 'next/link'
import {
  Bell,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  Command,
  Images,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  Search,
  Settings2,
  Sun,
  Users,
  Video,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { adminNavigation } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'
import { useTheme } from '@/components/providers/theme-provider'
import { useLocale } from '@/i18n/locale-provider'

const icons = { LayoutDashboard, Building2, Users, CalendarDays, Images, ChartNoAxesCombined, Video }

const adminLabels: Record<string, string> = {
  Overview: 'admin.overview',
  Properties: 'admin.properties',
  Leads: 'admin.leads',
  Visits: 'admin.visits',
  'Media library': 'admin.mediaLibrary',
  'Project videos': 'admin.projectVideos',
  Reports: 'admin.reports',
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocale()
  return (
    <div className="min-h-screen bg-stone/45 text-ink">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-line bg-paper transition-transform duration-300 lg:translate-x-0',
          collapsed && 'lg:w-[78px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-line px-5">
          {!collapsed && <Logo />}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone lg:hidden"
            aria-label={t('a11y.closeSidebar')}
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-stone lg:flex"
            aria-label={collapsed ? t('a11y.expandSidebar') : t('a11y.collapseSidebar')}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 px-3 py-6">
          <p
            className={cn(
              'px-3 text-[9px] font-bold uppercase tracking-[.2em] text-ink/35',
              collapsed && 'text-center',
            )}
          >
            {collapsed ? 'SE' : t('admin.workspace')}
          </p>
          <nav className="mt-3 space-y-1">
            {adminNavigation.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons]
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-ink/55 transition hover:bg-stone hover:text-ink',
                    item.href === '/admin' && 'bg-terracotta/10 text-terracotta',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <Icon className="h-[17px] w-[17px] shrink-0" />
                  {!collapsed && (
                    <>
                      {t(adminLabels[item.label] as never)}
                      {item.label === 'Leads' && (
                        <span className="ml-auto rounded-full bg-terracotta px-2 py-0.5 text-[9px] text-white">
                          12
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="mt-9 border-t border-line pt-6">
            <p
              className={cn(
                'px-3 text-[9px] font-bold uppercase tracking-[.2em] text-ink/35',
                collapsed && 'text-center',
              )}
            >
              {collapsed ? '••' : t('admin.manage')}
            </p>
            <Link
              href="/admin/settings"
              className={cn(
                'mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-ink/55 transition hover:bg-stone hover:text-ink',
                collapsed && 'justify-center px-0',
              )}
            >
              <Settings2 className="h-[17px] w-[17px]" />
              {!collapsed && t('admin.settings')}
            </Link>
          </div>
        </div>
        <div className="border-t border-line p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-stone p-3',
              collapsed && 'justify-center p-2',
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-extrabold text-white">
              AR
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">Ayesha Rahman</p>
                <p className="mt-0.5 text-[10px] text-ink/45">{t('admin.manager')}</p>
              </div>
            )}
            {!collapsed && <ChevronDown className="ml-auto h-3.5 w-3.5 text-ink/35" />}
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label={t('a11y.closeNavOverlay')}
        />
      )}
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-300 lg:pl-[252px]',
          collapsed && 'lg:pl-[78px]',
        )}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-line bg-paper/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-stone lg:hidden"
              aria-label={t('a11y.openSidebar')}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 text-xs font-semibold text-ink/45 sm:flex">
              <span>{t('admin.workspace')}</span>
              <span>/</span>
              <span className="text-ink">{t('admin.overview')}</span>
            </div>
            <label className="hidden h-10 items-center gap-2 rounded-full border border-line bg-stone/50 px-3 sm:flex">
              <Search className="h-3.5 w-3.5 text-ink/35" />
              <input
                placeholder={t('admin.searchAnything')}
                className="w-44 bg-transparent text-xs font-semibold outline-none placeholder:text-ink/35"
              />
              <kbd className="rounded bg-paper px-1.5 py-0.5 text-[9px] text-ink/35">
                <Command className="inline h-2.5 w-2.5" /> K
              </kbd>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone"
              aria-label={t('a11y.quickAdd')}
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone"
              aria-label={t('notifications')}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-terracotta" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone"
              aria-label={theme === 'light' ? t('a11y.switchToDark') : t('a11y.switchToLight')}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="ml-1 hidden h-9 w-px bg-line sm:block" />
            <div className="hidden items-center gap-2 pl-2 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-[10px] font-extrabold text-white">
                AR
              </span>
              <span className="text-xs font-bold">Ayesha</span>
            </div>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
