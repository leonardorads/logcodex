import type { Metadata } from 'next'
import { MarketingPage } from './MarketingPage'

export const metadata: Metadata = {
  title: 'LogCodex — Engenharia de operação para logística',
  description:
    'Sistemas que ligam tecnologia à operação logística. O Fleet — controle de frota — é nosso primeiro produto. Em breve: rotas, pátio e armazém.',
}

export default function HomePage() {
  return <MarketingPage />
}
