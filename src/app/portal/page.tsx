import type { Metadata } from 'next'
import { PortalDashboard } from '@/components/portal/portal-dashboard'

export const metadata: Metadata = { title: 'My space', robots: { index: false, follow: false } }

export default function PortalPage() {
  return <PortalDashboard />
}
