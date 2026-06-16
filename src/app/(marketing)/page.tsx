import type { Metadata } from 'next'
import { MarketingPage } from './MarketingPage'

export const metadata: Metadata = {
  title: 'LogCodex — Logística inteligente: controle de frota com IA',
  description:
    'Sistemas que ligam tecnologia à operação logística. O Fleet — controle de frota — é nosso primeiro produto. Em breve: rotas, pátio e armazém.',
}

export default function HomePage() {
  return <MarketingPage />
}
