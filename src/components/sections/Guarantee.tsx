import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { contactHref } from '@/lib/contact'

export function Guarantee() {
  return (
    <section className="py-24 bg-base relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Guarantee */}
          <AnimatedSection>
            <div className="border border-white/[0.08] rounded-2xl bg-surface p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  Garantia de 30 dias
                </span>
              </div>
              <h2 className="text-[clamp(24px,2.8vw,36px)] font-medium leading-[1.1] tracking-[-0.025em] text-primary mb-5">
                Uma entrega que precisa funcionar na rotina.
              </h2>
              <div className="space-y-3 text-[15px] text-secondary leading-[1.65]">
                <p>
                  Depois da entrega, acompanhamos os primeiros 30 dias de uso para ajustar o que
                  aparecer na prática: mensagens, fluxo, formulário, integrações e pequenos pontos
                  de atrito.
                </p>
                <p className="text-primary font-medium">
                  Se a solução não cumprir o escopo combinado, corrigimos ou devolvemos o valor.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Urgency */}
          <AnimatedSection delay={0.12}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-5">
              [ 07 ] Disponibilidade
            </p>
            <h3 className="text-[clamp(24px,2.8vw,36px)] font-medium leading-[1.1] tracking-[-0.025em] text-primary mb-5">
              Poucos projetos
              <br />
              <span className="text-muted font-normal">por ciclo.</span>
            </h3>
            <p className="text-[15px] text-secondary leading-[1.65] max-w-[46ch] mb-4">
              O Método Diagnóstico Primeiro exige atenção real: entender a operação, escrever com
              clareza, construir, testar e ajustar com o negócio rodando.
            </p>
            <p className="text-[15px] text-secondary leading-[1.65] max-w-[46ch] mb-8">
              Por isso, trabalhamos com janelas de implantação em vez de empilhar projetos.{' '}
              <span className="text-primary font-medium">
                Se houver encaixe, você recebe prazo e escopo antes de decidir.
              </span>
            </p>
            <Button
              variant="primary"
              size="lg"
              href={contactHref.availability}
            >
              Conversar sobre uma janela
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
