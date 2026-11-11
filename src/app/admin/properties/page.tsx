import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminPropertiesPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Property management', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminPropertiesPage />
    </AdminShell>
  )
}
