import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/content/marketing-pages'

export function generateStaticParams() {
  return [{ slug: 'the-grove-bashundhara' }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return {
    title: slug === 'the-grove-bashundhara' ? 'The Grove, Bashundhara' : 'Project',
    description: 'A quieter kind of city life.',
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectsPage slug={slug} />
}
