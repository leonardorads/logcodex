import type { Metadata } from 'next'
import { MarketingPage } from './MarketingPage'

const URL = 'https://www.logcodex.com'
const TITLE = 'LogCodex — Logística inteligente: controle de frota com IA'
const DESCRIPTION =
  'LogCodex desenvolve sistemas SaaS que ligam tecnologia à operação logística. O Fleet — controle de frota com IA para transportadoras — é o primeiro produto. Em breve: rotas, pátio e armazém.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'LogCodex',
    'LogCodex Fleet',
    'SaaS de logística',
    'sistema de gestão de frota',
    'software de logística com IA',
    'sistema de IA para transporte',
    'gestão de transporte',
    'controle de frota',
    'TMS para transportadora',
    'tecnologia para logística',
  ],
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LogCodex — Logística inteligente com IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

// JSON-LD da marca. Diz ao Google que "LogCodex" é uma organização e que
// "LogCodex Fleet" é o mesmo negócio (alternateName) — ajuda a busca por marca.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LogCodex',
  alternateName: 'LogCodex Fleet',
  url: URL,
  logo: `${URL}/logcodex-logo-color.png`,
  description:
    'LogCodex desenvolve sistemas SaaS de logística com IA. O Fleet é um sistema de controle de frota para transportadoras de pequeno e médio porte.',
  email: 'leonardo.antunes@logcodex.com',
  areaServed: 'BR',
  knowsAbout: [
    'logística',
    'transporte rodoviário de cargas',
    'gestão de frota',
    'inteligência artificial aplicada à logística',
  ],
}

// WebSite JSON-LD: reforça o nome do site para o Google (sitelinks/branding).
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LogCodex',
  url: URL,
  inLanguage: 'pt-BR',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <MarketingPage />
    </>
  )
}
