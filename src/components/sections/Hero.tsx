'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Globe,
  Radio,
  ShieldCheck,
  Timer,
  Workflow,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { contactHref } from '@/lib/contact'

const trustBadges = [
  { label: 'Diagnóstico operacional', Icon: ClipboardCheck },
  { label: 'Garantia de 30 dias', Icon: ShieldCheck },
  { label: 'Entrega em até 3 semanas', Icon: Timer },
]

const liveStatus = [
  {
    label: 'Entrada',
    sub: 'capturando',
    iconCls: 'text-[#5edca1]',
    subCls: 'text-[#5edca1]',
    wrapCls: 'bg-[#5edca1]/[0.09] border-[#5edca1]/[0.28]',
    pingCls: 'bg-[#5edca1]',
    Icon: Globe,
  },
  {
    label: 'Fluxos',
    sub: 'rodando',
    iconCls: 'text-accent',
    subCls: 'text-accent',
    wrapCls: 'bg-accent/[0.09] border-accent/[0.28]',
    pingCls: 'bg-accent',
    Icon: Workflow,
  },
  {
    label: 'Dados',
    sub: 'visíveis',
    iconCls: 'text-[#f5b452]',
    subCls: 'text-[#f5b452]',
    wrapCls: 'bg-[#f5b452]/[0.09] border-[#f5b452]/[0.28]',
    pingCls: 'bg-[#f5b452]',
    Icon: BarChart3,
  },
]

const flowSteps = [
  { label: 'Lead recebido', meta: 'site / formulário', status: 'ok' },
  { label: 'Triagem automática', meta: 'prioridade definida', status: 'running' },
  { label: 'Responsável acionado', meta: 'sem copiar e colar', status: 'ok' },
  { label: 'Follow-up agendado', meta: 'próxima ação clara', status: 'warn' },
]

