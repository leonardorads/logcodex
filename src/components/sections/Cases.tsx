'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cases, caseCategories } from '@/lib/data/cases'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

/* ─── CSS-art preview mockups ─── */
function CasePreview({ kind }: { kind: string }) {
  const cardStyle = 'bg-surface border border-white/[0.055] rounded-lg p-3'

  switch (kind) {
    case 'dash':
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10.5px] text-muted">OPS · DASH</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['R$', '184k'], ['Pedidos', '1.243'], ['SLA', '99.4%']].map(([l, v]) => (
              <div key={l} className={cardStyle}>
                <div className="font-mono text-[9px] text-faint uppercase tracking-[0.1em]">{l}</div>
                <div className="text-[17px] font-medium text-primary mt-1 tracking-tight">{v}</div>
              </div>
            ))}
          </div>
          <div className={`${cardStyle} flex-1 flex items-end`}>
            <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-14">
              <path d="M0 50 L20 38 L40 42 L60 28 L80 32 L100 18 L120 24 L140 12 L160 20 L180 8 L200 14" stroke="#6366f1" strokeWidth="1.5" fill="none" />
              <path d="M0 50 L20 38 L40 42 L60 28 L80 32 L100 18 L120 24 L140 12 L160 20 L180 8 L200 14 L200 60 L0 60 Z" fill="#6366f1" opacity="0.08" />
            </svg>
          </div>
        </div>
      )

    case 'flow':
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-3">
          <span className="font-mono text-[10.5px] text-muted">FLOW · ONBOARDING</span>
          <div className="flex-1 flex items-center justify-center gap-2">
            {['CRM', 'GPT-4o', 'Email', 'Slack'].map((n, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className="font-mono text-[11px] text-secondary border border-white/[0.055] rounded px-2 py-1.5 bg-surface">
                  {n}
                </div>
                {i < 3 && <span className="w-4 h-px bg-accent/40" />}
              </div>
            ))}
          </div>
          <div className="font-mono text-[11px] text-muted border border-white/[0.055] rounded px-3 py-2 bg-surface">
            ✓ checklist 7/9 · próximo: agendar kickoff
          </div>
        </div>
      )

    case 'cal':
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-2.5">
          <span className="font-mono text-[10.5px] text-muted">SCHED · OUT 2026</span>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`rounded text-[10px] font-mono p-1 text-right flex items-center justify-center border ${
                  i === 12
                    ? 'bg-accent text-base border-accent'
                    : 'bg-surface border-white/[0.055] text-muted'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )

    case 'site':
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 border border-white/[0.055] rounded-lg px-2.5 py-2 bg-surface">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[10px] text-muted">cliente.com.br</span>
          </div>
          <div className="flex-1 border border-white/[0.055] rounded-lg p-3.5 bg-surface flex flex-col gap-2">
            <div className="h-2 w-3/5 bg-secondary/40 rounded" />
            <div className="h-1.5 w-4/5 bg-white/[0.07] rounded" />
            <div className="h-1.5 w-2/3 bg-white/[0.07] rounded" />
            <div className="mt-2 self-start px-3 py-1.5 rounded-full bg-accent text-base text-[10px] font-semibold">
              Solicitar proposta →
            </div>
          </div>
        </div>
      )

    case 'chat':
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-3">
          <span className="font-mono text-[10.5px] text-muted">AGENT · CLAUDE 4.5</span>
          <div className="border border-white/[0.055] rounded-lg p-3 bg-surface text-[11.5px] text-muted flex-1 flex flex-col gap-2.5">
            <div>&ldquo;Como faço pra alterar a cobrança?&rdquo;</div>
            <div className="border-l-2 border-accent pl-2.5 text-secondary">
              Você pode trocar o método em{' '}
              <span className="text-primary">Conta · Faturamento</span>. Quer que eu abra?
            </div>
          </div>
          <div className="flex gap-1.5">
            {['resp 0.8s', 'conf 94%'].map((t) => (
              <span key={t} className="font-mono text-[10px] text-muted border border-white/[0.055] rounded px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      )

    case 'rev': {
      const barClasses = [
        'h-[28%]', 'h-[36%]', 'h-[33%]', 'h-[42%]',
        'h-[50%]', 'h-[48%]', 'h-[58%]', 'h-[64%]', 'h-[72%]',
      ]
      return (
        <div className="absolute inset-0 p-5 flex flex-col gap-2.5">
          <span className="font-mono text-[10.5px] text-muted">FIN · MRR</span>
          <div className="flex-1 border border-white/[0.055] rounded-lg p-3 bg-surface flex items-end gap-1.5">
            {barClasses.map((hClass, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${hClass} ${i === 8 ? 'bg-accent' : 'bg-white/[0.07]'}`}
              />
            ))}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-muted">
            <span>jan</span><span>set</span>
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

export function Cases() {
  const [active, setActive] = useState('Todos')
  const filtered = active === 'Todos' ? cases : cases.filter((c) => c.category === active)

  return (
    <section id="cases" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">

        {/* Two-column section header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-12">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 04 ] Trabalho
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary">
              Sistemas em produção, com métrica e com nome.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-[16px] text-secondary leading-[1.55] max-w-[52ch]">
              Recortes de projetos recentes — cada um com a métrica que decidimos perseguir antes de
              começar. Os clientes têm nome; alguns pediram pra ficar fora desta página.
            </p>
          </AnimatedSection>
        </div>

        {/* Filter chips */}
        <AnimatedSection delay={0.1} className="flex flex-wrap gap-2 mb-8">
          {caseCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] transition-all duration-200 cursor-pointer border ${
                active === cat
                  ? 'text-primary bg-surface border-white/[0.12] shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]'
                  : 'text-muted border-white/[0.055] hover:text-primary hover:border-white/[0.12]'
              }`}
            >
              {cat}
              {active === cat && (
                <span className="ml-2 font-mono text-[10px] text-muted">{filtered.length}</span>
              )}
            </button>
          ))}
        </AnimatedSection>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, delay: index * 0.06 }}
                className="group border border-white/[0.055] rounded-2xl bg-surface overflow-hidden flex flex-col hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Preview area */}
                <div className="relative h-[240px] bg-base-2 border-b border-white/[0.055] overflow-hidden">
                  <div className="absolute inset-0 case-preview-grid" />
                  <div className="absolute inset-0 case-preview-glow" />
                  <CasePreview kind={item.preview} />
                </div>

                {/* Meta */}
                <div className="p-6 flex flex-col gap-3.5 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-secondary border border-white/[0.055] bg-elevated px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="font-mono text-[10.5px] text-faint tracking-[0.08em]">
                      CASE_{item.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-[19px] font-medium tracking-[-0.018em] text-primary">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-muted leading-[1.55] max-w-[52ch] flex-1">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((tech) => (
                      <span key={tech} className="font-mono text-[10.5px] text-muted border border-white/[0.055] bg-white/[0.012] px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.055]">
                    <div className="flex items-center gap-2 text-[12.5px] text-primary">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      {item.impact}
                    </div>
                    <span className="font-mono text-[11px] text-muted uppercase tracking-[0.06em] group-hover:text-accent transition-colors">
                      Ler caso →
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
