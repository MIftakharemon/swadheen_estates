'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motionConfig } from '@/experience/motion/motion.config'

type MotionContextValue = {
  reducedMotion: boolean
  slowMotion: boolean
  motionScale: number
  timeScale: number
  setReducedMotion: (value: boolean) => void
  setSlowMotion: (value: boolean) => void
  setMotionScale: (value: number) => void
  setTimeScale: (value: number) => void
}

const MotionContext = createContext<MotionContextValue | null>(null)

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotionState] = useState(false)
  const [slowMotion, setSlowMotionState] = useState(false)
  const [motionScale, setMotionScaleState] = useState<number>(motionConfig.defaults.motionScale)
  const [timeScale, setTimeScaleState] = useState<number>(motionConfig.defaults.timeScale)
  const [effectiveTimeScale, setEffectiveTimeScale] = useState<number>(timeScale)
  const effectiveTimeScaleRef = useRef(timeScale)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const storedReduced = window.localStorage.getItem('swadheen-reduced-motion')
    const storedSlow = window.localStorage.getItem('swadheen-slow-motion')
    const storedMotionScale = Number(window.localStorage.getItem('swadheen-motion-scale'))
    const storedTimeScale = Number(window.localStorage.getItem('swadheen-time-scale'))
    window.requestAnimationFrame(() => {
      setReducedMotionState(storedReduced ? storedReduced === 'true' : media.matches)
      setSlowMotionState(storedSlow === 'true')
      if (Number.isFinite(storedMotionScale) && storedMotionScale > 0)
        setMotionScaleState(Math.min(Math.max(storedMotionScale, 0.25), 2))
      if (Number.isFinite(storedTimeScale) && storedTimeScale > 0)
        setTimeScaleState(Math.min(Math.max(storedTimeScale, 0.25), 2))
    })
    const handleChange = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem('swadheen-reduced-motion')) setReducedMotionState(event.matches)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const target = reducedMotion ? 1 : slowMotion ? Math.min(timeScale, 0.35) : timeScale
    const startValue = effectiveTimeScaleRef.current
    const startedAt = performance.now()
    let frame = 0
    const ramp = (now: number) => {
      const progress = Math.min((now - startedAt) / 800, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = startValue + (target - startValue) * eased
      effectiveTimeScaleRef.current = next
      setEffectiveTimeScale(next)
      if (progress < 1) frame = window.requestAnimationFrame(ramp)
    }
    frame = window.requestAnimationFrame(ramp)
    return () => window.cancelAnimationFrame(frame)
  }, [reducedMotion, slowMotion, timeScale])

  useEffect(() => {
    document.documentElement.dataset.motionReduced = String(reducedMotion)
    document.documentElement.style.setProperty('--motion-scale', String(motionScale))
    document.documentElement.style.setProperty('--time-scale', String(effectiveTimeScale))
  }, [effectiveTimeScale, motionScale, reducedMotion])

  const value = useMemo<MotionContextValue>(
    () => ({
      reducedMotion,
      slowMotion,
      motionScale,
      timeScale: effectiveTimeScale,
      setReducedMotion: (value) => {
        setReducedMotionState(value)
        window.localStorage.setItem('swadheen-reduced-motion', String(value))
      },
      setSlowMotion: (value) => {
        setSlowMotionState(value)
        window.localStorage.setItem('swadheen-slow-motion', String(value))
      },
      setMotionScale: (value) => {
        const next = Math.min(Math.max(value, 0.25), 2)
        setMotionScaleState(next)
        window.localStorage.setItem('swadheen-motion-scale', String(next))
      },
      setTimeScale: (value) => {
        const next = Math.min(Math.max(value, 0.25), 2)
        setTimeScaleState(next)
        window.localStorage.setItem('swadheen-time-scale', String(next))
      },
    }),
    [effectiveTimeScale, motionScale, reducedMotion, slowMotion],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

const fallbackMotionPreferences: MotionContextValue = {
  reducedMotion: false,
  slowMotion: false,
  motionScale: motionConfig.defaults.motionScale,
  timeScale: motionConfig.defaults.timeScale,
  setReducedMotion: () => undefined,
  setSlowMotion: () => undefined,
  setMotionScale: () => undefined,
  setTimeScale: () => undefined,
}

export function useMotionPreferences() {
  return useContext(MotionContext) ?? fallbackMotionPreferences
}
