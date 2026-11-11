import { HomePage } from '@/components/home/home-page'
import { JsonLd } from '@/components/seo/json-ld'
import { env } from '@/lib/env'

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Swadheen Estates',
          url: env.NEXT_PUBLIC_SITE_URL,
          description: 'Thoughtfully selected land, houses and apartments across Dhaka.',
        }}
      />
      <HomePage />
    </>
  )
}
