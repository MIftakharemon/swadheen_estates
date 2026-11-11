import type { Metadata } from 'next'
import { RequestPage } from '@/components/content/marketing-pages'

export const metadata: Metadata = {
  title: 'Start a conversation',
  description: 'Tell Swadheen Estates what you are looking for.',
}

export default function Page() {
  return <RequestPage />
}
