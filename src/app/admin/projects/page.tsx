import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminProjectsPage } from '@/components/admin/admin-workspace'

export const metadata = { title: 'Project management', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminProjectsPage />
    </AdminShell>
  )
}
