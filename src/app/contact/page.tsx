import type { Metadata } from 'next'
import { ContactPage } from '@/components/content/marketing-pages'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the Swadheen Estates team in Dhaka.',
}

export default function Page() {
  return <ContactPage />
}
