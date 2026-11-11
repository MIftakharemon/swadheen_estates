'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { bn, en, type CopyKey } from '@/i18n/dictionaries'

export type Locale = 'en' | 'bn'

const dictionaries = { en, bn }

type LocaleVars = Record<string, string | number>

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: CopyKey, vars?: LocaleVars) => string
}

function interpolate(template: string, vars?: LocaleVars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}
const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'swadheen-locale'

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Bengali is the primary language of the site; picking up a stored visitor choice is secondary.
  const [locale, setLocaleState] = useState<Locale>('bn')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    window.requestAnimationFrame(() => {
      if (stored === 'en' || stored === 'bn') setLocaleState(stored)
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.locale = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next)
        window.localStorage.setItem(STORAGE_KEY, next)
      },
      t: (key, vars) => interpolate(dictionaries[locale][key] ?? en[key] ?? key, vars),
    }),
    [locale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used within LocaleProvider')
  return context
}
