import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.logcodex.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/lancamento',
      },
      {
        userAgent: 'facebot',
        allow: '/lancamento',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/lancamento',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
