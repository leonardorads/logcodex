import type { Metadata } from 'next'
import { FAQ } from './faq-data'
import { FleetLanding } from './FleetLanding'

// /fleet é a página canônica de SEO orgânico do produto (a /lancamento é noindex
// e aponta canonical para cá — decision-018). Metadata completo: OG + Twitter +
// JSON-LD para máxima descoberta e share em redes sociais e mecanismos de busca.
const TITLE = 'LogCodex Fleet — Saiba quanto ganha em cada viagem'
const DESCRIPTION =
  'Controle de frota sem planilha. Viagens, despesas e acertos com motoristas num lugar só. Teste grátis por 7 dias, sem cartão.'
const URL = 'https://www.logcodex.com/fleet'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'controle de frota',
    'gestão de transportadora',
    'sistema para transportadora',
    'gestão de viagens',
    'custo por viagem',
    'acerto de motorista',
    'TMS para frota pequena',
    'software de logística',
  ],
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'LogCodex Fleet — Controle de frota sem planilha',
    description:
      'Transportadoras com 5 a 30 caminhões perdem em média R$1.800/mês em custos invisíveis. O Fleet fecha essa conta — automaticamente, no celular. Teste grátis por 7 dias.',
    url: URL,
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogCodex Fleet — Controle de frota sem planilha',
    description:
      'Saiba quanto sobra em cada viagem. Viagens, despesas e acertos num lugar só. 7 dias grátis, sem cartão.',
  },
}

export default function FleetLandingPage() {
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LogCodex Fleet',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: DESCRIPTION,
    url: URL,
    inLanguage: 'pt-BR',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '99.00',
        priceCurrency: 'BRL',
        description: 'Plano Starter — para frotas pequenas. Teste grátis por 7 dias, sem cartão.',
      },
      {
        '@type': 'Offer',
        name: 'Profissional',
        price: '299.00',
        priceCurrency: 'BRL',
        description: 'Plano Profissional — suporte prioritário. Teste grátis por 7 dias, sem cartão.',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'LogCodex',
      url: 'https://www.logcodex.com',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LogCodex',
    url: 'https://www.logcodex.com',
    description:
      'LogCodex desenvolve o Fleet, sistema de controle de frota para transportadoras de pequeno e médio porte.',
    areaServed: 'BR',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FleetLanding />
    </>
  )
}
