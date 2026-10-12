import type { NomeIcone } from './icones'

// Conteúdo da home geral da LogCodex (sistemas sob medida), num lugar só.
// Regras do roteiro (docs/briefing-home-geral-2026-10.md): nada de depoimento,
// número de resultado, cliente ou logo inventado; o cliente do Fleet não é citado.

// Mesmo número da /hospedagem. TODO(Leo): trocar pelo WhatsApp Business da
// LogCodex (Fluke) quando a linha for ativada.
export const WHATSAPP = '5541999283590'
const MSG_ZAP = 'Olá, Leo! Vi o site da LogCodex e quero conversar sobre um sistema para o meu negócio.'
export const LINK_ZAP = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG_ZAP)}`

export const EMAIL = 'leonardo.antunes@logcodex.com'

export const LINKS_NAV = [
  { href: '#solucoes', label: 'Soluções' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#como', label: 'Como funciona' },
  { href: '#duvidas', label: 'Dúvidas' },
] as const

export const SETORES = [
  { href: '/logistica', label: 'Logística', detalhe: 'Para transportadoras' },
  { href: '/hospedagem', label: 'Pousadas', detalhe: 'Sites com reserva direta' },
] as const

// Os seis serviços agrupados em três necessidades (crítica do Codex, 11/10):
// seis cartões soltos diziam "faço tudo"; três necessidades dizem "que problema
// meu vocês resolvem".
export const SOLUCOES: { icone: NomeIcone; n: string; titulo: string; texto: string; servicos: string[]; cor: string }[] = [
  {
    icone: 'busca',
    n: '01',
    titulo: 'Ser encontrado',
    texto: 'Quem procura no Google precisa achar você, e confiar no que vê no primeiro clique.',
    servicos: ['Site profissional', 'Página de venda'],
    cor: 'azul',
  },
  {
    icone: 'conversas',
    n: '02',
    titulo: 'Atender sem perder ninguém',
    texto: 'O WhatsApp responde na hora, a qualquer hora, e entrega o cliente pronto para você fechar.',
    servicos: ['Atendimento no WhatsApp com IA', 'Automações'],
    cor: 'verde',
  },
  {
    icone: 'painel',
    n: '03',
    titulo: 'Organizar o dia a dia',
    texto: 'Clientes, pedidos, agenda e números num lugar só, no lugar da planilha espalhada.',
    servicos: ['CRM', 'Sistema sob medida'],
    cor: 'ambar',
  },
]

export const PASSOS: { icone: NomeIcone; n: string; titulo: string; texto: string; extra?: string[] }[] = [
  {
    icone: 'conversas',
    n: '01',
    titulo: 'Conversa',
    texto: 'Você conta como o seu negócio funciona hoje e o que mais atrapalha. Quem conversa com você é quem constrói.',
  },
  {
    icone: 'olho',
    n: '02',
    titulo: 'Prévia grátis',
    texto: 'Antes de decidir, você vê como vai ficar:',
    extra: ['Site: o desenho da página', 'Sistema: o caminho principal funcionando', 'Automação: uma simulação da conversa'],
  },
  {
    icone: 'foguete',
    n: '03',
    titulo: 'Construção e entrada no ar',
    texto: 'Com a proposta aprovada, a gente constrói no prazo combinado antes de começar e coloca no ar.',
  },
  {
    icone: 'boia',
    n: '04',
    titulo: 'Por perto depois',
    texto: 'Ajustes, dúvidas e melhorias combinadas com você. O sistema acompanha o negócio.',
  },
]

export const COMPROMISSOS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: 'aperto', titulo: 'Fala direto com quem constrói', texto: 'Sem intermediário: a conversa é com quem desenha e programa.' },
  { icone: 'celular', titulo: 'Feito para o celular', texto: 'É onde o seu cliente olha. Rápido e fácil de usar na tela pequena.' },
  { icone: 'busca', titulo: 'Preparado para o Google', texto: 'Estrutura e informações do jeito que o Google lê. Posição na busca ninguém garante, e a gente não promete.' },
  { icone: 'chave', titulo: 'No seu nome', texto: 'Site e domínio ficam registrados no seu nome, não no nosso.' },
]

export const FAQ: { icone: NomeIcone; q: string; a: string }[] = [
  {
    icone: 'cartao',
    q: 'Quanto custa?',
    a: 'Depende do que o seu negócio precisa: um site é diferente de um sistema completo. Na conversa a gente entende o problema e, depois da prévia, você recebe a proposta com o valor antes de qualquer compromisso.',
  },
  {
    icone: 'relogio',
    q: 'Quanto tempo leva?',
    a: 'Um site fica pronto bem antes de um sistema. O prazo é combinado com você antes de começar e fica escrito na proposta.',
  },
  {
    icone: 'olho',
    q: 'Como funciona a prévia grátis?',
    a: 'Você vê como vai ficar antes de decidir. Para site, é o desenho da página. Para sistema, é o caminho principal funcionando numa demonstração. Para automação, é uma simulação da conversa. Não custa nada e não obriga a nada.',
  },
  {
    icone: 'notebook',
    q: 'Preciso entender de tecnologia?',
    a: 'Não. Você explica o seu negócio do seu jeito e a gente traduz em sistema. Na entrega, você aprende a usar no seu ritmo, com a gente por perto.',
  },
  {
    icone: 'chave',
    q: 'Vou ficar preso a vocês?',
    a: 'Não. Site e domínio ficam no seu nome. Nos sistemas, o acesso e a forma de trabalho ficam combinados por escrito na proposta, sem surpresa.',
  },
  {
    icone: 'robo',
    q: 'Como funciona o atendimento com IA no WhatsApp?',
    a: 'Ele responde as mensagens com naturalidade, tira as dúvidas mais comuns do seu negócio e passa a conversa para você quando é hora de fechar, ou quando é algo que só você resolve.',
  },
  {
    icone: 'mapa',
    q: 'Vocês atendem a minha cidade?',
    a: 'Sim. A LogCodex atende todo o Brasil. A conversa acontece por vídeo ou pelo WhatsApp.',
  },
]
