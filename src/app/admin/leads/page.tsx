import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminLeadsPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Lead pipeline', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminLeadsPage />
    </AdminShell>
  )
}
