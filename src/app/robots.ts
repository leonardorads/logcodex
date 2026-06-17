import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.logcodex.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /lancamento é página de campanha (noindex via metadata da própria
      // rota — Decision 018). O Disallow aqui reforça que não deve ser rastreada.
      disallow: '/lancamento',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
