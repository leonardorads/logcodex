import type { Metadata } from 'next'
import { HomeGeral } from './_geral/HomeGeral'
import { EMAIL, FAQ } from './_geral/dados'
import './_geral/home-geral.css'

// Home geral da LogCodex: sistemas sob medida para pequenos e médios negócios
// (decisão do Leo e do Igor, 10/2026; roteiro em docs/briefing-home-geral-2026-10.md).
// A página de logística, que morava aqui, está em /logistica, sem mudança.
//
// Domínio oficial: .com.br (decisão do Leo, 11/10/2026). O .com serve a mesma
// página; o canonical consolida tudo no .com.br, como já fazia a /hospedagem.
const URL = 'https://www.logcodex.com.br'
// Título da ABA: só a marca, por decisão do Leo (mesma regra da página antiga).
// O texto descritivo vive no og:title e na description.
const TAB_TITLE = 'LogCodex'
const TITLE = 'LogCodex — Sistemas sob medida para o seu negócio'
const DESCRIPTION =
  'A LogCodex cria sistemas sob medida para pequenos e médios negócios: site, página de venda, atendimento no WhatsApp com IA, CRM e automações. Prévia grátis antes de decidir. Atendemos todo o Brasil.'

export const metadata: Metadata = {
  title: TAB_TITLE,
  description: DESCRIPTION,
  keywords: [
    'LogCodex',
    'sistemas sob medida',
    'sistema para pequenas empresas',
    'criação de sites',
    'criação de landing page',
    'CRM para pequenas empresas',
    'atendimento no WhatsApp com IA',
    'automação de WhatsApp',
    'automação de processos',
    'desenvolvimento de software sob medida',
  ],
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  // Sem `images`: o opengraph-image.tsx desta pasta preenche og:image sozinho.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

// A empresa geral. O Fleet é um produto dela, não outro nome da organização
// (a página antiga declarava "LogCodex Fleet" como alternateName).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LogCodex',
  url: URL,
  logo: `${URL}/logcodex-logo-color.png`,
  description:
    'A LogCodex cria sistemas sob medida para pequenos e médios negócios: sites, páginas de venda, atendimento no WhatsApp com IA, CRM, automações e sistemas de gestão.',
  email: EMAIL,
  areaServed: 'BR',
  knowsAbout: [
    'desenvolvimento de software sob medida',
    'criação de sites',
    'CRM',
    'automação de processos',
    'atendimento com inteligência artificial',
    'gestão de frota',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LogCodex',
  url: URL,
  inLanguage: 'pt-BR',
}

// Sem preço em nenhum item: preço é sob consulta (decisão do Leo).
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Desenvolvimento de sistemas sob medida',
  provider: { '@type': 'Organization', name: 'LogCodex', url: URL },
  areaServed: 'BR',
  description: DESCRIPTION,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'O que a LogCodex constrói',
    itemListElement: [
      'Site profissional',
      'Página de venda',
      'Atendimento no WhatsApp com IA',
      'Automações',
      'CRM',
      'Sistema sob medida',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function HomePage() {
  return (
    <>
      {[organizationJsonLd, websiteJsonLd, serviceJsonLd, faqJsonLd].map((j) => (
        <script key={j['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <HomeGeral />
    </>
  )
}
