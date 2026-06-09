import type { Metadata } from 'next'
import { FleetLanding } from './FleetLanding'

export const metadata: Metadata = {
  title: 'LogCodex Fleet — Saiba quanto ganha em cada viagem',
  description:
    'Controle de frota sem planilha. Viagens, despesas e acertos com motoristas num lugar só. Teste grátis por 7 dias, sem cartão.',
}

export default function FleetLandingPage() {
  return <FleetLanding />
}
