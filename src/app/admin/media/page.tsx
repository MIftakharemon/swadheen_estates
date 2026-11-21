import { redirect } from 'next/navigation'

// The media library section is temporarily disabled — its sidebar entry is
// commented out in src/config/navigation.ts and this route now steps aside.
// To bring it back: uncomment the nav entry and restore the original page
// (AdminShell + AdminMediaPage from '@/components/admin/admin-workspace').
export const metadata = { title: 'Media library', robots: { index: false, follow: false } }

export default function Page() {
  redirect('/admin')
}
