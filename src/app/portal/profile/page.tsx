import type { Metadata } from 'next'
import { ProfileForm } from '@/components/portal/profile-form'

export const metadata: Metadata = { title: 'Personal information', robots: { index: false, follow: false } }

// The member's own personal information. The portal layout already requires
// a signed-in session, so customers and staff reach the same form.
export default function PortalProfilePage() {
  return (
    <div className="min-h-screen bg-stone/45">
      <main className="container-shell py-10 sm:py-16">
        <ProfileForm />
      </main>
    </div>
  )
}
