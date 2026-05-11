'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { contactHref } from '@/lib/contact'

export function FinalCTA() {
  return (
    <section id="contato" className="py-32 bg-base relative overflow-hidden">

      {/* Animated background orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(99,102,241,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />

      {/* Animated top accent line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px pointer-events-none"
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 560, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        viewport={{ once: true }}
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.45), transparent)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <AnimatedSection>
          <p className="text-accent font-mono text-xs tracking-widest uppercase mb-8">
            Diagnóstico inicial
          </p>

          <h2 className="text-[clamp(36px,4.8vw,64px)] font-medium tracking-[-0.035em] leading-[1.04] text-primary mb-6">
            Descubra onde sua operação
            <br />
            está perdendo tempo.
          </h2>

          <p className="text-[17px] text-secondary mb-3 max-w-[50ch] mx-auto leading-[1.55] tracking-[-0.005em]">
            Em uma conversa curta, mapeamos atendimento, agenda, captação e rotina manual para
            identificar o que vale automatizar agora.
          </p>
          <p className="text-[17px] text-primary font-medium mb-12 max-w-[50ch] mx-auto leading-[1.55]">
            Você sai com uma leitura clara do próximo passo, mesmo que ainda não contrate nada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <div className="relative">
              <Button
                variant="primary"
                size="lg"
                href={contactHref.diagnostic}
              >
                <Mail className="w-4 h-4" />
                Solicitar diagnóstico
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <p className="text-[13px] text-muted">
            Resposta em até 4 horas úteis · sem compromisso · escopo antes de qualquer cobrança
          </p>
        </AnimatedSection>

        {/* PS */}
        <AnimatedSection delay={0.2}>
          <div className="mt-16 pt-10 border-t border-white/[0.055] text-left max-w-xl mx-auto">
            <p className="text-[14px] text-secondary leading-[1.7]">
              <span className="text-primary font-medium">P.S.</span>{' '}
              O diagnóstico não é uma chamada de venda disfarçada. É uma leitura objetiva da sua
              operação para separar prioridade real de tecnologia desnecessária.
            </p>
            <p className="text-[14px] text-muted mt-2 leading-[1.7]">
              Quando fizer sentido avançar, você recebe escopo, prazo e investimento com clareza
              antes de aprovar.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
