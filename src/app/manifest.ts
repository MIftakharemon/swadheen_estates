import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Swadheen Estates',
    short_name: 'Swadheen',
    description: 'Homes with a sense of place.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f2e9',
    theme_color: '#f6f2e9',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
