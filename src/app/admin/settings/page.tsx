import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminSettingsPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Admin settings', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminSettingsPage />
    </AdminShell>
  )
}
