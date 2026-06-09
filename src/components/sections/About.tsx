'use client'

import { BarChart3, Factory, MapPin, Network, TimerReset } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const principles = [
  {
    title: 'Processo antes de ferramenta',
    description: 'A tecnologia entra depois de entender onde a rotina perde tempo, cliente ou controle.',
    Icon: Network,
  },
  {
    title: 'Entrega que vira rotina',
    description: 'Site, automação ou sistema precisam ser simples de operar depois que a implantação acaba.',
    Icon: TimerReset,
  },
  {
    title: 'Indicador que ajuda decisão',
    description: 'O objetivo não é encher a tela de gráfico. É mostrar o que muda agenda, receita e atendimento.',
    Icon: BarChart3,
  },
]

const shenzhenSignals = [
  'Velocidade sem improviso',
  'Processo documentado',
  'Operação enxuta',
  'Tecnologia com função clara',
]

function CompanyPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-6 sm:p-8">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 op-panel-glow" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-accent/25 bg-accent/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-accent" strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-primary">LogCodex</p>
              <p className="font-mono text-[11px] text-muted">operação · tecnologia · escala</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" strokeWidth={1.8} />
            <span className="font-mono text-[10.5px] text-secondary">Shenzhen</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {shenzhenSignals.map((signal) => (
            <div key={signal} className="rounded-xl border border-white/[0.055] bg-white/[0.025] p-4">
              <span className="block w-1.5 h-1.5 rounded-full bg-accent mb-3" />
              <p className="text-[13px] text-secondary leading-[1.4]">{signal}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[0.055] bg-base/40 p-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted mb-3">
            princípio operacional
          </p>
          <p className="text-[22px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.15] text-primary">
            Menos ferramenta solta.
            <br />
            Mais processo funcionando.
          </p>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="sobre" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <AnimatedSection>
            <CompanyPanel />
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-5">
              [ 03 ] Sobre a empresa
            </p>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary mb-7">
              Nascemos para ligar
              <br />
              <span className="text-muted font-normal">tecnologia à operação.</span>
            </h2>

            <div className="space-y-4 text-[15px] text-secondary leading-[1.7]">
              <p>
                A LogCodex nasceu da vivência com operação real: rotina crítica, processo quebrando
                no detalhe, informação espalhada e decisões importantes presas em planilhas,
                mensagens e retrabalho.
              </p>
              <p>
                A passagem por Shenzhen reforçou uma ideia simples: tecnologia só tem valor quando
                melhora o fluxo do negócio. Lá, escala, disciplina operacional e velocidade não são
                discurso; são método.
              </p>
              <p>
                Esse aprendizado foi traduzido para empresas que precisam vender, atender, agendar,
                organizar e medir melhor sem criar uma estrutura técnica pesada.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              {principles.map(({ title, description, Icon }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-xl border border-white/[0.055] bg-white/[0.015] p-4"
                >
                  <div className="w-9 h-9 rounded-lg border border-white/[0.055] bg-white/[0.025] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-primary mb-1">{title}</h3>
                    <p className="text-[13px] text-muted leading-[1.55]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
