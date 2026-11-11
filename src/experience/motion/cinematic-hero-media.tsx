'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { motionConfig } from '@/experience/motion/motion.config'
import { motionFeatureFlags } from '@/experience/motion/feature-flags'
import { useMotionPreferences } from '@/experience/motion/motion-provider'

export function CinematicHeroMedia({ src, alt }: { src: string; alt: string }) {
  const { reducedMotion, slowMotion, timeScale } = useMotionPreferences()
  const [hovered, setHovered] = useState(false)
  const enabled = motionFeatureFlags.cinematicMotion && motionFeatureFlags.heroJourney && !reducedMotion
  const duration =
    motionConfig.durations.hero / (slowMotion ? Math.max(timeScale, 0.25) : 1) / (hovered ? 0.35 : 1)

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="absolute inset-[-3%]"
        initial={enabled ? { scale: 1.04, x: 0 } : false}
        animate={enabled ? { scale: hovered ? 1.07 : 1.1, x: hovered ? '-0.5%' : '0.5%' } : { scale: 1 }}
        transition={{
          duration,
          ease: motionConfig.easings.slowSettle,
          repeat: enabled ? Infinity : 0,
          repeatType: 'reverse',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75"
        />
      </motion.div>
    </div>
  )
}
