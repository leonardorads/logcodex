import { processSteps } from '@/lib/data/process'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function Process() {
  return (
    <section id="processo" className="py-24 bg-base-2">
      <div className="max-w-7xl mx-auto px-6">

        {/* Two-column section header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-16">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 05 ] Processo
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary">
              Cinco etapas. Sem surpresa no meio do caminho.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-[16px] text-secondary leading-[1.55] max-w-[52ch]">
              O documento de escopo cabe em uma página. O cronograma cabe num e-mail. A primeira
              entrega chega em três semanas — ou a gente avisa antes.
            </p>
          </AnimatedSection>
        </div>

        {/* Sticky-left layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-20 items-start">

          {/* Left — sticky methodology note */}
          <AnimatedSection>
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted mb-4">
                Como entregamos
              </p>
              <p className="text-[14px] text-secondary leading-[1.6]">
                Trabalhamos em{' '}
                <strong className="text-primary font-medium">
                  sprints curtas com revisão semanal
                </strong>
                . Você acompanha branch, métrica e tempo investido em tempo real — sem dashboards de
                fachada.
              </p>
            </div>
          </AnimatedSection>

          {/* Right — step list */}
          <div className="border-l border-white/[0.055]">
            {processSteps.map((step, index) => (
              <AnimatedSection key={step.id} delay={index * 0.08}>
                <div
                  className={`proc-step-grid items-start py-6 pl-6 border-b border-white/[0.055] last:border-0 relative ${
                    index === 0 ? 'proc-step-active' : ''
                  }`}
                >
                  {/* Left tick on border */}
                  <div
                    className={`absolute -left-px top-7 h-px w-3.5 ${
                      index === 0 ? 'bg-accent' : 'bg-white/[0.10]'
                    }`}
                  />
                  <span
                    className={`font-mono text-[11px] tracking-[0.05em] pt-0.5 ${
                      index === 0 ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    /{String(step.id).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[18px] font-medium tracking-[-0.015em] text-primary mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-[13.5px] text-muted leading-[1.55] max-w-[58ch]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
