export const motionConfig = {
  durations: {
    micro: 0.2,
    ui: 0.45,
    reveal: 1.05,
    cinematic: 1.8,
    hero: 4,
  },
  easings: {
    luxeOut: [0.16, 1, 0.3, 1] as const,
    silkInOut: [0.76, 0, 0.24, 1] as const,
    slowSettle: [0.22, 1, 0.36, 1] as const,
  },
  stagger: { lines: 0.1, cards: 0.1, letters: 0.02 },
  defaults: { motionScale: 1, timeScale: 1 },
} as const

export type MotionConfig = typeof motionConfig
