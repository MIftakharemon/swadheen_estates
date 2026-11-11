import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminVisitsPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Visit calendar', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminVisitsPage />
    </AdminShell>
  )
}
