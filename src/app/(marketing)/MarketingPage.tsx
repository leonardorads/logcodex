'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContactModal } from './ContactModal'
import { ShaderBackground } from './ShaderBackground'
import { FleetChat } from './FleetChat'

const ROTATING_WORDS = ['inteligente', 'automatizada', 'conectada', 'escalável', 'em tempo real']

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="7" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <path d="M9 8.5 V21.5 H15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.5 11.6 A5 5 0 0 0 18.5 11.6 V18.4 A5 5 0 0 0 23.5 18.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export function MarketingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const openModal = (e: React.MouseEvent) => { e.preventDefault(); setModalOpen(true) }

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const nav = document.getElementById('lcx-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '-60px', threshold: 0.05 }
    )
    document.querySelectorAll('.lcx-root .reveal').forEach((el) => io.observe(el))
    const t = setTimeout(
      () => document.querySelectorAll('.lcx-root .reveal').forEach((el) => el.classList.add('in')),
      1200
    )

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="lcx-root">
      <style>{`.lcx-root .reveal{opacity:0;transform:translateY(20px);transition:opacity 1s var(--ease),transform 1s var(--ease)}.lcx-root .reveal.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.lcx-root .reveal{opacity:1;transform:none;transition:none}}`}</style>
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Nav */}
      <nav id="lcx-nav">
        <a href="#" className="brand">
          <LogoMark />
          LogCodex
        </a>
        <div className="nav-links">
          <a href="#produto" onClick={(e) => { e.preventDefault(); document.getElementById('produto')?.scrollIntoView({ behavior: 'smooth' }) }}>Produto</a>
          <a href="#metodo" onClick={(e) => { e.preventDefault(); document.getElementById('metodo')?.scrollIntoView({ behavior: 'smooth' }) }}>Como trabalhamos</a>
          <a href="#roadmap" onClick={(e) => { e.preventDefault(); document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' }) }}>Roadmap</a>
          <a href="#investimento" onClick={(e) => { e.preventDefault(); document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' }) }}>Planos</a>
        </div>
        <a href="#" className="nav-cta" onClick={openModal}>Testar grátis</a>
      </nav>

      {/* HERO + CHAT integrados */}
      <style>{`
        .hero-section { align-items: center; }
        .hero-inner { padding: clamp(64px,8vh,80px) clamp(20px,5vw,40px) clamp(40px,5vh,60px); }
        @media (max-width: 640px) {
          .hero-section { align-items: flex-start; padding: 0 !important; }
          .hero-inner { padding: 72px 20px 32px; }
          .hero-ctas { gap: 8px; margin-bottom: 20px !important; }
          .hero-ctas a { padding: 11px 20px !important; font-size: 14px !important; }
          .hero-badges { gap: 16px; margin-top: 20px !important; }
        }
      `}</style>
      <section className="hero hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex' }}>
        <ShaderBackground />

        {/* overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,13,15,0.68) 0%, rgba(12,13,15,0.50) 50%, rgba(12,13,15,0.88) 100%)', zIndex: 1 }} />

        <div className="hero-inner" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>

          {/* badge pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
            LogCodex Fleet · Controle de frota com IA
          </motion.div>

          {/* headline com palavra rotativa */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(40px, 8vw, 92px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: '16px', color: '#fff' }}
          >
            Sua logística{' '}
            <span style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', height: '1.1em', verticalAlign: 'bottom', minWidth: 'min(300px, 70vw)' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: -60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', color: 'transparent', backgroundImage: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 28px' }}
          >
            O Fleet conecta frota, motoristas e financeiro em um só sistema — e entrega o número real de cada operação, em tempo real.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="hero-ctas"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}
          >
            <a href="#" onClick={openModal} style={{ padding: '13px 28px', borderRadius: '10px', background: '#fff', color: '#0c0d0f', fontSize: '15px', fontWeight: 700, textDecoration: 'none', transition: 'transform .15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Testar grátis</a>
            <a href="#metodo" style={{ padding: '13px 28px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)', fontSize: '15px', fontWeight: 500, textDecoration: 'none', transition: 'transform .15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Ver como funciona</a>
          </motion.div>

          {/* CHAT dentro do hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
          >
            <FleetChat onOpenContact={() => setModalOpen(true)} />
          </motion.div>

          {/* badges de prova */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hero-badges"
            style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '28px' }}
          >
            {[
              { label: 'Operação documentada', sub: 'Cada viagem registrada em tempo real' },
              { label: 'Controle de bordo automatizado', sub: 'Motorista no celular, sem papel' },
              { label: '7 dias grátis', sub: 'Sem cartão de crédito' },
              { label: 'Seus dados, seus', sub: 'Export Excel quando quiser' },
            ].map(({ label, sub }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SCREENSHOT — ASSISTENTE FLEET (grid texto + GIF lado a lado) */}
      <style>{`
        .assistant-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        @media (max-width: 768px) { .assistant-grid { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>
      <section className="assistant-grid" style={{ padding: '60px clamp(16px,4vw,40px) 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reveal">
          <p className="eyebrow" style={{ marginBottom: '16px' }}>Assistente Fleet · IA</p>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Pergunta em português.<br /><span style={{ color: 'var(--ink-3)' }}>Resposta em segundos.</span>
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            "Quanto gastei com combustível em maio?" — O assistente consulta os dados reais da operação e responde com contexto completo: despesas, viagens, motoristas. Sem abrir relatório.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Controle de frota', 'Acertos com motoristas', 'Despesas por viagem', 'Margem por rota', 'Assistente IA'].map(tag => (
              <span key={tag} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid var(--line)', color: 'var(--ink-3)', letterSpacing: '.04em' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="reveal lcx-laptop" style={{ maxWidth: '510px', margin: '0 auto' }}>
          <div className="lcx-laptop-frame">
            <div className="lcx-laptop-bar">
              <div className="lcx-laptop-dot lcx-dot-red" />
              <div className="lcx-laptop-dot lcx-dot-yellow" />
              <div className="lcx-laptop-dot lcx-dot-green" />
            </div>
            <div className="lcx-laptop-screen">
              <video
                src={`${BASE}/screenshots/logcodex-fleet-assistant_2.mp4`}
                autoPlay muted loop playsInline preload="metadata"
                aria-label="Assistente Fleet — chat IA com dados reais da operação"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
          <div className="lcx-laptop-base" />
          <div className="lcx-laptop-foot" />
        </div>
      </section>

      {/* SCREENSHOT — VIAGENS */}
      <section style={{ padding: '0 clamp(16px,4vw,40px) 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>Viagens · Rotas</p>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: '10px' }}>
            Cada viagem documentada. <em style={{ fontStyle: 'normal', color: 'var(--ink-3)' }}>Em menos de 5 minutos.</em>
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Origem, destino, KM e valor do frete registrados em segundos. O custo real sai calculado automaticamente — sem planilha, sem surpresa no caixa.
          </p>
        </div>
        <div className="reveal lcx-laptop">
          <div className="lcx-laptop-frame">
            <div className="lcx-laptop-bar">
              <div className="lcx-laptop-dot lcx-dot-red" />
              <div className="lcx-laptop-dot lcx-dot-yellow" />
              <div className="lcx-laptop-dot lcx-dot-green" />
            </div>
            <div className="lcx-laptop-screen">
              <video
                src={`${BASE}/screenshots/logcodex-fleet-viagens.mp4`}
                autoPlay muted loop playsInline preload="metadata"
                aria-label="Dashboard LogCodex Fleet — viagens em tempo real"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
          <div className="lcx-laptop-base" />
          <div className="lcx-laptop-foot" />
        </div>
      </section>

      {/* STATEMENT 01 */}
      <section className="stmt">
        <span className="stmt-num">/01 · Tese</span>
        <div className="wrap reveal">
          <p>
            O problema raramente <strong>é falta de sistema.</strong><br />
            É operação rodando <em>no escuro.</em>
          </p>
        </div>
      </section>

      {/* PRODUTO — antes "services" */}
      <section className="services" id="produto">
        <div className="wrap">
          <div className="services-head reveal">
            <div>
              <p className="eyebrow">Produto · 01</p>
              <h2 className="section-title">O que o Fleet<br /><em>resolve na operação.</em></h2>
            </div>
            <p className="section-sub">
              Cada função nasce da rotina real de uma transportadora. Não é dashboard bonito — é o número que você precisa pra decidir se fecha o frete ou não.
            </p>
          </div>

          <div className="svc-list">
            <div className="svc-row reveal">
              <span className="svc-n">/01</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span className="svc-name">Viagens e rotas documentadas</span>
              <span className="svc-desc">Origem, destino, KM, despesas. Cada viagem fica registrada com custo real calculado automaticamente.</span>
              <span className="svc-arrow">→</span>
            </div>
            <div className="svc-row reveal">
              <span className="svc-n">/02</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="svc-name">Acertos com motoristas</span>
              <span className="svc-desc">Proposta menos despesas igual acerto. Motorista vê tudo, aprova, recebe. Sem planilha, sem discussão.</span>
              <span className="svc-arrow">→</span>
            </div>
            <div className="svc-row reveal">
              <span className="svc-n">/03</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg>
              <span className="svc-name">Despesas e combustível</span>
              <span className="svc-desc">Diesel, ARLA, pedágio, manutenção. Controle de custo por veículo e por viagem, sem surpresa no caixa.</span>
              <span className="svc-arrow">→</span>
            </div>
            <div className="svc-row reveal">
              <span className="svc-n">/04</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="svc-name">Assistente Fleet (IA)</span>
              <span className="svc-desc">Pergunta em linguagem natural: "quanto faturei essa semana?". Resposta com contexto real, em segundos.</span>
              <span className="svc-arrow">→</span>
            </div>
            <div className="svc-row reveal">
              <span className="svc-n">/05</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <span className="svc-name">Painéis operacionais</span>
              <span className="svc-desc">Viagens ativas, faturamento, margem por rota, acertos pendentes. Decisão sem esperar relatório.</span>
              <span className="svc-arrow">→</span>
            </div>
            <div className="svc-row reveal">
              <span className="svc-n">/06</span>
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
              <span className="svc-name">Propostas e clientes</span>
              <span className="svc-desc">Da cotação ao fechamento. Proposta com validade, endereço de rota e cliente — tudo amarrado à viagem.</span>
              <span className="svc-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* SCREENSHOT — FINANCEIRO */}
      <section style={{ padding: '0 clamp(16px,4vw,40px) 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>Financeiro · Acertos</p>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: '10px' }}>
            Acerto com motorista. <em style={{ fontStyle: 'normal', color: 'var(--ink-3)' }}>Sem discussão.</em>
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Proposta menos despesas igual a acerto. O motorista vê o número, aprova e recebe. Sem planilha refeita à mão.
          </p>
        </div>
        <div className="reveal lcx-laptop">
          <div className="lcx-laptop-frame">
            <div className="lcx-laptop-bar">
              <div className="lcx-laptop-dot lcx-dot-red" />
              <div className="lcx-laptop-dot lcx-dot-yellow" />
              <div className="lcx-laptop-dot lcx-dot-green" />
            </div>
            <div className="lcx-laptop-screen">
              <video
                src={`${BASE}/screenshots/logcodex-fleet-financeiro.mp4`}
                autoPlay muted loop playsInline preload="metadata"
                aria-label="LogCodex Fleet — acertos financeiros com motoristas"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
          <div className="lcx-laptop-base" />
          <div className="lcx-laptop-foot" />
        </div>
      </section>

      {/* SCREENSHOT — ASSISTENTE (removido — bloco já existe acima com layout grid) */}
      <section style={{ display: 'none' }}>
        <div className="reveal lcx-laptop" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="lcx-laptop-frame">
            <div className="lcx-laptop-bar">
              <div className="lcx-laptop-dot lcx-dot-red" />
              <div className="lcx-laptop-dot lcx-dot-yellow" />
              <div className="lcx-laptop-dot lcx-dot-green" />
            </div>
            <div className="lcx-laptop-screen">
              <video
                src={`${BASE}/screenshots/logcodex-fleet-assistant_2.mp4`}
                autoPlay muted loop playsInline preload="metadata"
                aria-label="Assistente Fleet — chat IA com dados reais da operação"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
          <div className="lcx-laptop-base" />
          <div className="lcx-laptop-foot" />
        </div>
      </section>

      {/* STATEMENT 02 */}
      <section className="stmt">
        <span className="stmt-num">/02 · Princípio</span>
        <div className="wrap reveal">
          <p>
            Seu trabalho <strong>não muda.</strong><br />
            Só fica <em>mais claro.</em>
          </p>
        </div>
      </section>

      {/* COMO TRABALHAMOS — personalização e mapeamento */}
      <section className="process" id="metodo">
        <div className="wrap-narrow">
          <div className="process-head reveal">
            <p className="eyebrow">Como trabalhamos · 02</p>
            <h2 className="section-title">Sistema pronto.<br /><em>Moldado pra sua operação.</em></h2>
          </div>
          <p className="reveal" style={{ color: 'var(--ink-3)', fontSize: '17px', lineHeight: 1.8, maxWidth: '640px', marginBottom: '64px' }}>
            A LogCodex não entrega software genérico. Temos a base construída — estável, testada, em produção. O que fazemos é mapear <strong>como você opera hoje</strong> e configurar os módulos certos para o seu contexto. Você usa o que resolve, sem pagar por o que não precisa.
          </p>

          <div className="timeline">
            <div className="tl-step now reveal">
              <span className="tl-num">/01 · diagnóstico</span>
              <h3 className="tl-title">Mapeamento da operação</h3>
              <p className="tl-desc">Antes de qualquer configuração, entendemos como sua frota funciona hoje — rotas, motoristas, custos recorrentes, como você fecha o acerto. <strong>O mapa da sua operação vira a base do seu sistema.</strong></p>
            </div>
            <div className="tl-step reveal">
              <span className="tl-num">/02 · configuração</span>
              <h3 className="tl-title">Sistema personalizado no seu ritmo</h3>
              <p className="tl-desc">Ativamos os módulos que fazem sentido para o seu tamanho e volume. Pequena transportadora ou frota maior — a estrutura se adapta. <strong>Você não começa do zero, você começa no ponto certo.</strong></p>
            </div>
            <div className="tl-step reveal">
              <span className="tl-num">/03 · onboarding</span>
              <h3 className="tl-title">Você entra operando</h3>
              <p className="tl-desc">Cadastro da frota, motoristas e primeiras viagens feito junto com a gente. Importamos o que você já tem. <strong>Em menos de um dia, o sistema reflete sua realidade — não uma realidade genérica.</strong></p>
            </div>
            <div className="tl-step reveal">
              <span className="tl-num">/04 · evolução contínua</span>
              <h3 className="tl-title">Novos recursos conforme você cresce</h3>
              <p className="tl-desc">Mapeamos suas necessidades periodicamente. Novos módulos — rotas, pátio, financeiro — são ativados conforme sua operação exige. <strong>O sistema cresce com você, não na frente de você.</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP — about adaptado para visão LogCodex */}
      <section className="about" id="roadmap" style={{ padding: '200px 40px', borderTop: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div className="services-head reveal" style={{ marginBottom: '64px' }}>
            <div>
              <p className="eyebrow">Roadmap · 05</p>
              <h2 className="section-title">Fleet é o começo.<br /><em>A logística inteira vem aí.</em></h2>
            </div>
            <p className="section-sub">
              A LogCodex desenvolve sistemas para toda a operação logística. O Fleet — controle de frota — é o primeiro módulo disponível. Os próximos seguem a mesma tese: tecnologia que reduz ruído operacional, não que adiciona camada.
            </p>
          </div>

          <div className="svc-list">
            <div className="svc-row reveal" style={{ cursor: 'default' }}>
              <span className="svc-n">AGORA</span>
              <span />
              <span className="svc-name">Fleet — Controle de frota</span>
              <span className="svc-desc">Viagens, acertos, despesas, propostas e assistente de IA. Disponível agora.</span>
              <span className="svc-arrow" style={{ color: 'var(--accent)' }}>●</span>
            </div>
            <div className="svc-row reveal" style={{ cursor: 'default' }}>
              <span className="svc-n">PRÓXIMO</span>
              <span />
              <span className="svc-name">Otimização de rotas</span>
              <span className="svc-desc">Roteirização inteligente: menor custo, menor KM, melhor sequência de entregas.</span>
              <span className="svc-arrow">○</span>
            </div>
            <div className="svc-row reveal" style={{ cursor: 'default' }}>
              <span className="svc-n">EM BREVE</span>
              <span />
              <span className="svc-name">Gestão de pátio</span>
              <span className="svc-desc">Controle de entrada, saída e posição de veículos e carretas no pátio.</span>
              <span className="svc-arrow">○</span>
            </div>
            <div className="svc-row reveal" style={{ cursor: 'default' }}>
              <span className="svc-n">EM BREVE</span>
              <span />
              <span className="svc-name">Gestão de armazém</span>
              <span className="svc-desc">Estoque, posições, separação e expedição integrados à operação de transporte.</span>
              <span className="svc-arrow">○</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTIMENTO — planos Fleet */}
      <section className="invest" id="investimento">
        <div className="wrap">
          <div className="services-head reveal">
            <div>
              <p className="eyebrow">Planos · 06</p>
              <h2 className="section-title">Comece grátis.<br /><em>Pague quando valer.</em></h2>
            </div>
            <p className="section-sub">
              7 dias de teste completo, sem cartão. Depois, escolha o plano pelo volume de viagens. Sem contrato trancado, cancela quando quiser, dados sempre seus.
            </p>
          </div>

          <div className="invest-grid">
            <div className="inv-card reveal">
              <h3>Starter</h3>
              <p className="tagline">Para transportadoras começando a sair da planilha.</p>
              <p className="price">R$ 99<span style={{ fontSize: '18px', color: 'var(--ink-3)' }}>/mês</span></p>
              <p className="price-meta">até 10 veículos · motoristas ilimitados</p>
              <ul>
                <li>Viagens, despesas e acertos</li>
                <li>Painel operacional completo</li>
                <li>Assistente Fleet (IA)</li>
                <li>Suporte por e-mail</li>
              </ul>
              <a href="#" className="cta" onClick={openModal}>Testar grátis</a>
            </div>
            <div className="inv-card featured reveal">
              <span className="feat-tag">Mais usado</span>
              <h3>Profissional</h3>
              <p className="tagline">Para frota que já roda no volume e precisa de controle.</p>
              <p className="price">R$ 299<span style={{ fontSize: '18px', color: 'var(--ink-3)' }}>/mês</span></p>
              <p className="price-meta">até 50 veículos · motoristas ilimitados</p>
              <ul>
                <li>Tudo do Starter</li>
                <li>Relatórios avançados e fluxo mensal</li>
                <li>Propostas e gestão de clientes</li>
                <li>Suporte prioritário</li>
              </ul>
              <a href="#" className="cta" onClick={openModal}>Testar grátis</a>
            </div>
            <div className="inv-card reveal">
              <h3>Sob demanda</h3>
              <p className="tagline">Para grandes operações com necessidade de integração.</p>
              <p className="price">Customizado</p>
              <p className="price-meta">acima de 50 veículos</p>
              <ul>
                <li>Tudo do Profissional</li>
                <li>Integrações customizadas</li>
                <li>SLA garantido</li>
                <li>Suporte dedicado</li>
              </ul>
              <a href="mailto:leonardo.antunes@logcodex.com" className="cta">Falar com a gente</a>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13.5px', color: 'var(--ink-3)', fontWeight: 300 }}>
            7 dias grátis sem cartão · cancela quando quiser · seus dados exportáveis em Excel
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="wrap">
          <div className="faq-grid">
            <div className="reveal">
              <p className="eyebrow">FAQ · 07</p>
              <h2 className="section-title">Antes de testar,<br /><em>vale saber.</em></h2>
            </div>

            <div className="faq-list reveal">
              <details className="faq-item">
                <summary>Preciso de cartão de crédito pra testar?</summary>
                <p className="ans">Não. São 7 dias grátis com o sistema completo, só com seu e-mail. Você decide se continua depois — sem cobrança automática surpresa.</p>
              </details>
              <details className="faq-item">
                <summary>Posso trazer meus dados de outro sistema ou planilha?</summary>
                <p className="ans">Sim. Você importa veículos, motoristas e clientes de um CSV ou Excel. A gente orienta o processo no início pra você não recomeçar do zero.</p>
              </details>
              <details className="faq-item">
                <summary>Como funciona o acerto com o motorista?</summary>
                <p className="ans">O sistema parte da proposta da viagem, subtrai as despesas registradas (combustível, pedágio, manutenção) e calcula o acerto. O motorista vê o número, confere e aprova — sem planilha refeita à mão.</p>
              </details>
              <details className="faq-item">
                <summary>O Fleet funciona com meu app de rastreamento?</summary>
                <p className="ans">Integração com apps de rastreamento é parte do roadmap. Hoje o registro de viagem é feito pelo painel ou pelo assistente de chat. Conforme novos módulos da LogCodex entram, as integrações crescem.</p>
              </details>
              <details className="faq-item">
                <summary>E se eu cancelar? Perco meus dados?</summary>
                <p className="ans">Não. Seus dados saem com você em Excel a qualquer momento. Sem resgate de dados, sem trava, sem contrato de fidelidade.</p>
              </details>
              <details className="faq-item">
                <summary>A LogCodex só faz o Fleet?</summary>
                <p className="ans">O Fleet é o primeiro módulo, focado em controle de frota. A LogCodex desenvolve sistemas para toda a operação logística — otimização de rotas, gestão de pátio e armazém estão no roadmap.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section className="closer" id="contato">
        <div className="closer-content">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Comece agora</p>
          <h2 className="reveal"><strong>Saiba</strong> quanto ganha<br /><em>em cada viagem.</em></h2>
          <p className="reveal">
            Teste o Fleet grátis por 7 dias. Cadastre sua frota, registre as primeiras viagens e veja o número real aparecer. Sem cartão, sem compromisso.
          </p>
          <a href="#" className="btn btn-primary reveal" onClick={openModal}>
            Testar grátis →
          </a>
          <p className="fine reveal">7 dias grátis · sem cartão de crédito · seus dados sempre seus</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="fgrid">
            <div>
              <a href="#" className="brand">
                <LogoMark />
                LogCodex
              </a>
              <p className="ftag">Engenharia de operação. Em código. Sistemas para a logística que cresceu além da planilha.</p>
            </div>
            <div>
              <h5>Produto</h5>
              <ul>
                <li><a href="#produto">O que o Fleet faz</a></li>
                <li><a href="#metodo">Como funciona</a></li>
                <li><a href="#investimento">Planos</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h5>Contato</h5>
              <ul>
                <li><a href="mailto:leonardo.antunes@logcodex.com">leonardo.antunes@logcodex.com</a></li>
                <li><a href="#" onClick={openModal}>Testar grátis</a></li>
              </ul>
            </div>
            <div>
              <h5>Critério</h5>
              <p className="ftag" style={{ marginTop: 0 }}>Operação primeiro, código depois. Tecnologia só entra quando reduz ruído na sua rotina.</p>
            </div>
          </div>
          <div className="flegal">
            <span>© 2026 LogCodex · BR</span>
            <span>Frota · rotas · pátio · armazém</span>
            <span>logcodex.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
