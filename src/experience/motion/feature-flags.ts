export const motionFeatureFlags = {
  cinematicMotion: process.env.NEXT_PUBLIC_ENABLE_CINEMATIC_MOTION !== 'false',
  heroJourney: process.env.NEXT_PUBLIC_ENABLE_HERO_JOURNEY !== 'false',
  propertyCarousel: process.env.NEXT_PUBLIC_ENABLE_PROPERTY_CAROUSEL !== 'false',
  videoShowcase: process.env.NEXT_PUBLIC_ENABLE_VIDEO_SHOWCASE !== 'false',
  threeExperience: process.env.NEXT_PUBLIC_ENABLE_3D_EXPERIENCE !== 'false',
} as const
