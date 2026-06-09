'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Globe, MessageCircle, TrendingUp } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { contactHref } from '@/lib/contact'

const cases = [
  {
    client: 'Studio Odonto Guaratuba',
    location: 'Guaratuba · PR',
    what: 'Site com agendamento integrado e automação de confirmação e lembrete via WhatsApp — sem app extra.',
    metric: '−2h40min',
    metricLabel: 'por dia em confirmações',
    secondary: 'Faltas caíram 41% nos primeiros 45 dias',
    timeline: '17 dias',
    tags: ['Site', 'WhatsApp', 'Automação'],
    Icon: Calendar,
    accentColor: 'rgba(99,102,241,0.15)',
    accentBorder: 'rgba(99,102,241,0.25)',
    accentText: '#6366f1',
  },
  {
    client: 'Ateliê Mel Beauté',
    location: 'Matinhos · PR',
    what: 'Landing page com formulário conectado ao WhatsApp e ficha otimizada no Google Meu Negócio.',
    metric: '+31',
    metricLabel: 'novos clientes no 1º mês',
    secondary: 'Primeiros contatos chegaram 52h após o ar',
    timeline: '12 dias',
    tags: ['Landing Page', 'Google', 'SEO Local'],
    Icon: Globe,
    accentColor: 'rgba(168,85,247,0.12)',
    accentBorder: 'rgba(168,85,247,0.22)',
    accentText: '#a855f7',
  },
  {
    client: 'Litoral Contábil Assessoria',
    location: 'Paranaguá · PR',
    what: 'Site institucional com geração de leads qualificados via WhatsApp Business e presença no Google Maps.',
    metric: '+22',
    metricLabel: 'consultas/mês qualificadas',
    secondary: 'Indexado no Google Maps em 6 dias',
    timeline: '21 dias',
    tags: ['Site', 'WhatsApp Business', 'Google Maps'],
    Icon: TrendingUp,
    accentColor: 'rgba(94,220,161,0.10)',
    accentBorder: 'rgba(94,220,161,0.20)',
    accentText: '#5edca1',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function MiniPortfolio() {
  return (
    <section id="cases" className="py-20 bg-base-2 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-3">
                Trabalho · Operações locais
              </p>
              <h2 className="text-[clamp(26px,3vw,38px)] font-medium leading-[1.06] tracking-[-0.025em] text-primary">
                Negócios locais
                <br />
                <span className="text-muted font-normal">com atendimento, agenda e presença digital estruturados.</span>
              </h2>
            </div>
            <a
              href="#cases"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] text-muted hover:text-primary transition-colors shrink-0"
            >
              ver todos os casos
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </AnimatedSection>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {cases.map((item) => {
            const Icon = item.Icon
            return (
              <motion.div
                key={item.client}
                variants={cardVariants}
                className="group relative rounded-2xl border border-white/[0.055] bg-surface p-6 flex flex-col gap-5 hover:border-white/[0.12] transition-all duration-300"
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                {/* Subtle hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${item.accentColor} 0%, transparent 70%)` }}
                />

                {/* Top: client + location */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium tracking-[-0.012em] text-primary leading-[1.2]">
                      {item.client}
                    </p>
                    <p className="font-mono text-[11px] text-muted mt-1">{item.location}</p>
                  </div>
                  <motion.div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                    style={{
                      background: item.accentColor,
                      borderColor: item.accentBorder,
                      color: item.accentText,
                    }}
                    whileHover={{ rotate: [0, -8, 6, 0], scale: 1.12 }}
                    transition={{ duration: 0.38 }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.7} />
                  </motion.div>
                </div>

                {/* What was done */}
                <div className="relative z-10">
                  <p className="text-[13.5px] text-secondary leading-[1.55]">
                    {item.what}
                  </p>
                </div>

                {/* Result */}
                <div
                  className="relative z-10 rounded-xl p-4 border"
                  style={{ background: item.accentColor, borderColor: item.accentBorder }}
                >
                  <div className="flex items-end gap-2 mb-1">
                    <span
                      className="text-[32px] font-medium tracking-[-0.04em] leading-none"
                      style={{ color: item.accentText }}
                    >
                      {item.metric}
                    </span>
                    <span className="text-[12px] text-secondary pb-1 leading-tight">
                      {item.metricLabel}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted">{item.secondary}</p>
                </div>

                {/* Footer: tags + timeline */}
                <div className="relative z-10 flex items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10.5px] text-muted border border-white/[0.055] bg-white/[0.02] px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10.5px] text-muted shrink-0 whitespace-nowrap">
                    ⏱ {item.timeline}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom note */}
        <AnimatedSection delay={0.2}>
          <div className="mt-8 flex items-center gap-3 justify-center">
            <MessageCircle className="w-3.5 h-3.5 text-muted shrink-0" />
            <p className="text-[13px] text-muted text-center">
              Recortes de projetos com identidade preservada. Abrimos contexto, limites e números em conversa.{' '}
              <a
                href={contactHref.cases}
                className="text-primary hover:text-accent transition-colors underline underline-offset-2 decoration-white/20"
              >
                Peça mais detalhes pelo WhatsApp →
              </a>
            </p>
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}
