import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = { title: 'Admin overview', robots: { index: false, follow: false } }

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  )
}
