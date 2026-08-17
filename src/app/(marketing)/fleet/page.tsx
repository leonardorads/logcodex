import type { Metadata } from 'next'
import { FAQ } from './faq-data'
import { FleetLanding } from './FleetLanding'

// /fleet deixou de ser a página oficial do produto (reposicionamento da home,
// 2026-08). É uma landing de demonstração — segue viva por link direto, mas sai
// da busca: noindex + canonical para a home + fora do sitemap (ver src/app/sitemap.ts).
// A home agora carrega o Organization/JSON-LD de marca; aqui mantemos só o FAQPage,
// que continua verdadeiro para quem acessa via link direto.
// Título da ABA: só o nome do produto. Sem custo de busca aqui — esta página é
// `noindex` desde o reposicionamento, então o title não disputa ranking.
const TAB_TITLE = 'Fleet.ai'
const DESCRIPTION =
  'O Fleet é a base de controle de frota — viagens, despesas e acertos com motoristas, sem planilha — que a LogCodex já implantou em operação real. Ponto de partida para a solução personalizada da sua transportadora.'
const URL = 'https://www.logcodex.com/fleet'
const HOME_URL = 'https://www.logcodex.com'

export const metadata: Metadata = {
  title: TAB_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HOME_URL },
  robots: { index: false, follow: true },
  // Título e texto da prévia de link. Alinhados à arte do opengraph-image.tsx,
  // que mostra o assistente respondendo no WhatsApp: quem recebe o link pelo
  // WhatsApp vê a demonstração no canal em que já está.
  openGraph: {
    title: 'Fleet.ai — sua frota responde no WhatsApp',
    description:
      'Pergunte em português e receba viagens, custos e acertos na hora — sem abrir painel, sem planilha, sem app novo para a equipe. Implantado sob medida pela LogCodex.',
    url: URL,
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleet.ai — sua frota responde no WhatsApp',
    description:
      'Pergunte em português e receba viagens, custos e acertos na hora — sem abrir painel, sem planilha, sem app novo para a equipe.',
  },
}

export default function FleetLandingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FleetLanding />
    </>
  )
}
