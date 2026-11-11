import { AdminShell } from '@/components/admin/admin-shell'
import { AdminDashboardSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AdminShell>
      <AdminDashboardSkeleton />
    </AdminShell>
  )
}
