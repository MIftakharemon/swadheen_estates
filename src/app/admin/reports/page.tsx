import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminReportsPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Reports', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminReportsPage />
    </AdminShell>
  )
}
