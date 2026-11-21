import type { Metadata } from 'next'
import { ProjectsIndex } from '@/components/content/marketing-pages'
import { staticProjects } from '@/data/projects'
import { getPublicProjects } from '@/features/listings/services/public-listings'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Land and home projects by Swadheen Estates across Dhaka.',
}

// Refresh every minute so admin-created projects appear without a redeploy.
export const revalidate = 60

export default async function ProjectsPage() {
  const projects = (await getPublicProjects()) ?? staticProjects
  return <ProjectsIndex projects={projects} />
}
