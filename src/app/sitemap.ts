import type { MetadataRoute } from 'next'

// Domínio oficial .com.br (decisão do Leo, 11/10/2026). O .com serve as mesmas
// páginas; cada uma declara canonical no .com.br.
const BASE_URL = 'https://www.logcodex.com.br'

// Apenas rotas indexáveis. A landing de campanha /lancamento é noindex
// (Decision 018) e deliberadamente NÃO entra no sitemap. A /fleet deixou de ser
// oficial (reposicionamento 2026-08): saiu do sitemap e ganhou noindex própria
// (ver fleet/page.tsx) — segue viva por link direto, fora da busca.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home geral: sistemas sob medida (10/2026).
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    // Página de logística (era a home até 10/2026).
    { url: `${BASE_URL}/logistica`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // Página de pousadas.
    { url: `${BASE_URL}/hospedagem`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
