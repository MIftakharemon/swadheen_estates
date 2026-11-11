'use client'

import { useMotionPreferences } from '@/experience/motion/motion-provider'

export function MotionTuningPanel() {
  const { motionScale, timeScale, setMotionScale, setTimeScale } = useMotionPreferences()
  return (
    <aside className="fixed bottom-4 right-4 z-[100] hidden w-64 rounded-2xl border border-line bg-paper/95 p-4 text-ink shadow-float backdrop-blur-xl lg:block">
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-terracotta">Motion tuning · dev</p>
      <label className="mt-4 block text-xs font-semibold">
        Motion scale <span className="float-right numeric text-ink/50">{motionScale.toFixed(2)}</span>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.05"
          value={motionScale}
          onChange={(event) => setMotionScale(Number(event.target.value))}
          className="mt-2 w-full accent-terracotta"
        />
      </label>
      <label className="mt-4 block text-xs font-semibold">
        Time scale <span className="float-right numeric text-ink/50">{timeScale.toFixed(2)}</span>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.05"
          value={timeScale}
          onChange={(event) => setTimeScale(Number(event.target.value))}
          className="mt-2 w-full accent-terracotta"
        />
      </label>
    </aside>
  )
}
