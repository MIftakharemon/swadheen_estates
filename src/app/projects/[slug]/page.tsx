import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DbProjectPage, ProjectsPage } from '@/components/content/marketing-pages'
import { properties as staticProperties } from '@/data/properties'
import {
  getProjectProperties,
  resolvePublicProject,
} from '@/features/listings/services/public-listings'

const GROVE_SLUG = 'the-grove-bashundhara'

export function generateStaticParams() {
  return [{ slug: GROVE_SLUG }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await resolvePublicProject(slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.name,
    description: project.description,
    ...(project.coverImage ? { openGraph: { images: [project.coverImage] } } : {}),
  }
}

// Refresh every minute so admin edits to projects and their listings go live
// without a redeploy.
export const revalidate = 60

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await resolvePublicProject(slug)
  if (!project) notFound()
  const projectProperties =
    (await getProjectProperties(slug)) ??
    staticProperties.filter((item) => item.projectSlug === slug)
  // The Grove keeps its curated page; admin-created projects get the generic
  // DB-driven one.
  if (project.slug !== GROVE_SLUG) return <DbProjectPage project={project} properties={projectProperties} />
  return <ProjectsPage slug={slug} properties={projectProperties} />
}
