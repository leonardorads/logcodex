import type { Metadata } from 'next'
import { MarketingPage } from './MarketingPage'
import { FAQ } from './home/faq-data'

const URL = 'https://www.logcodex.com'
// Título da ABA: só a marca, por decisão do Leonardo. O texto descritivo segue
// vivo no og:title/twitter (compartilhamento em redes) e na description, que é
// o que o Google usa como resumo — a aba fica limpa sem perder o social card.
const TAB_TITLE = 'LogCodex'
const TITLE = 'LogCodex Fleet — Tecnologia e automação para operações logísticas'
const DESCRIPTION =
  'A LogCodex faz o diagnóstico da sua operação, integra com os sistemas que você já usa e implanta a solução — com capacitação do time e suporte técnico consultivo. O Fleet é um exemplo do que já colocamos em produção.'

export const metadata: Metadata = {
  title: TAB_TITLE,
  description: DESCRIPTION,
  keywords: [
    'LogCodex',
    'LogCodex Fleet',
    'consultoria em tecnologia logística',
    'integração de sistemas logísticos',
    'automação de processos logísticos com IA',
    'implantação de sistema para transportadora',
    'transformação operacional logística',
    'diagnóstico de operação logística',
    'gestão de transporte',
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LogCodex — Transformação operacional para logística' }],
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
// A /fleet perdeu seu Organization concorrente (§5b) — este é o único agora.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LogCodex',
  alternateName: 'LogCodex Fleet',
  url: URL,
  logo: `${URL}/logcodex-logo-color.png`,
  description:
    'LogCodex é parceira de transformação operacional para logística: diagnóstico, integração de sistemas, implantação assistida, capacitação de equipe, suporte técnico e automação com IA. O Fleet, sistema de controle de frota, é um exemplo do que já entregamos em produção.',
  email: 'leonardo.antunes@logcodex.com',
  areaServed: 'BR',
  knowsAbout: [
    'logística',
    'transformação operacional',
    'transporte rodoviário de cargas',
    'integração de sistemas',
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

// Service JSON-LD: substitui a narrativa de produto por serviço consultivo.
// Sem price em nenhum item — decisão de posicionamento (sem preço visível).
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Transformação operacional e automação para logística',
  provider: { '@type': 'Organization', name: 'LogCodex', url: URL },
  areaServed: 'BR',
  description: DESCRIPTION,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'O que está incluso',
    itemListElement: [
      'Diagnóstico completo da operação',
      'Integração com sistemas existentes',
      'Personalização da solução',
      'Implantação assistida',
      'Capacitação do time',
      'Suporte técnico consultivo',
      'Automação de processos logísticos com IA',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MarketingPage />
    </>
  )
}
