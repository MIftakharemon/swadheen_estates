import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminMediaPage } from '@/components/admin/admin-workspace'

export const metadata: Metadata = { title: 'Media library', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminMediaPage />
    </AdminShell>
  )
}
