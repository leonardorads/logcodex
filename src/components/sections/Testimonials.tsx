'use client'

import { AnimatedSection } from '@/components/ui/AnimatedSection'

const signals = [
  {
    metric: '−3 h/dia',
    context: 'em tarefas manuais mapeadas',
    detail: 'Agendamento, confirmação e cobrança deixam de depender de memória, planilha e resposta fora de hora.',
  },
  {
    metric: '+40%',
    context: 'mais contatos capturados',
    detail: 'Site com formulário e WhatsApp conectados para transformar visita em conversa antes do concorrente.',
  },
  {
    metric: '< 30 dias',
    context: 'para a primeira versão em uso',
    detail: 'Diagnóstico na semana 1, entrega em ciclos curtos e ajustes com base no uso real.',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-base-2">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
                [ 05 ] Indicadores
              </p>
              <h2 className="text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[28ch]">
                O que medimos quando a operação deixa de depender de improviso.
              </h2>
            </div>
          </div>
        </AnimatedSection>

        {/* Signal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {signals.map((s, index) => (
            <AnimatedSection key={s.metric} delay={index * 0.08}>
              <div className="border border-white/[0.055] rounded-2xl bg-surface p-7 h-full flex flex-col gap-4">
                <div>
                  <span className="block text-[clamp(32px,3.6vw,44px)] font-medium tracking-[-0.04em] text-primary leading-none">
                    {s.metric}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-accent mt-2 block">
                    {s.context}
                  </span>
                </div>
                <p className="text-[14px] text-muted leading-[1.6] flex-1">
                  {s.detail}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Measurement note */}
        <AnimatedSection delay={0.2}>
          <div className="border border-white/[0.055] rounded-2xl bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-accent/60" />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                Critério
              </span>
            </div>
            <p className="text-[13.5px] text-secondary leading-[1.5]">
              Não vendemos painel bonito como resultado. Medimos tempo economizado, contatos capturados, faltas evitadas e clareza operacional depois da entrega.{' '}
              <a href="#contato" className="text-primary hover:text-accent transition-colors underline underline-offset-2 decoration-white/20">
                Fale com a gente diretamente →
              </a>
            </p>
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}
