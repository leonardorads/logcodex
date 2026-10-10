import type { Metadata } from 'next'
import { classeFontes } from './fontes'
import { PERGUNTAS } from './faq-data'
import { PousadasLanding } from './PousadasLanding'
import './pousadas.css'

// Página da frente de hospedagem (decisão do Leo em 08/10/2026, opção B do
// radar-site-logcodex.md): a home de logística não muda; esta é a página que
// faz sentido para o dono de pousada que recebe a prospecção.
// Indexável desde 10/10/2026 (Leo: "com certeza! precisamos pegar forte nisso").
// Endereço oficial é o .com.br (pedido do Leo); o .com serve a mesma página,
// então o canonical aponta tudo para o .com.br e evita conteúdo duplicado.

const URL_OFICIAL = 'https://www.logcodex.com.br/hospedagem'
const TITULO = 'Sites para pousadas — LogCodex'
const DESCRICAO = 'Mais hóspedes reservando direto com você. Prévia grátis do site da sua pousada, com as suas fotos, e reserva pelo WhatsApp sem comissão.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: URL_OFICIAL },
  openGraph: {
    title: 'Mais hóspedes reservando direto com você',
    description: DESCRICAO,
    url: URL_OFICIAL,
    siteName: 'LogCodex',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function HospedagemPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PERGUNTAS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  return (
    <div className={classeFontes}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PousadasLanding />
    </div>
  )
}
