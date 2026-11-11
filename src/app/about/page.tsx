import type { Metadata } from 'next'
import { AboutPage } from '@/components/content/marketing-pages'

export const metadata: Metadata = {
  title: 'Our approach',
  description: 'A steadier, more considered way to find property in Dhaka.',
}

export default function Page() {
  return <AboutPage />
}
