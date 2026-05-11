export interface Case {
  id: string
  title: string
  category: string
  description: string
  stack: string[]
  impact: string
  preview: string
}

export const cases: Case[] = [
  {
    id: 'pgi',
    title: 'Painel de gestão interna',
    category: 'Dashboards',
    description:
      'Operação completa de pedidos, estoque e equipe em um lugar só. Substituiu quatro planilhas paralelas e um ritual diário de copiar e colar.',
    stack: ['Next.js', 'Supabase', 'Tailwind', 'Recharts'],
    impact: '−4 h/dia em trabalho manual',
    preview: 'dash',
  },
  {
    id: 'onb',
    title: 'Onboarding automatizado',
    category: 'Automação',
    description:
      'Ativação de novos clientes orquestrada entre CRM, e-mail, WhatsApp e tarefas internas. Checklist inteligente que se ajusta ao plano contratado.',
    stack: ['n8n', 'GPT-4o', 'Webhooks', 'Notion'],
    impact: '−70% no tempo de ativação',
    preview: 'flow',
  },
  {
    id: 'sched',
    title: 'Plataforma de agendamentos',
    category: 'SaaS',
    description:
      'SaaS multi-tenant para clínicas pequenas. Agenda, pagamento e notificação em um único produto, do cadastro ao reembolso.',
    stack: ['Next.js', 'Stripe', 'PostgreSQL', 'Resend'],
    impact: 'Em produção em 6 semanas',
    preview: 'cal',
  },
  {
    id: 'lead',
    title: 'Site institucional + captação',
    category: 'Websites',
    description:
      'Reescrita completa com foco em performance, mensuração e estrutura para teste contínuo. Sem dark patterns, sem peso desnecessário.',
    stack: ['Next.js', 'Vercel', 'GA4', 'Sanity'],
    impact: '+38% em leads qualificados',
    preview: 'site',
  },
  {
    id: 'sup',
    title: 'Suporte com agente próprio',
    category: 'IA',
    description:
      'Atendimento de primeira linha com Claude treinado na base interna do cliente. Roteamento inteligente para humano quando necessário.',
    stack: ['Claude API', 'Node.js', 'Pinecone', 'Webhooks'],
    impact: 'Suporte 24h sem time adicional',
    preview: 'chat',
  },
  {
    id: 'rev',
    title: 'Cockpit financeiro',
    category: 'Dashboards',
    description:
      'Receita recorrente, churn e fluxo de caixa em uma tela só, com alertas operacionais ligados ao Slack.',
    stack: ['Metabase', 'dbt', 'BigQuery'],
    impact: 'Fechamento mensal em 1 dia',
    preview: 'rev',
  },
]

export const caseCategories = ['Todos', 'IA', 'Automação', 'Websites', 'SaaS', 'Dashboards']
