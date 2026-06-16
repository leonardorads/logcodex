'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContactModal } from '../ContactModal'
import { FleetChat } from '../FleetChat'
import { ShaderBackground } from '../ShaderBackground'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none" width="26" height="26">
    <rect width="32" height="32" rx="7" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <path d="M9 8.5 V21.5 H15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.5 11.6 A5 5 0 0 0 18.5 11.6 V18.4 A5 5 0 0 0 23.5 18.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const Check = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
    <circle cx="8.5" cy="8.5" r="8.5" fill="#22c55e" fillOpacity="0.14" />
    <path d="M5 8.8 L7.2 11 L12 6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const X = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
    <circle cx="8.5" cy="8.5" r="8.5" fill="#ef4444" fillOpacity="0.12" />
    <path d="M5.5 5.5 L11.5 11.5 M11.5 5.5 L5.5 11.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ROTATING_WORDS = ['sem planilha', 'no celular', 'em tempo real', 'com IA']

export function FleetLanding() {
  const [modalOpen, setModalOpen] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const openModal = (e: React.MouseEvent) => { e.preventDefault(); setModalOpen(true) }

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const nav = document.getElementById('fl-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const io = new IntersectionObserver(
      (es) => { for (const e of es) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } } },
      { rootMargin: '-40px', threshold: 0.05 }
    )
    document.querySelectorAll('.fl-root .rev').forEach((el) => io.observe(el))
    const t = setTimeout(() => document.querySelectorAll('.fl-root .rev').forEach((el) => el.classList.add('in')), 1400)

    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); clearTimeout(t) }
  }, [])

  return (
    <div className="fl-root">
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        :root{--fl-bg:#090b0f;--fl-bg2:#0d1018;--fl-bg3:#131720;--fl-line:#1d2335;--fl-ink:#f1f5f9;--fl-ink2:#94a3b8;--fl-ink3:#475569;--fl-accent:#6366f1;--fl-green:#22c55e;--fl-red:#ef4444;--fl-amber:#f59e0b;--fl-ease:cubic-bezier(.16,1,.3,1)}
        .fl-root{background:var(--fl-bg);color:var(--fl-ink);min-height:100vh;font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .fl-root *{box-sizing:border-box;margin:0;padding:0}
        /* NAV */
        #fl-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;transition:background .3s,backdrop-filter .3s}
        #fl-nav.scrolled{background:rgba(9,11,15,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--fl-line)}
        .fl-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:#fff;text-decoration:none;letter-spacing:-.01em}
        .fl-brand svg{filter:drop-shadow(0 0 8px rgba(99,102,241,.5))}
        .fl-nav-cta{background:var(--fl-accent);color:#fff;padding:10px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:.01em;transition:opacity .15s}
        .fl-nav-cta:hover{opacity:.88}

        /* HERO */
        .fl-hero{padding:130px 40px 80px;text-align:center;max-width:860px;margin:0 auto}
        .fl-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.28);color:#a5b4fc;padding:6px 16px;border-radius:100px;font-size:12.5px;font-weight:600;margin-bottom:28px;letter-spacing:.06em}
        .fl-hero-badge .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 7px #22c55e;animation:pulse 2.2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .fl-hero h1{font-size:clamp(38px,7.5vw,82px);line-height:1.04;font-weight:800;letter-spacing:-.035em;margin-bottom:22px;color:#fff}
        .fl-hero h1 em{font-style:normal;color:rgba(255,255,255,.38)}
        .fl-hero-sub{font-size:clamp(16px,2vw,20px);color:var(--fl-ink2);line-height:1.65;max-width:580px;margin:0 auto 36px;font-weight:400}
        .fl-hero-sub strong{color:var(--fl-ink);font-weight:600}

        /* CTA principal */
        .fl-btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--fl-accent);color:#fff;padding:16px 32px;border-radius:12px;font-size:17px;font-weight:800;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .2s;letter-spacing:-.01em}
        .fl-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.4)}
        .fl-btn-ghost{display:inline-flex;align-items:center;gap:6px;color:var(--fl-ink2);font-size:15px;font-weight:500;padding:12px 20px;border-radius:10px;border:1px solid var(--fl-line);text-decoration:none;transition:color .15s,border-color .15s}
        .fl-btn-ghost:hover{color:var(--fl-ink);border-color:rgba(255,255,255,.18)}
        .fl-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
        .fl-fine{font-size:13px;color:var(--fl-ink3);text-align:center;margin-top:8px}

        /* LAPTOP MOCKUP */
        .fl-laptop{position:relative;width:100%;max-width:960px;margin:0 auto}
        .fl-laptop-sm{max-width:568px}
        .fl-laptop-frame{background:#1a1d27;border-radius:12px 12px 0 0;border:2px solid #252a3a;padding:10px 10px 0;box-shadow:0 40px 100px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04)}
        .fl-laptop-bar{background:#131720;border-radius:8px 8px 0 0;height:26px;display:flex;align-items:center;padding:0 12px;gap:6px;margin-bottom:8px}
        .fl-laptop-dot{width:10px;height:10px;border-radius:50%}
        .fl-laptop-screen{border-radius:4px;overflow:hidden;border:1px solid #1e2330}
        .fl-laptop-screen img{width:100%;display:block}
        .fl-laptop-base{background:linear-gradient(to bottom,#1a1d27,#131720);height:16px;border-radius:0 0 4px 4px;border:2px solid #252a3a;border-top:none;width:100%}
        .fl-laptop-foot{background:#111318;height:9px;border-radius:0 0 14px 14px;width:40%;margin:0 auto;border:1px solid #252a3a;border-top:none}

        /* STATS */
        .fl-stats{display:flex;justify-content:center;gap:0;border-top:1px solid var(--fl-line);border-bottom:1px solid var(--fl-line);background:var(--fl-bg2)}
        .fl-stat{flex:1;text-align:center;padding:32px 16px;border-right:1px solid var(--fl-line)}
        .fl-stat:last-child{border-right:none}
        .fl-stat-n{font-size:30px;font-weight:800;letter-spacing:-.03em;display:block;color:var(--fl-ink)}
        .fl-stat-n em{font-style:normal;color:var(--fl-accent)}
        .fl-stat-l{font-size:13px;color:var(--fl-ink3);margin-top:4px;display:block;line-height:1.4}
        .fl-stat-src{font-size:11px;color:var(--fl-ink3);margin-top:3px;display:block;opacity:.6;font-style:italic}

        /* SECTION LAYOUT */
        .fl-section{padding:80px 40px;max-width:1100px;margin:0 auto}
        .fl-section-sm{padding:80px 40px;max-width:860px;margin:0 auto}
        .fl-eyebrow{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--fl-accent);margin-bottom:14px;display:block}
        .fl-h2{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin-bottom:16px}
        .fl-h2 em{font-style:normal;color:var(--fl-ink2)}
        .fl-lead{font-size:17px;color:var(--fl-ink2);line-height:1.7;max-width:520px}

        /* CHAT SECTION (grid lado a lado) */
        .fl-chat-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
        @media(max-width:860px){.fl-chat-grid{grid-template-columns:1fr;gap:40px}}

        /* DOR/SOLUÇÃO */
        .fl-vs{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        @media(max-width:760px){.fl-vs{grid-template-columns:1fr}}
        .fl-vs-card{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:16px;padding:32px}
        .fl-vs-card.bad{border-color:rgba(239,68,68,.22)}
        .fl-vs-card.good{border-color:rgba(34,197,94,.22)}
        .fl-vs-label{font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px;display:flex;align-items:center;gap:8px}
        .fl-vs-label.bad-l{color:var(--fl-red)}
        .fl-vs-label.good-l{color:var(--fl-green)}
        .fl-vs-item{display:flex;align-items:flex-start;gap:11px;padding:13px 0;border-bottom:1px solid var(--fl-line)}
        .fl-vs-item:last-child{border-bottom:none}
        .fl-vs-item strong{display:block;font-size:14.5px;color:var(--fl-ink);font-weight:600;margin-bottom:3px}
        .fl-vs-item p{font-size:13.5px;color:var(--fl-ink2);line-height:1.55}

        /* FEATURES */
        .fl-feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
        .fl-feat-card{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:14px;padding:26px;transition:border-color .2s}
        .fl-feat-card:hover{border-color:rgba(99,102,241,.35)}
        .fl-feat-icon{width:38px;height:38px;margin-bottom:14px;color:var(--fl-accent)}
        .fl-feat-card h3{font-size:16px;font-weight:700;margin-bottom:7px;letter-spacing:-.01em}
        .fl-feat-card p{font-size:13.5px;color:var(--fl-ink2);line-height:1.6}

        /* PROVA SOCIAL */
        .fl-proof-inner{max-width:760px;margin:0 auto;text-align:center}
        .fl-proof-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:var(--fl-green);padding:5px 14px;border-radius:100px;font-size:11.5px;font-weight:700;letter-spacing:.08em;margin-bottom:28px}
        .fl-proof blockquote{font-size:clamp(19px,2.5vw,26px);font-weight:600;line-height:1.45;letter-spacing:-.018em;color:var(--fl-ink);margin-bottom:28px;font-style:italic}
        .fl-proof-meta{display:flex;align-items:center;justify-content:center;gap:14px}
        .fl-proof-avatar{width:46px;height:46px;border-radius:50%;background:var(--fl-bg3);border:2px solid var(--fl-line);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;color:var(--fl-accent)}
        .fl-proof-who strong{display:block;font-size:15px;font-weight:700}
        .fl-proof-who span{font-size:13px;color:var(--fl-ink3)}
        .fl-proof-nums{display:flex;justify-content:center;gap:0;margin-top:48px;padding-top:48px;border-top:1px solid var(--fl-line)}
        .fl-proof-m{flex:1;text-align:center;border-right:1px solid var(--fl-line)}
        .fl-proof-m:last-child{border-right:none}
        .fl-proof-m .n{font-size:38px;font-weight:800;letter-spacing:-.04em;color:var(--fl-accent)}
        .fl-proof-m .l{font-size:12.5px;color:var(--fl-ink3);margin-top:4px;line-height:1.4}

        /* PLANOS */
        .fl-plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px;align-items:start}
        .fl-plan{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:16px;padding:30px;position:relative}
        .fl-plan.hot{border-color:var(--fl-accent);background:linear-gradient(160deg,rgba(99,102,241,.07),var(--fl-bg2))}
        .fl-plan-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--fl-accent);color:#fff;font-size:11px;font-weight:800;padding:4px 16px;border-radius:100px;letter-spacing:.07em;white-space:nowrap}
        .fl-plan h3{font-size:19px;font-weight:700;margin-bottom:4px}
        .fl-plan .tagline{font-size:13px;color:var(--fl-ink3);margin-bottom:18px}
        .fl-plan .price{font-size:40px;font-weight:800;letter-spacing:-.04em;margin:16px 0 3px}
        .fl-plan .price span{font-size:15px;color:var(--fl-ink3);font-weight:400}
        .fl-plan .price-meta{font-size:13px;color:var(--fl-ink3);margin-bottom:22px}
        .fl-plan-items{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:24px}
        .fl-plan-items li{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:var(--fl-ink2)}
        .fl-plan-cta{display:block;text-align:center;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;transition:all .2s}
        .fl-plan.hot .fl-plan-cta{background:var(--fl-accent);color:#fff}
        .fl-plan.hot .fl-plan-cta:hover{box-shadow:0 6px 24px rgba(99,102,241,.38);transform:translateY(-1px)}
        .fl-plan:not(.hot) .fl-plan-cta{background:var(--fl-bg3);color:var(--fl-ink);border:1px solid var(--fl-line)}

        /* OBJEÇÕES / FAQ */
        .fl-faq-list{display:flex;flex-direction:column}
        details.fl-faq{border-bottom:1px solid var(--fl-line)}
        details.fl-faq summary{list-style:none;cursor:pointer;padding:20px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;font-size:16px;font-weight:600;letter-spacing:-.01em;color:var(--fl-ink)}
        details.fl-faq summary::-webkit-details-marker{display:none}
        details.fl-faq summary::after{content:'+';font-size:22px;color:var(--fl-ink3);transition:transform .25s;font-weight:300;flex-shrink:0}
        details.fl-faq[open] summary::after{content:'−';color:var(--fl-accent)}
        details.fl-faq .ans{padding:0 0 20px;font-size:15px;color:var(--fl-ink2);line-height:1.7;max-width:640px}

        /* CTA FINAL */
        .fl-final{padding:120px 40px;text-align:center;background:radial-gradient(ellipse 70% 55% at 50% 100%,rgba(99,102,241,.11),transparent)}
        .fl-final h2{font-size:clamp(34px,6vw,66px);font-weight:800;line-height:1.04;letter-spacing:-.04em;margin-bottom:18px}
        .fl-final h2 em{font-style:normal;color:rgba(255,255,255,.3)}
        .fl-final p{font-size:18px;color:var(--fl-ink2);margin-bottom:36px;line-height:1.6;max-width:480px;margin-left:auto;margin-right:auto}

        /* FOOTER */
        .fl-footer{border-top:1px solid var(--fl-line);padding:40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;max-width:1100px;margin:0 auto}
        .fl-footer-brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:14px;color:var(--fl-ink);text-decoration:none}
        .fl-footer-links{display:flex;gap:24px}
        .fl-footer-links a{font-size:13px;color:var(--fl-ink3);text-decoration:none}
        .fl-footer-links a:hover{color:var(--fl-ink)}

        /* HERO ASSISTANT GRID — sempre empilhado, centralizado */
        .fl-ai-grid{display:flex;flex-direction:column;align-items:center;gap:48px;max-width:860px;margin:64px auto 0;text-align:center}
        .fl-ai-eyebrow{font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--fl-accent);margin-bottom:16px;display:block}
        .fl-ai-title{font-size:clamp(26px,3.5vw,42px);font-weight:800;letter-spacing:-.035em;line-height:1.06;margin-bottom:20px;color:#fff}
        .fl-ai-desc{font-size:16px;color:var(--fl-ink2);line-height:1.7;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto}
        .fl-ai-metrics{display:flex;flex-direction:row;gap:12px;justify-content:center;flex-wrap:wrap}
        .fl-ai-metric{display:flex;align-items:center;gap:10px;padding:10px 18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px}
        .fl-ai-metric-n{font-size:18px;font-weight:800;letter-spacing:-.03em;color:var(--fl-accent);flex-shrink:0}
        .fl-ai-metric-l{font-size:13px;color:var(--fl-ink2);line-height:1.4;text-align:left}
        @media(max-width:600px){.fl-ai-metrics{flex-direction:column}.fl-ai-grid{gap:36px;margin-top:48px}}

        /* REVEAL */
        .fl-root .rev{opacity:0;transform:translateY(22px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev.in{opacity:1;transform:none}
        @media(prefers-reduced-motion:reduce){.fl-root .rev{opacity:1;transform:none;transition:none}}

        /* MOBILE */
        @media(max-width:600px){
          #fl-nav{padding:14px 20px}
          .fl-hero{padding:110px 20px 60px}
          .fl-section,.fl-section-sm{padding:60px 20px}
          .fl-stats{flex-wrap:wrap}
          .fl-stat{flex:1 0 calc(50% - 1px);border-right:none;border-bottom:1px solid var(--fl-line)}
          .fl-stat:nth-child(odd){border-right:1px solid var(--fl-line)}
          .fl-stat:last-child,.fl-stat:nth-last-child(-n+2):nth-child(odd){border-bottom:none}
          .fl-final{padding:80px 20px}
          .fl-footer{flex-direction:column;align-items:flex-start;padding:32px 20px}
          .fl-proof-nums{flex-wrap:wrap}
          .fl-proof-m{flex:1 0 50%;border-right:none;border-bottom:1px solid var(--fl-line);padding:16px 0}
          .fl-proof-m:nth-child(odd){border-right:1px solid var(--fl-line)}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav id="fl-nav">
        <a href="/" className="fl-brand">
          <LogoMark />
          LogCodex Fleet
        </a>
        <a href="#" className="fl-nav-cta" onClick={openModal}>Testar 7 dias grátis</a>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <ShaderBackground />
        {/* overlay escuro igual ao site */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(9,11,15,0.72) 0%, rgba(9,11,15,0.52) 50%, rgba(9,11,15,0.92) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,40px) clamp(60px,8vh,100px)' }}>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 7px #4ade80', animation: 'pulse 2.2s infinite' }} />
            Em produção · JCLS Transportes · Paraná
          </motion.div>

          {/* headline com palavra rotativa — sempre empilhada */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(38px,7.5vw,82px)', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04, marginBottom: '20px', color: '#fff' }}
          >
            <span style={{ display: 'block' }}>Sua frota,</span>
            <span style={{ display: 'block', position: 'relative', overflow: 'hidden', height: '1.1em' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: -55 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 55 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', color: 'transparent', backgroundImage: 'linear-gradient(90deg, #818cf8, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
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
            style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 32px' }}
          >
            Transportadoras com 5 a 30 caminhões perdem em média <strong style={{ color: 'rgba(255,255,255,0.75)' }}>R$1.800/mês</strong> em custos invisíveis. O Fleet fecha essa conta — automaticamente, no celular.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}
          >
            <a href="#" onClick={openModal} style={{ padding: '15px 32px', borderRadius: '12px', background: '#fff', color: '#0c0d0f', fontSize: '16px', fontWeight: 800, textDecoration: 'none', transition: 'transform .15s', letterSpacing: '-.01em' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Testar grátis por 7 dias →</a>
            <a href="#como" style={{ padding: '15px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)', fontSize: '15px', fontWeight: 500, textDecoration: 'none', transition: 'transform .15s' }}
              onClick={e => { e.preventDefault(); document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' }) }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Ver como funciona</a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.22)', marginBottom: '40px' }}
          >
            Sem cartão de crédito · sem contrato · cancela quando quiser
          </motion.p>

          {/* CHAT — IA em destaque no hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
          >
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.24)', marginBottom: '10px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Experimente o Assistente Fleet
            </p>
            <FleetChat onOpenContact={() => setModalOpen(true)} />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.15)', marginTop: '10px', textAlign: 'center' }}>
              Pergunte como perguntaria para um gerente da sua operação
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── GRID ASSISTENTE (texto + GIF lado a lado) ── */}
      <div style={{ background: 'var(--fl-bg)', borderBottom: '1px solid var(--fl-line)', padding: '0 40px 80px' }}>
        <div className="fl-ai-grid rev">
          {/* Texto esquerda */}
          <div>
            <span className="fl-ai-eyebrow">Assistente Fleet · IA</span>
            <h3 className="fl-ai-title">
              Pergunte qualquer coisa<br />sobre sua operação.
            </h3>
            <p className="fl-ai-desc">
              "Qual motorista deu mais prejuízo esse mês?" — o assistente consulta seus dados reais e responde em segundos. Sem abrir relatório, sem filtrar planilha.
            </p>
            <div className="fl-ai-metrics">
              {[
                { n: '70%', l: 'menos tempo fechando acerto com motoristas' },
                { n: '< 5min', l: 'para registrar uma viagem completa' },
                { n: 'zero', l: 'planilhas abertas para saber sua margem' },
              ].map(({ n, l }) => (
                <div key={l} className="fl-ai-metric">
                  <span className="fl-ai-metric-n">{n}</span>
                  <span className="fl-ai-metric-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GIF à direita */}
          <div className="fl-laptop fl-laptop-sm" style={{ margin: '0 auto' }}>
            <div className="fl-laptop-frame">
              <div className="fl-laptop-bar">
                <div className="fl-laptop-dot" style={{ background: '#ef4444' }} />
                <div className="fl-laptop-dot" style={{ background: '#f59e0b' }} />
                <div className="fl-laptop-dot" style={{ background: '#22c55e' }} />
              </div>
              <div className="fl-laptop-screen">
                <video src={`${BASE}/screenshots/logcodex-fleet-assistant_2.mp4`} autoPlay muted loop playsInline preload="metadata" aria-label="Assistente Fleet IA — perguntas em linguagem natural" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>
      </div>

      {/* ── ANTES vs DEPOIS ── */}
      <div className="fl-section rev">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="fl-eyebrow">O problema que você conhece bem</span>
          <h2 className="fl-h2" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Você sabe quanto <em>faturou</em> esse mês.<br />
            Mas sabe quanto <em>sobrou?</em>
          </h2>
        </div>
        <div className="fl-vs">
          <div className="fl-vs-card bad">
            <div className="fl-vs-label bad-l"><X /> Sem o Fleet</div>
            <div className="fl-vs-item">
              <X />
              <div>
                <strong>Custo real da viagem: desconhecido</strong>
                <p>Combustível, pedágio e manutenção somem entre notas fiscais e WhatsApp. Você fecha o mês sem saber se lucrou.</p>
              </div>
            </div>
            <div className="fl-vs-item">
              <X />
              <div>
                <strong>Acerto vira tarde perdida</strong>
                <p>Sem documento claro, o acerto com motorista é sempre tenso. Às vezes refaz três vezes na mesma semana.</p>
              </div>
            </div>
            <div className="fl-vs-item">
              <X />
              <div>
                <strong>Decisão no achismo</strong>
                <p>Fecha o frete sem saber a margem real. Só descobre que perdeu dinheiro quando o caixa fecha no vermelho.</p>
              </div>
            </div>
          </div>
          <div className="fl-vs-card good">
            <div className="fl-vs-label good-l"><Check /> Com o Fleet</div>
            <div className="fl-vs-item">
              <Check />
              <div>
                <strong>Custo real calculado automaticamente</strong>
                <p>Cada despesa registrada no momento. O custo total sai sem você abrir uma planilha — por viagem, por motorista, por rota.</p>
              </div>
            </div>
            <div className="fl-vs-item">
              <Check />
              <div>
                <strong>Acerto em 30 minutos</strong>
                <p>O sistema calcula: proposta − despesas = acerto. Motorista vê, confere e aprova. Sem discussão, sem retrabalho.</p>
              </div>
            </div>
            <div className="fl-vs-item">
              <Check />
              <div>
                <strong>Margem antes de fechar o frete</strong>
                <p>Você vê o lucro estimado da rota antes de aceitar. Decide com número, não com instinto.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMO FUNCIONA ── */}
      <div className="fl-section rev" id="como" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="fl-eyebrow">Como funciona</span>
          <h2 className="fl-h2">Da viagem ao acerto,<br /><em>tudo em um lugar.</em></h2>
          <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
            Não é mais um sistema pra aprender. É a sua operação atual — organizada, calculada e acessível de qualquer celular.
          </p>
        </div>

        {/* GIF viagens */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="fl-eyebrow">01 · Viagens e rotas</span>
            <h3 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: '10px' }}>Cada viagem documentada em segundos</h3>
            <p style={{ color: 'var(--fl-ink2)', fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>Origem, destino, KM, valor do frete. O custo real sai calculado automaticamente — sem abrir planilha.</p>
          </div>
          <div className="fl-laptop">
            <div className="fl-laptop-frame">
              <div className="fl-laptop-bar">
                <div className="fl-laptop-dot" style={{ background: '#ef4444' }} />
                <div className="fl-laptop-dot" style={{ background: '#f59e0b' }} />
                <div className="fl-laptop-dot" style={{ background: '#22c55e' }} />
              </div>
              <div className="fl-laptop-screen">
                <video src={`${BASE}/screenshots/logcodex-fleet-viagens.mp4`} autoPlay muted loop playsInline preload="metadata" aria-label="LogCodex Fleet — registro de viagens" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>

        {/* GIF financeiro */}
        <div>
          {/* cabeçalho + cards + gif empilhados, largura total */}
          <style>{`
            .fl-fin-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px}
            @media(max-width:860px){.fl-fin-cards{grid-template-columns:1fr 1fr}}
            @media(max-width:500px){.fl-fin-cards{grid-template-columns:1fr}}
          `}</style>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="fl-eyebrow">02 · Financeiro</span>
            <h3 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: '12px' }}>
              Do acerto ao DRE.<br /><span style={{ color: 'var(--fl-ink2)', fontWeight: 400 }}>Tudo em um lugar.</span>
            </h3>
            <p style={{ color: 'var(--fl-ink2)', fontSize: '15px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Toda a movimentação financeira da operação — sem montar relatório na mão, sem esperar o contador.
            </p>
          </div>
          <div className="fl-fin-cards">
            {[
              { t: 'Acertos com motoristas', d: 'Proposta − despesas = acerto. O motorista vê, confirma e recebe. Zero discussão.' },
              { t: 'Cobranças e propostas', d: 'Emita propostas com validade e valor por rota. Converta em cobrança com um clique.' },
              { t: 'DRE por período', d: 'Receita, despesas e resultado líquido por semana, mês ou rota. Sabe o que sobrou antes de fechar o mês.' },
              { t: 'Despesas por viagem', d: 'Combustível, pedágio, manutenção e extras — custo real atualizado a cada registro.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '18px' }}>
                <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--fl-ink)', marginBottom: '8px' }}>{t}</strong>
                <span style={{ fontSize: '13px', color: 'var(--fl-ink2)', lineHeight: 1.6 }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="fl-laptop">
            <div className="fl-laptop-frame">
              <div className="fl-laptop-bar">
                <div className="fl-laptop-dot" style={{ background: '#ef4444' }} />
                <div className="fl-laptop-dot" style={{ background: '#f59e0b' }} />
                <div className="fl-laptop-dot" style={{ background: '#22c55e' }} />
              </div>
              <div className="fl-laptop-screen">
                <video src={`${BASE}/screenshots/logcodex-fleet-financeiro.mp4`} autoPlay muted loop playsInline preload="metadata" aria-label="LogCodex Fleet — acertos financeiros" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>
      </div>


      {/* ── FEATURES ── */}
      <div className="fl-section rev" style={{ background: 'var(--fl-bg2)', borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="fl-eyebrow">O que está incluído</span>
          <h2 className="fl-h2">Tudo que sua operação precisa.<br /><em>Nada que não usa.</em></h2>
        </div>
        <div className="fl-feat-grid">
          {([
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
              title: 'Viagens documentadas',
              desc: 'Origem, destino, km e valor do frete registrados em menos de 5 minutos. Custo real calculado automaticamente — por viagem, por motorista, por rota.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
              title: 'Financeiro completo',
              desc: 'Acertos com motoristas, cobranças a receber, DRE por período e despesas por viagem — do lançamento ao resultado, sem abrir planilha.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg>,
              title: 'Despesas e combustível',
              desc: 'Diesel, ARLA, pedágio e manutenção lançados por viagem. Sabe exatamente quanto cada caminhão custou no mês — antes de fechar o caixa.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
              title: 'Dashboard operacional',
              desc: 'Faturamento, margem por rota, viagens ativas e acertos pendentes — visão completa da operação em tempo real, de qualquer celular.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
              title: 'Assistente Fleet (IA)',
              desc: '"Qual rota deu mais prejuízo esse mês?" — o assistente consulta seus dados reais e responde em segundos. Sem filtro, sem relatório, sem Excel.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
              title: 'Propostas e clientes',
              desc: 'Crie propostas com rota, valor e validade. Converta em viagem com um clique e já inicie o controle de custo — da cotação ao fechamento.',
            },
          ] as { icon: React.ReactNode; title: string; desc: string }[]).map((f) => (
            <div className="fl-feat-card" key={f.title}>
              {f.icon}
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROVA SOCIAL — JCLS ── */}
      <div className="fl-section-sm rev" style={{ background: 'var(--fl-bg)', borderTop: '1px solid var(--fl-line)' }}>
        <div className="fl-proof-inner">
          <div className="fl-proof-badge">✓ CLIENTE EM PRODUÇÃO</div>
          <blockquote>
            "Antes do Fleet, todo acerto com motorista virava uma tarde perdida. Agora fechamos em 30 minutos. O sistema calcula, o motorista vê e confirma — sem briga."
          </blockquote>
          <div className="fl-proof-meta">
            <div className="fl-proof-avatar">J</div>
            <div className="fl-proof-who">
              <strong>Junior Rodrigo</strong>
              <span>Gestor · JCLS Transportes · Paraná</span>
            </div>
          </div>
          <div className="fl-proof-nums">
            <div className="fl-proof-m">
              <div className="n">−12h</div>
              <div className="l">por semana no acerto</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">~0</div>
              <div className="l">erros de acerto</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">180</div>
              <div className="l">viagens/mês</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">5</div>
              <div className="l">motoristas ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PLANOS ── */}
      <div className="fl-section rev" id="planos" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="fl-eyebrow">Planos</span>
          <h2 className="fl-h2">Comece grátis.<br /><em>Pague quando valer.</em></h2>
          <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>7 dias com tudo liberado, sem cartão. Depois, escolha pelo volume. Cancela quando quiser.</p>
        </div>
        <div className="fl-plans-grid">
          <div className="fl-plan">
            <h3>Starter</h3>
            <p className="tagline">Até 10 veículos · motoristas ilimitados</p>
            <p className="price">R$ 99<span>/mês</span></p>
            <p className="price-meta">sem contrato de fidelidade</p>
            <ul className="fl-plan-items">
              {['Viagens, despesas e acertos', 'Painel operacional', 'Assistente Fleet (IA)', 'Suporte por e-mail'].map(i => <li key={i}><Check />{i}</li>)}
            </ul>
            <a href="#" className="fl-plan-cta" onClick={openModal}>Testar grátis 7 dias</a>
          </div>
          <div className="fl-plan hot">
            <span className="fl-plan-badge">MAIS ESCOLHIDO</span>
            <h3>Profissional</h3>
            <p className="tagline">Até 50 veículos · motoristas ilimitados</p>
            <p className="price">R$ 299<span>/mês</span></p>
            <p className="price-meta">sem contrato de fidelidade</p>
            <ul className="fl-plan-items">
              {['Tudo do Starter', 'Relatórios e fluxo financeiro', 'Propostas e gestão de clientes', 'Suporte prioritário'].map(i => <li key={i}><Check />{i}</li>)}
            </ul>
            <a href="#" className="fl-plan-cta" onClick={openModal}>Testar grátis 7 dias</a>
          </div>
          <div className="fl-plan">
            <h3>Sob demanda</h3>
            <p className="tagline">Acima de 50 veículos</p>
            <p className="price" style={{ fontSize: '26px', letterSpacing: '-.02em' }}>Sob consulta</p>
            <p className="price-meta">SLA garantido · integração customizada</p>
            <ul className="fl-plan-items">
              {['Tudo do Profissional', 'Integrações customizadas', 'SLA garantido', 'Suporte dedicado'].map(i => <li key={i}><Check />{i}</li>)}
            </ul>
            <a href="mailto:leonardo.antunes@logcodex.com" className="fl-plan-cta">Falar com a gente</a>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: 'var(--fl-ink3)' }}>
          Sem cobrança automática · seus dados exportáveis em Excel · cancela quando quiser
        </p>
      </div>

      {/* ── OBJEÇÕES / FAQ ── */}
      <div className="fl-section-sm rev" style={{ borderTop: '1px solid var(--fl-line)', background: 'var(--fl-bg2)' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="fl-eyebrow">Dúvidas comuns</span>
          <h2 className="fl-h2">Antes de testar,<br /><em>vale saber.</em></h2>
        </div>
        <div className="fl-faq-list">
          {[
            { q: 'Preciso de cartão de crédito pra testar?', a: 'Não. São 7 dias grátis com o sistema completo. Você cadastra com e-mail e já entra operando. Só decide se continua depois — sem cobrança automática.' },
            { q: 'Quanto tempo leva para implantar?', a: 'Em menos de 1 dia você já está operando. Importamos sua frota, motoristas e clientes de planilha. Fazemos o onboarding junto — sem treinamento extenso.' },
            { q: 'Meus motoristas precisam usar o sistema?', a: 'O motorista pode confirmar acertos pelo celular (opcional). O registro de viagens é feito por você no painel — o Fleet não exige que o motorista aprenda nada.' },
            { q: 'E se eu cancelar? Perco meus dados?', a: 'Não. Seus dados saem com você em Excel a qualquer momento. Sem resgate, sem trava, sem contrato de fidelidade.' },
            { q: 'O Fleet funciona com meu app de rastreamento?', a: 'Integração com rastreamento é parte do roadmap. Hoje o registro de viagem é feito pelo painel ou pelo assistente de chat — rápido e sem depender de outro sistema.' },
            { q: 'Tem suporte em português?', a: 'Sim, suporte em português por e-mail (Starter) e prioritário com tempo de resposta garantido (Profissional). Somos brasileiros, conhecemos sua operação.' },
          ].map(({ q, a }) => (
            <details key={q} className="fl-faq">
              <summary>{q}</summary>
              <p className="ans">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div className="fl-final rev">
        <h2>Saiba quanto sobra<br /><em>em cada viagem.</em></h2>
        <p>Teste o Fleet grátis por 7 dias. Cadastre sua frota, registre as primeiras viagens e veja o número real aparecer. Sem cartão, sem compromisso.</p>
        <a href="#" className="fl-btn-primary" onClick={openModal} style={{ fontSize: '18px', padding: '18px 40px' }}>
          Começar agora, é grátis →
        </a>
        <p className="fl-fine" style={{ marginTop: '16px' }}>7 dias grátis · sem cartão · sem contrato · seus dados sempre seus</p>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1d2335' }}>
        <div className="fl-footer">
          <a href="/" className="fl-footer-brand">
            <LogoMark />
            LogCodex Fleet
          </a>
          <div className="fl-footer-links">
            <a href="/">logcodex.com</a>
            <a href="mailto:leonardo.antunes@logcodex.com">Contato</a>
            <a href="#planos">Planos</a>
          </div>
          <span style={{ fontSize: '13px', color: '#475569' }}>© 2026 LogCodex</span>
        </div>
      </footer>
    </div>
  )
}
