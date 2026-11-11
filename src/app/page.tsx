import { HomePage } from '@/components/home/home-page'
import { JsonLd } from '@/components/seo/json-ld'

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Swadheen Estates',
          url: 'http://localhost:3000',
          description: 'Thoughtfully selected land, houses and apartments across Dhaka.',
        }}
      />
      <HomePage />
    </>
  )
}
