import type { MarqueeItem } from './SecMarquee'

const svg = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

// Home — capacidades da LogCodex como parceira de transformação operacional.
export const HOME_MARQUEE_ROW_A: MarqueeItem[] = [
  {
    label: 'Diagnóstico completo',
    desc: 'Mapeamento da operação antes de qualquer proposta.',
    icon: svg('M11 2a9 9 0 1 0 5.3 16.3L21 23l0.7-0.7-4.7-4.7A9 9 0 0 0 11 2z M11 6v5l3.5 2'),
  },
  {
    label: 'Integração com sistemas existentes',
    desc: 'Planilha, sistema legado, rastreamento — conectados, não descartados.',
    icon: svg('M8 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3 M16 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3 M8 12h8'),
  },
  {
    label: 'Implantação assistida',
    desc: 'A LogCodex conduz o projeto, sua equipe não carrega sozinha.',
    icon: svg('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'),
  },
  {
    label: 'Capacitação do time',
    desc: 'Treinamento real, no ritmo da sua operação.',
    icon: svg('M22 10v6M2 10l10-5 10 5-10 5-10-5z M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5'),
  },
]

export const HOME_MARQUEE_ROW_B: MarqueeItem[] = [
  {
    label: 'Suporte técnico consultivo',
    desc: 'Acompanhamento contínuo depois do go-live.',
    icon: svg('M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0'),
  },
  {
    label: 'Automação com IA',
    desc: 'Processos repetitivos automatizados no seu contexto real.',
    icon: svg('M12 8V4H8 M12 4l4 4 M4 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z M9 16v-3 M15 16v-3 M8 12h.01 M16 12h.01'),
  },
  {
    label: 'Controle de frota (Fleet)',
    desc: 'Viagens, acertos e despesas — base já em produção.',
    icon: svg('M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'),
  },
  {
    label: 'Painéis operacionais',
    desc: 'Faturamento, margem e pendências, sem esperar relatório.',
    icon: svg('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'),
  },
]

// /fleet — capacidades específicas do módulo Fleet.
export const FLEET_MARQUEE_ROW_A: MarqueeItem[] = [
  {
    label: 'Viagens documentadas',
    desc: 'Origem, destino, KM e valor registrados em minutos.',
    icon: svg('M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'),
  },
  {
    label: 'Acertos com motoristas',
    desc: 'Proposta menos despesas, calculado automaticamente.',
    icon: svg('M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),
  },
  {
    label: 'Despesas por viagem',
    desc: 'Combustível, pedágio e manutenção, custo real atualizado.',
    icon: svg('M3 22V8l9-6 9 6v14 M9 22V12h6v10'),
  },
  {
    label: 'Assistente Fleet (IA)',
    desc: 'Pergunta em português, resposta com dados reais.',
    icon: svg('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
  },
]

export const FLEET_MARQUEE_ROW_B: MarqueeItem[] = [
  {
    label: 'Propostas e clientes',
    desc: 'Da cotação ao fechamento, tudo amarrado à viagem.',
    icon: svg('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8'),
  },
  {
    label: 'DRE por período',
    desc: 'Receita, despesas e resultado, sem esperar o contador.',
    icon: svg('M3 3v18h18 M7 15l4-4 3 3 5-6'),
  },
  {
    label: 'Dashboard operacional',
    desc: 'Viagens ativas e margem por rota, em tempo real.',
    icon: svg('M3 9h18M3 15h18M9 3v18M15 3v18'),
  },
  {
    label: 'Cobranças e faturas',
    desc: 'Emissão e acompanhamento de recebíveis por cliente.',
    icon: svg('M4 4h16v16H4z M8 9h8M8 13h8M8 17h4'),
  },
]
