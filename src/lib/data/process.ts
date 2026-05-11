export interface ProcessStep {
  id: number
  title: string
  description: string
  detail: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Diagnóstico',
    description: 'Entendemos o problema antes de qualquer linha de código.',
    detail: 'Mapeamos processos, identificamos gargalos e definimos onde tecnologia gera valor real.',
  },
  {
    id: 2,
    title: 'Estratégia',
    description: 'Definimos escopo, stack e caminho com clareza.',
    detail: 'Escolhemos a abordagem certa para o contexto — sem over-engineering, sem subentrega.',
  },
  {
    id: 3,
    title: 'Desenvolvimento',
    description: 'Código limpo, componentes reutilizáveis, sem gambiarra.',
    detail: 'Entregamos incremental, com feedback frequente e visibilidade total do progresso.',
  },
  {
    id: 4,
    title: 'Integração',
    description: 'Conectamos sistemas, APIs e automações.',
    detail: 'Tudo funciona junto. Sem silos, sem retrabalho manual entre ferramentas.',
  },
  {
    id: 5,
    title: 'Escala e Otimização',
    description: 'Monitoramos, ajustamos e evoluímos.',
    detail: 'O trabalho não termina no deploy. Medimos resultados e melhoramos continuamente.',
  },
]
