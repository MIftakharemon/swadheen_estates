import { HomePage } from '@/components/home/home-page'
import { JsonLd } from '@/components/seo/json-ld'
import { properties as staticProperties } from '@/data/properties'
import { getPublishedProperties } from '@/features/listings/services/public-listings'
import { env } from '@/lib/env'

// Refresh every minute so featured listings follow the admin panel.
export const revalidate = 60

export default async function Page() {
  const listings = (await getPublishedProperties()) ?? staticProperties
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
      <HomePage properties={listings} />
    </>
  )
}
