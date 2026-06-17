import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.logcodex.com'

// Apenas rotas indexáveis. A landing de campanha /lancamento é noindex
// (Decision 018) e deliberadamente NÃO entra no sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/fleet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
