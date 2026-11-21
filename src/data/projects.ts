import type { Project } from '@/types/project'

// The static project catalogue — the fallback when no database is configured
// (and the seed mirror for the Projects section).
export const staticProjects: Project[] = [
  {
    id: 'static-grove',
    slug: 'the-grove-bashundhara',
    name: 'The Grove, Bashundhara',
    location: 'Bashundhara R/A, Dhaka',
    description: 'A low-density address shaped around shade, light and everyday rituals.',
    coverImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=88',
    totalUnits: 48,
    deliveredAt: null,
  },
]

export function getStaticProjectBySlug(slug: string): Project | undefined {
  return staticProjects.find((project) => project.slug === slug)
}
