import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminUsersPage } from '@/components/admin/users-page'

export const metadata: Metadata = { title: 'Customers', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <AdminShell>
      <AdminUsersPage />
    </AdminShell>
  )
}