function BusinessPreview() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % flowSteps.length)
    }, 1600)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.38, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="space-y-3"
    >
      <div className="rounded-xl border border-white/[0.09] bg-surface px-5 py-4 flex items-center justify-between">
        {liveStatus.map(({ label, sub, iconCls, subCls, wrapCls, pingCls, Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${wrapCls}`}>
              <span className="relative flex items-center justify-center">
                <span className={`absolute w-5 h-5 rounded-full animate-ping opacity-20 ${pingCls}`} />
                <Icon className={`w-4 h-4 relative z-10 ${iconCls}`} strokeWidth={1.8} />
              </span>
            </div>
            <div>
              <p className="text-[12px] font-medium text-primary leading-none">{label}</p>
              <p className={`font-mono text-[10px] mt-0.5 ${subCls}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-surface overflow-hidden op-panel">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.055]">
          <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
            <Workflow className="w-4 h-4 text-accent" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium text-primary truncate">Fluxo comercial automatizado</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3 text-[#5edca1]" strokeWidth={2} />
              <span className="text-[10.5px] text-muted">Entrada, triagem e próximo passo em ordem</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5edca1] op-live-dot" />
            <span className="text-[#5edca1]">em uso</span>
          </div>
        </div>

        <div className="p-4 space-y-2.5 min-h-[190px]">
          {flowSteps.map((step, index) => (
            <motion.div
              key={step.label}
              className={`grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                activeStep === index
                  ? 'border-accent/30 bg-accent/[0.08]'
                  : 'border-white/[0.055] bg-white/[0.018]'
              }`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.55 + index * 0.08 }}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  step.status === 'ok'
                    ? 'op-status-ok'
                    : step.status === 'running'
                      ? 'op-status-running'
                      : 'op-status-warn'
                }`}
              />
              <div className="min-w-0">
                <p className="text-[12.5px] text-primary font-medium leading-none truncate">{step.label}</p>
                <p className="text-[10.5px] text-muted mt-1 truncate">{step.meta}</p>
              </div>
              {activeStep === index ? (
                <span className="font-mono text-[10px] text-accent">agora</span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-muted" strokeWidth={1.8} />
              )}
            </motion.div>
          ))}
        </div>

        <div className="px-4 py-2.5 border-t border-white/[0.055] flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted">Pipeline sem tarefa solta</span>
          <span className="font-mono text-[10px] text-muted">status atualizado</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.58 }}
          className="rounded-xl border border-white/[0.07] bg-surface p-4"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-muted truncate">mini dashboard</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {[42, 68, 54, 76, 61, 83].map((height, index) => (
              <span
                key={index}
                className="block rounded-sm bg-accent/50"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 bg-accent/12 border border-accent/20 rounded-full px-2 py-1">
            <Database className="w-3 h-3 text-accent" strokeWidth={1.7} />
            <span className="text-[10px] text-accent font-medium">dados úteis</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.68 }}
          className="rounded-xl border border-white/[0.07] bg-surface p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-muted uppercase tracking-[0.08em]">resultado</p>
              <Activity className="w-3.5 h-3.5 text-[#5edca1] animate-pulse" strokeWidth={2} />
            </div>
            <p className="text-[34px] font-medium tracking-[-0.04em] text-primary leading-none">−3h</p>
            <p className="text-[11px] text-muted mt-1.5 leading-[1.4]">estimadas em rotina operacional</p>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5edca1]" />
            <span className="font-mono text-[10px] text-[#5edca1]">após mapeamento</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const gradientRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = gradientRef.current
      if (!el) return
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.opacity = '1'
    }
    const onLeave = () => {
      if (gradientRef.current) gradientRef.current.style.opacity = '0'
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const container = rippleRef.current
      if (!container) return
      const span = document.createElement('span')
      span.className = 'ds-ripple'
      span.style.left = `${e.clientX}px`
      span.style.top = `${e.clientY}px`
      container.appendChild(span)
      setTimeout(() => span.remove(), 950)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-36 pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#08080a] to-slate-900/80" />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="lcxBaseGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lcxBaseGrid)" />
        <line x1="0" y1="22%" x2="100%" y2="22%" stroke="rgba(99,102,241,0.35)" className="ds-grid-line ds-gl-1" />
        <line x1="0" y1="78%" x2="100%" y2="78%" stroke="rgba(99,102,241,0.25)" className="ds-grid-line ds-gl-2" />
        <line x1="18%" y1="0" x2="18%" y2="100%" stroke="rgba(99,102,241,0.28)" className="ds-grid-line ds-gl-3" />
        <line x1="82%" y1="0" x2="82%" y2="100%" stroke="rgba(99,102,241,0.28)" className="ds-grid-line ds-gl-4" />
        <circle cx="18%" cy="22%" r="3" fill="#6366f1" className="ds-detail-dot ds-dd-1" />
        <circle cx="82%" cy="22%" r="3" fill="#6366f1" className="ds-detail-dot ds-dd-2" />
        <circle cx="18%" cy="78%" r="3" fill="#a855f7" className="ds-detail-dot ds-dd-3" />
        <circle cx="82%" cy="78%" r="3" fill="#a855f7" className="ds-detail-dot ds-dd-4" />
        <circle cx="50%" cy="50%" r="2.5" fill="#5edca1" className="ds-detail-dot ds-dd-5" />
      </svg>

      <div className="hero-orb-animated" />
      <div className="hero-top-line" />

      <div className="ds-corner ds-corner-tl"><span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-accent/70" /></div>
      <div className="ds-corner ds-corner-tr"><span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-accent/70" /></div>
      <div className="ds-corner ds-corner-bl"><span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-accent/70" /></div>
      <div className="ds-corner ds-corner-br"><span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent/70" /></div>

      <span className="ds-float-dot ds-fd-1" />
      <span className="ds-float-dot ds-fd-2" />
      <span className="ds-float-dot ds-fd-3" />
      <span className="ds-float-dot ds-fd-4" />
      <span className="ds-float-dot ds-fd-5" />
      <span className="ds-float-dot ds-fd-6" />
      <span className="ds-float-dot ds-fd-7" />
      <span className="ds-float-dot ds-fd-8" />

      <div ref={gradientRef} className="ds-mouse-gradient w-96 h-96 blur-3xl" />
      <div ref={rippleRef} className="contents" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2.5 bg-accent/[0.10] border border-accent/[0.28] rounded-full px-4 py-2 shadow-[0_0_24px_rgba(99,102,241,0.18)]">
                <span className="relative flex items-center justify-center w-4 h-4">
                  <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                  <Radio className="w-3.5 h-3.5 text-accent relative z-10" strokeWidth={2} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary">
                  [ LCX ] tecnologia que trabalha por você
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 16 }}
              animate={{ y: 0 }}
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
              <Button variant="primary" size="lg" href={contactHref.diagnostic}>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
                  <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={1.7} />
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <BusinessPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
