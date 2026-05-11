import {
  CheckCircle2,
  FileCheck2,
  KeyRound,
  SearchCheck,
  SlidersHorizontal,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const before = [
  'Agendamentos confirmados manualmente pelo WhatsApp',
  'Contatos novos chegam só quando você está disponível',
  'Site desatualizado ou inexistente',
  'Faltas frequentes, sem aviso prévio',
  'Informação do negócio na sua cabeça ou em planilha',
]

const after = [
  'Confirmações e lembretes saem do improviso',
  'Formulário captura contatos mesmo fora do horário comercial',
  'Presença digital transmite confiança antes do primeiro contato',
  'Faltas e no-shows passam a ser medidos e tratados',
  'Operação documentada, com menos dependência da memória do dono',
]

const principles = [
  {
    n: '01',
    title: 'Diagnóstico antes de código',
    Icon: SearchCheck,
    description:
      'Entendemos como você opera hoje antes de sugerir qualquer tecnologia. A maioria dos problemas não é falta de sistema — é sistema errado pra operação errada.',
  },
  {
    n: '02',
    title: 'Tecnologia traduzida em resultado',
    Icon: SlidersHorizontal,
    description:
      'Nenhum jargão técnico. Você vê o que muda no dia a dia: menos tarefa manual, menos perda de contato e mais clareza sobre o que está acontecendo.',
  },
  {
    n: '03',
    title: 'Entrega sem surpresa',
    Icon: FileCheck2,
    description:
      'Escopo e prazo definidos antes de começar. A primeira versão entra em uso rápido, e os ajustes vêm do que aparece na rotina real.',
  },
  {
    n: '04',
    title: 'Tudo que construímos é seu',
    Icon: KeyRound,
    description:
      'Sem contrato de fidelidade forçado. Arquivos, plataformas, configurações e decisões importantes ficam acessíveis e documentados.',
  },
] satisfies { n: string; title: string; Icon: LucideIcon; description: string }[]

export function Differentials() {
  return (
    <section id="processo" className="py-24 bg-base-2 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-16">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 02 ] Como funciona
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[20ch]">
              Diagnóstico antes de ferramenta.
              <br />
              <span className="text-muted font-normal">Tecnologia só entra quando melhora a operação.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-[16px] text-secondary leading-[1.55] max-w-[52ch]">
              Antes de construir qualquer coisa, mapeamos como você opera. Identificamos o que faz
              sentido automatizar, o que precisa de site e o que pode ser simplificado. Só depois a
              gente constrói — sem over-engineering, sem solução genérica.
            </p>
          </AnimatedSection>
        </div>

        {/* Before / After cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">

          {/* Before */}
          <AnimatedSection delay={0.05}>
            <div className="border border-white/[0.055] rounded-2xl bg-surface p-6 h-full">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted mb-5">
                <XCircle className="w-3.5 h-3.5 inline-block mr-2 text-muted" strokeWidth={1.8} />
                Hoje, sem estrutura
              </p>
              <ul className="space-y-3.5">
                {before.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-white/15 shrink-0" />
                    <span className="text-[14px] text-secondary leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* After */}
          <AnimatedSection delay={0.12}>
            <div className="border border-white/[0.08] rounded-2xl bg-surface p-6 h-full relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)',
                }}
              />
              <p className="relative z-10 font-mono text-[11px] uppercase tracking-[0.12em] text-accent mb-5">
                <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-2" strokeWidth={1.8} />
                Com a LogCodex
              </p>
              <ul className="relative z-10 space-y-3.5">
                {after.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                    <span className="text-[14px] text-secondary leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        {/* Principles */}
        <div className="border-t border-white/[0.055] border-b border-b-white/[0.055]">
          {principles.map((item, index) => {
            const Icon = item.Icon
            return (
            <AnimatedSection key={item.n} delay={index * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-[60px_1fr_1.4fr] gap-8 py-7 border-b border-white/[0.055] last:border-0 items-start hover:bg-white/[0.012] transition-colors duration-200">
                <span className="w-10 h-10 rounded-xl border border-white/[0.07] bg-white/[0.02] text-accent flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.65} />
                </span>
                <h3 className="text-[18px] font-medium tracking-[-0.018em] text-primary">
                  <span className="font-mono text-[11px] text-muted mr-2">/{item.n}</span>
                  {item.title}
                </h3>
                <p className="text-[14.5px] text-secondary leading-[1.55] max-w-[56ch]">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
            )
          })}
        </div>

      </div>
    </section>
  )
}
