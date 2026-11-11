import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminProjectVideoManager } from '@/components/admin/project-video-manager'

export const metadata: Metadata = { title: 'Project videos', robots: { index: false, follow: false } }

export default async function ProjectVideosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <AdminShell>
      <AdminProjectVideoManager projectSlug={slug} />
    </AdminShell>
  )
}
