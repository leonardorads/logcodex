export interface Service {
  id: string
  n: string
  title: string
  description: string
  icon: string
  wide?: boolean
}

export const services: Service[] = [
  {
    id: 'automation',
    n: '01',
    title: 'Automação de atendimento e rotina',
    description:
      'Confirmações, lembretes, respostas iniciais, cobranças e repasses internos funcionando sem depender de alguém olhando o celular o dia inteiro.',
    icon: 'Zap',
  },
  {
    id: 'ai',
    n: '02',
    title: 'IA aplicada ao atendimento',
    description:
      'Agentes e assistentes usados com critério: triagem, respostas recorrentes, organização de solicitações e apoio ao time. Sem automação cenográfica.',
    icon: 'Brain',
  },
  {
    id: 'saas',
    n: '03',
    title: 'Sistemas internos sob medida',
    description: 'Ferramentas simples para cadastro, agenda, pedidos, pagamentos, equipe e operação quando planilha já virou gargalo.',
    icon: 'Layers',
  },
  {
    id: 'dashboards',
    n: '04',
    title: 'Painéis operacionais',
    description:
      'Métricas que ajudam a decidir: contatos, agenda, faltas, origem de clientes, financeiro e gargalos visíveis sem reunião para explicar.',
    icon: 'BarChart2',
  },
  {
    id: 'web',
    n: '05',
    title: 'Sites e páginas de conversão',
    description:
      'Presença digital com performance, SEO, copy clara e WhatsApp integrado. Sem template inflado, sem página bonita que não gera ação.',
    icon: 'Globe',
  },
  {
    id: 'consulting',
    n: '06',
    title: 'Diagnóstico operacional',
    description:
      'Mapeamos a rotina antes de propor tecnologia. O objetivo é descobrir o que automatizar, integrar, simplificar ou simplesmente remover.',
    icon: 'Compass',
  },
  {
    id: 'partner',
    n: '07',
    title: 'Parceria contínua de melhoria',
    description:
      'Para empresas que querem evoluir com tecnologia todo mês sem montar um time interno. Ajustes, novas automações e melhoria contínua com prioridade combinada.',
    icon: 'Sigma',
    wide: true,
  },
]
