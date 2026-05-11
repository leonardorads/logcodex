'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { contactHref } from '@/lib/contact'

const plans = [
  {
    name: 'Negócio no Mapa',
    tagline: 'Para estabelecer presença digital com clareza',
    price: 'R$ 1.490',
    installments: '3x de R$ 530',
    originalValue: null,
    highlight: false,
    items: [
      'Site profissional com domínio próprio',
      'Copy, estrutura e formulário conectado ao WhatsApp',
      'SEO técnico inicial e configuração essencial',
      '30 dias de acompanhamento pós-entrega',
    ],
  },
  {
    name: 'Negócio no Automático',
    tagline: 'Para reduzir atendimento manual e perda de contato',
    price: 'R$ 2.490',
    installments: '5x de R$ 540',
    originalValue: null,
    highlight: true,
    items: [
      'Tudo do pacote Negócio no Mapa',
      'Automação de agendamento, confirmação e lembretes',
      'Fluxo conectado ao WhatsApp Business',
      '60 dias de acompanhamento e ajustes operacionais',
    ],
  },
  {
    name: 'Parceiro de Crescimento',
    tagline: 'Para evoluir operação, site e automações todo mês',
    price: 'R$ 890/mês',
    installments: 'Mínimo 3 meses',
    originalValue: null,
    highlight: false,
    items: [
      'Tudo dos pacotes anteriores',
      'Prioridade mensal para melhorias e suporte',
      'Novas automações, páginas e ajustes de processo',
      'Canal direto para decisões rápidas',
    ],
  },
]

export function Pricing() {
  return (
    <section id="precos" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-14">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 06 ] Investimento
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[20ch]">
              Escolha o ponto de partida.
              <br />
              <span className="text-muted font-normal">O diagnóstico define o escopo certo.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-[16px] text-secondary leading-[1.55] max-w-[48ch]">
              Os pacotes existem para dar referência. Antes de qualquer proposta, entendemos onde
              sua operação perde tempo, contato ou clareza.
            </p>
          </AnimatedSection>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <AnimatedSection key={plan.name} delay={index * 0.08}>
              <motion.div
                className={`relative rounded-2xl border p-6 h-full flex flex-col cursor-default ${
                  plan.highlight
                    ? 'border-white/[0.14] bg-surface'
                    : 'border-white/[0.055] bg-surface'
                }`}
                whileHover={{ y: -4, borderColor: plan.highlight ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                {plan.highlight && (
                  <>
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)',
                      }}
                    />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.1em] bg-accent text-[#08080a] px-3 py-1 rounded-full font-medium">
                      Melhor ponto de partida
                    </span>
                  </>
                )}

                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className="text-[17px] font-medium tracking-[-0.018em] text-primary mb-1.5">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-muted leading-[1.5] mb-6">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-white/[0.055]">
                    <div className="flex items-end gap-2 mb-1.5">
                      <span className="text-[28px] font-medium tracking-[-0.03em] text-primary leading-none">
                        {plan.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12px] text-secondary">{plan.installments}</span>
                      {plan.originalValue && (
                        <span className="text-[12px] text-muted/70 line-through decoration-muted/50">
                          {plan.originalValue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-accent mt-[3px] shrink-0" />
                        <span className="text-[13.5px] text-secondary leading-[1.5]">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    size="md"
                    href={contactHref.diagnostic}
                    className="w-full justify-center"
                  >
                    Solicitar diagnóstico
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Payment note */}
        <AnimatedSection delay={0.2}>
          <p className="text-center text-[13px] text-muted mt-8">
            Pagamento via Pix, cartão de crédito ou boleto bancário · escopo confirmado antes do início
          </p>
        </AnimatedSection>

      </div>
    </section>
  )
}
