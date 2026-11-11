'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem('swadheen-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light')
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((current) => {
          const next = current === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          window.localStorage.setItem('swadheen-theme', next)
          return next
        }),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const fallbackTheme: ThemeContextValue = {
  theme: 'light',
  toggleTheme: () => undefined,
}

export function useTheme() {
  return useContext(ThemeContext) ?? fallbackTheme
}
