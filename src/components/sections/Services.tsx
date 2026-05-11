'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, Layers, BarChart2, Globe, Compass, Sigma, type LucideIcon } from 'lucide-react'
import { services } from '@/lib/data/services'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { contactHref } from '@/lib/contact'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Brain,
  Layers,
  BarChart2,
  Globe,
  Compass,
  Sigma,
}

/* Layout: 12-column editorial grid
   01: span 6 (featured)   02: span 3   03: span 3
   04: span 4              05: span 4   06: span 4
   07: span 12 (full banner)
*/
const spanClass = [
  'lg:col-span-6',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-12',
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">

        {/* Two-column section header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-16">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 04 ] Serviços
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[18ch]">
              O que podemos estruturar para o seu negócio.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-[16px] text-secondary leading-[1.55] max-w-[52ch]">
              Cada entrega nasce do diagnóstico. Às vezes o problema é um site fraco. Às vezes é
              atendimento lento. Às vezes é a falta de um processo simples que conecte tudo.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted mt-5 pt-4 border-t border-white/[0.055]">
              SCOPE · MODULAR · DIAGNOSTIC FIRST
            </p>
          </AnimatedSection>
        </div>

        {/* Editorial grid */}
        <AnimatedSection>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 border border-white/[0.055] rounded-2xl overflow-hidden bg-surface"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {services.map((service, index) => {
              const Icon = iconMap[service.icon]
              const isWide = service.wide

              if (isWide) {
                return (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    className="group relative lg:col-span-12 flex flex-col sm:flex-row gap-6 sm:gap-10 p-7 sm:p-8 bg-surface border-t border-white/[0.055] transition-colors duration-300 hover:bg-elevated items-start sm:items-center"
                  >
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 svc-hover-glow" />

                    <div className="relative z-10 flex items-center gap-4 shrink-0">
                      <motion.div
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.055] bg-white/[0.025] text-secondary group-hover:text-accent group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300 svc-icon-hover"
                        whileHover={{ rotate: [0, -8, 6, 0], scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      >
                        {Icon && <Icon className="w-5 h-5" strokeWidth={1.5} />}
                      </motion.div>
                      <span className="font-mono text-[10.5px] text-faint tracking-[0.06em]">/{service.n}</span>
                    </div>

                    <div className="relative z-10 flex-1 sm:border-l sm:border-white/[0.055] sm:pl-10">
                      <h3 className="text-[18px] font-medium tracking-[-0.012em] text-primary leading-[1.3] mb-2">
                        {service.title}
                      </h3>
                      <p className="text-[14px] text-muted leading-[1.55] max-w-[64ch]">
                        {service.description}
                      </p>
                    </div>

                    <a
                      href={contactHref.partnership}
                      className="relative z-10 shrink-0 font-mono text-[12.5px] text-muted group-hover:text-accent transition-colors duration-300 sm:ml-auto whitespace-nowrap"
                    >
                      Falar sobre parceria →
                    </a>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  className={`group relative flex flex-col gap-4 p-7 min-h-[220px] bg-surface border-r border-b border-white/[0.055] transition-colors duration-300 hover:bg-elevated ${spanClass[index] ?? 'lg:col-span-4'}`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 svc-hover-glow" />

                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10.5px] text-faint tracking-[0.06em]">
                      /{service.n}
                    </span>
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.025] text-secondary group-hover:text-accent group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300"
                      whileHover={{ rotate: [0, -10, 8, 0], scale: 1.18 }}
                      transition={{ duration: 0.38 }}
                    >
                      {Icon && <Icon className="w-4 h-4" strokeWidth={1.6} />}
                    </motion.div>
                  </div>

                  <h3 className="text-[17px] font-medium tracking-[-0.01em] text-primary leading-[1.3]">
                    {service.title}
                  </h3>
                  <p className="text-[13.5px] text-muted leading-[1.55] flex-1">
                    {service.description}
                  </p>
                  <span className="font-mono text-[13px] text-muted self-start opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent transition-all duration-300">
                    → saiba mais
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}
