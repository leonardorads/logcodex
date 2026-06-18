import type { Metadata } from 'next'
import { FAQ } from './faq-data'
import { LancamentoLanding, type Utm } from './LancamentoLanding'

// noindex + canonical → /fleet (Decisão 2 / decision-018): página de campanha,
// vive de tráfego dirigido; concentra o SEO orgânico na /fleet (sem canibalização).
export const metadata: Metadata = {
  title: 'LogCodex Fleet — Acesso Antecipado · Lote 1',
  description:
    'As 20 primeiras transportadoras entram com condição de lançamento: 30% de desconto por 12 meses no LogCodex Fleet. Entre na lista do Lote 1.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.logcodex.com/fleet' },
  openGraph: {
    title: 'LogCodex Fleet — 30% OFF por 12 meses · Lote 1',
    description:
      'As 20 primeiras transportadoras ganham 30% de desconto por 12 meses + onboarding assistido. Sem cartão, sem compromisso.',
    url: 'https://www.logcodex.com/lancamento',
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogCodex Fleet — 30% OFF por 12 meses · Lote 1',
    description:
      'Controle de frota sem planilha. 20 vagas com desconto de lançamento. Entre na lista.',
  },
}

// Captura UTM via searchParams do Page (Server Component) — evita useSearchParams
// + Suspense no cliente (recomendação do doc do Next 16). Passa como props.
export default async function LancamentoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const one = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v

  const utm: Utm = {
    utm_source: one(sp.utm_source),
    utm_medium: one(sp.utm_medium),
    utm_campaign: one(sp.utm_campaign),
    utm_content: one(sp.utm_content),
    utm_term: one(sp.utm_term),
  }
  const variant = one(sp.v) === 'b' ? 'B' : 'A'

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
      <LancamentoLanding utm={utm} variant={variant} />
    </>
  )
}
