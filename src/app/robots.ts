import type { MetadataRoute } from 'next'

// Domínio oficial .com.br (decisão do Leo, 11/10/2026).
const BASE_URL = 'https://www.logcodex.com.br'

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
        userAgent: 'facebookexternalhit',
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
