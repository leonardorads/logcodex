'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ClipboardCheck, MessageCircle, ShieldCheck, Timer, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { contactHref } from '@/lib/contact'

const trustBadges = [
  { label: 'Diagnóstico operacional', Icon: ClipboardCheck },
  { label: 'Garantia de 30 dias', Icon: ShieldCheck },
  { label: 'Entrega em até 3 semanas', Icon: Timer },
]

/* ── Relatable hero visual: WhatsApp auto + site + metric ─────── */
function BusinessPreview() {
  const [replyVisible, setReplyVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReplyVisible(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.38, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="space-y-3"
    >
      {/* WhatsApp card */}
      <div className="rounded-2xl border border-white/[0.07] bg-surface overflow-hidden op-panel">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.055]">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium text-primary truncate">WhatsApp Business</div>
            <div className="text-[10.5px] text-muted">Fluxo ativo · sem plantão manual</div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#25D366]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="text-[#25D366]">ao vivo</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="p-4 space-y-2.5 min-h-[130px]">

          {/* Incoming message */}
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            <div className="bg-white/[0.055] rounded-xl rounded-tl-sm px-3 py-2 max-w-[78%]">
              <p className="text-[12.5px] text-secondary leading-[1.4]">
                Oi, tem horário amanhã para consulta?
              </p>
              <p className="text-[10px] text-muted mt-0.5 text-right">22h47</p>
            </div>
          </motion.div>

          {/* Auto-reply */}
          {replyVisible && (
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="bg-[#25D366]/[0.10] border border-[#25D366]/20 rounded-xl rounded-tr-sm px-3 py-2 max-w-[82%]">
                <p className="text-[12.5px] text-primary leading-[1.45]">
                  Olá! 😊 Temos horários às{' '}
                  <span className="font-medium">14h</span> e{' '}
                  <span className="font-medium">16h</span> amanhã.
                  Qual prefere?
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <p className="text-[10px] text-muted">22h47</p>
                  <span className="text-[10px] text-[#25D366]">✓✓</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.055] flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted">Respondido automaticamente</span>
          <span className="font-mono text-[10px] text-muted">enquanto você dormia</span>
        </div>
      </div>

      {/* Bottom row: site preview + metric */}
      <div className="grid grid-cols-2 gap-3">

        {/* Site card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.58 }}
          className="rounded-xl border border-white/[0.07] bg-surface p-4"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[10px] text-muted truncate">seunegocio.com.br</span>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="h-1.5 w-4/5 bg-primary/20 rounded-full" />
            <div className="h-1.5 w-3/5 bg-white/[0.07] rounded-full" />
            <div className="h-1.5 w-2/3 bg-white/[0.07] rounded-full" />
          </div>
          <span className="inline-flex items-center gap-1 bg-accent/12 border border-accent/20 rounded-full px-2 py-1">
            <span className="text-[10px] text-accent font-medium">Agendar →</span>
          </span>
        </motion.div>

        {/* Metric card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.68 }}
          className="rounded-xl border border-white/[0.07] bg-surface p-4 flex flex-col justify-between"
        >
          <div>
            <p className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-2">resultado</p>
            <p className="text-[34px] font-medium tracking-[-0.04em] text-primary leading-none">−3h</p>
            <p className="text-[11px] text-muted mt-1.5 leading-[1.4]">por dia em tarefas manuais</p>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5edca1]" />
            <span className="font-mono text-[10px] text-[#5edca1]">em 30 dias</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-36 pb-24">
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 pointer-events-none hero-grid-animated opacity-80" />
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.035] mix-blend-overlay" />
      <div className="hero-orb-animated" />
      <div className="hero-orb2-animated" />
      <div className="hero-top-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                >
                  <Zap className="w-3 h-3 text-accent" strokeWidth={2} />
                </motion.span>
                [ LCX ] tecnologia que trabalha por você
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-[clamp(44px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.035em] text-primary mb-7"
            >
              Sua operação funcionando
              <br />
              <span className="text-gradient">mesmo quando você não está.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-[18px] text-secondary leading-[1.55] tracking-[-0.005em] max-w-[56ch] mb-9"
            >
              Desenhamos sites, automações e fluxos com IA para tirar atendimento, agenda e captação do improviso. Menos tarefa manual. Mais cliente atendido no momento certo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex flex-wrap gap-2.5 items-center"
            >
              <Button
                variant="primary"
                size="lg"
                href={contactHref.diagnostic}
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="lg" href="#processo">
                Ver como funciona
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.46 }}
              className="mt-14 flex flex-wrap gap-2.5"
            >
              {trustBadges.map(({ label, Icon }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.52 + i * 0.08 }}
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-secondary border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 rounded-full tracking-[0.01em]"
                >
                  <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={1.7} />
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right — relatable visual */}
          <div className="hidden lg:block">
            <BusinessPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
