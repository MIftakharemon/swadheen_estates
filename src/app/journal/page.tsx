import type { Metadata } from 'next'
import { JournalPage } from '@/components/content/marketing-pages'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes on property, place and the everyday details of home.',
}

export default function Page() {
  return <JournalPage />
}
