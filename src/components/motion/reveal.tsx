'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { motionConfig } from '@/experience/motion/motion.config'
import { motionFeatureFlags } from '@/experience/motion/feature-flags'
import { useMotionPreferences } from '@/experience/motion/motion-provider'

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { reducedMotion, motionScale } = useMotionPreferences()
  const enabled = motionFeatureFlags.cinematicMotion && !reducedMotion
  return (
    <motion.div
      className={className}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay, duration: motionConfig.durations.reveal * motionScale }}
      {...(enabled ? { variants: revealVariants, initial: 'hidden', whileInView: 'visible' } : {})}
    >
      {children}
    </motion.div>
  )
}

export const staggerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
export const childRevealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
