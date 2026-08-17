import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.logcodex.com'

// Apenas rotas indexáveis. A landing de campanha /lancamento é noindex
// (Decision 018) e deliberadamente NÃO entra no sitemap. A /fleet deixou de ser
// oficial (reposicionamento 2026-08): saiu do sitemap e ganhou noindex própria
// (ver fleet/page.tsx) — segue viva por link direto, fora da busca.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
