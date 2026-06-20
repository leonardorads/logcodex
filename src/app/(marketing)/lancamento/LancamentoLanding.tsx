'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShaderBackground } from '../ShaderBackground'
import { LancamentoChat } from './LancamentoChat'
import { trackLeadConversion } from '@/lib/track'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

// ── UTM vindos do Server Component (capturados de searchParams, SSR-safe) ──
export type Utm = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none" width="26" height="26">
    <defs>
      <linearGradient id="lc-stroke" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa" />
        <stop offset="1" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" width="31" height="31" rx="7" fill="#0c0d0f" stroke="#ffffff" strokeOpacity="0.12" />
    <path d="M9 8.5 V21.5 H15.5" stroke="url(#lc-stroke)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.5 11.6 A5 5 0 0 0 18.5 11.6 V18.4 A5 5 0 0 0 23.5 18.4" stroke="url(#lc-stroke)" strokeWidth="2.4" strokeLinecap="round" />
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

// ── Opções do onboarding — valores EXATOS dos CHECK da migration 050 ──
const Q_VEICULOS = ['1 a 5', '6 a 10', '11 a 50', 'Mais de 50'] as const
const Q_CONTROLE = ['Planilha ou caderno', 'Outro sistema', 'Não controlo direito'] as const
const Q_DOR = [
  'Não sei o lucro de cada viagem',
  'Acerto com motorista é confuso',
  'Não controlo custo e combustível',
  'Outra coisa',
] as const

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

// Headline rotativa — idêntica à /fleet: "Sua frota," + palavra curta.
// Palavras curtas = altura travada, nada se mexe abaixo (sem layout shift).
const ROTATING = ['sem planilha', 'no celular', 'em tempo real', 'com IA']

function scrollTo(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

import { FAQ } from './faq-data'

export function LancamentoLanding({ utm, variant = 'A' }: { utm: Utm; variant?: string }) {
  // hasJs: realce progressivo. SSR_SAFE_DEFAULT=false → 1ª etapa do form renderiza sem JS (L15/L17).
  const [hasJs, setHasJs] = useState(false)
  useEffect(() => { setHasJs(true) }, [])

  // Palavra rotativa da headline (SSR_SAFE_DEFAULT=0 → no SSR renderiza a 1ª palavra real)
  const [wordIndex, setWordIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING.length), 2400)
    return () => clearInterval(id)
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
      <style>{`
        :root{--fl-bg:#090b0f;--fl-bg2:#0d1018;--fl-bg3:#131720;--fl-line:#1d2335;--fl-ink:#f1f5f9;--fl-ink2:#94a3b8;--fl-ink3:#475569;--fl-accent:#6366f1;--fl-green:#22c55e;--fl-red:#ef4444;--fl-amber:#f59e0b;--fl-ease:cubic-bezier(.16,1,.3,1)}
        .fl-root{background:var(--fl-bg);color:var(--fl-ink);min-height:100vh;font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .fl-root *{box-sizing:border-box;margin:0;padding:0}

        /* NAV */
        #fl-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;transition:background .3s,backdrop-filter .3s}
        #fl-nav.scrolled{background:rgba(9,11,15,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--fl-line)}
        .fl-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:#fff;text-decoration:none;letter-spacing:-.01em}
        .fl-brand svg{filter:drop-shadow(0 0 8px rgba(99,102,241,.5))}
        .fl-nav-cta{background:var(--fl-accent);color:#fff;padding:10px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:.01em;transition:opacity .15s;border:none;cursor:pointer;font-family:inherit}
        .fl-nav-cta:hover{opacity:.88}

        /* BOTÕES */
        .fl-btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--fl-accent);color:#fff;padding:16px 32px;border-radius:12px;font-size:17px;font-weight:800;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .2s;letter-spacing:-.01em}
        .fl-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.4)}
        .fl-cta-white{display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:12px;background:#fff;color:#0c0d0f;font-size:16px;font-weight:800;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:transform .15s;letter-spacing:-.01em}
        .fl-cta-white:hover{transform:translateY(-2px)}
        .fl-btn-ghost{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.75);font-size:15px;font-weight:500;padding:15px 28px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);text-decoration:none;cursor:pointer;font-family:inherit;transition:transform .15s}
        .fl-btn-ghost:hover{transform:translateY(-2px)}

        /* HERO */
        .fl-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.28);color:#a5b4fc;padding:6px 16px;border-radius:100px;font-size:12.5px;font-weight:600;margin-bottom:28px;letter-spacing:.06em}
        .fl-hero-badge .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 7px #22c55e;animation:flpulse 2.2s infinite}
        @keyframes flpulse{0%,100%{opacity:1}50%{opacity:.35}}
        .fl-grad{color:transparent;background-image:linear-gradient(90deg,#818cf8,#60a5fa);-webkit-background-clip:text;background-clip:text}

        /* ÂNCORA DE PREÇO */
        .fl-price-box{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px 28px;max-width:520px;margin:36px auto 0}
        .fl-price-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        @media(max-width:480px){.fl-price-grid{grid-template-columns:1fr;gap:16px}}
        .fl-price-plan .name{font-size:13px;color:var(--fl-ink2);font-weight:600;margin-bottom:6px}
        .fl-price-old{font-size:18px;color:var(--fl-ink3);text-decoration:line-through;margin-right:8px}
        .fl-price-new{font-size:30px;font-weight:800;letter-spacing:-.03em}
        .fl-price-meta{font-size:12px;color:var(--fl-ink3);margin-top:4px}
        .fl-price-foot{text-align:center;font-size:12.5px;color:var(--fl-ink2);margin-top:18px;padding-top:16px;border-top:1px solid var(--fl-line)}
        .fl-hero-offer{display:flex;align-items:center;justify-content:center;gap:32px;margin:40px auto 0;flex-wrap:wrap}
        @media(max-width:600px){.fl-hero-offer{gap:8px}}

        /* LAPTOP MOCKUP */
        .fl-laptop{position:relative;width:100%;max-width:960px;margin:0 auto}
        .fl-laptop-sm{max-width:568px}
        .fl-laptop-frame{background:#1a1d27;border-radius:12px 12px 0 0;border:2px solid #252a3a;padding:10px 10px 0;box-shadow:0 40px 100px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04)}
        .fl-laptop-bar{background:#131720;border-radius:8px 8px 0 0;height:26px;display:flex;align-items:center;padding:0 12px;gap:6px;margin-bottom:8px}
        .fl-laptop-dot{width:10px;height:10px;border-radius:50%}
        .fl-laptop-screen{border-radius:4px;overflow:hidden;border:1px solid #1e2330}
        .fl-laptop-screen video{width:100%;display:block}
        .fl-laptop-base{background:linear-gradient(to bottom,#1a1d27,#131720);height:16px;border-radius:0 0 4px 4px;border:2px solid #252a3a;border-top:none;width:100%}
        .fl-laptop-foot{background:#111318;height:9px;border-radius:0 0 14px 14px;width:40%;margin:0 auto;border:1px solid #252a3a;border-top:none}

        /* SECTION */
        .fl-section{padding:80px 40px;max-width:1100px;margin:0 auto}
        .fl-section-sm{padding:80px 40px;max-width:860px;margin:0 auto}
        .fl-eyebrow{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--fl-accent);margin-bottom:14px;display:block}
        .fl-h2{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin-bottom:16px}
        .fl-h2 em{font-style:normal;color:var(--fl-ink2)}
        .fl-lead{font-size:17px;color:var(--fl-ink2);line-height:1.7;max-width:560px}

        /* GRID ASSISTENTE */
        .fl-ai-grid{display:flex;flex-direction:column;align-items:center;gap:48px;max-width:860px;margin:0 auto;text-align:center}
        .fl-ai-title{font-size:clamp(26px,3.5vw,42px);font-weight:800;letter-spacing:-.035em;line-height:1.06;margin-bottom:20px;color:#fff}
        .fl-ai-desc{font-size:16px;color:var(--fl-ink2);line-height:1.7;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto}
        .fl-ai-metrics{display:flex;flex-direction:row;gap:12px;justify-content:center;flex-wrap:wrap}
        .fl-ai-metric{display:flex;align-items:center;gap:10px;padding:10px 18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px}
        .fl-ai-metric-n{font-size:18px;font-weight:800;letter-spacing:-.03em;color:var(--fl-accent);flex-shrink:0}
        .fl-ai-metric-l{font-size:13px;color:var(--fl-ink2);line-height:1.4;text-align:left}
        @media(max-width:600px){.fl-ai-metrics{flex-direction:column}.fl-ai-grid{gap:36px}}

        /* FIN CARDS */
        .fl-fin-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px}
        @media(max-width:860px){.fl-fin-cards{grid-template-columns:1fr 1fr}}
        @media(max-width:500px){.fl-fin-cards{grid-template-columns:1fr}}

        /* ANTES vs DEPOIS */
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
        .fl-strike{text-decoration:line-through;color:var(--fl-ink3)}

        /* CAIXA 3D DE SOFTWARE — box volumétrico (frente + topo + lateral) */
        .fl-box-stage{display:flex;justify-content:center;align-items:center;perspective:1300px}
        .fl-box3d{position:relative;width:200px;height:262px;transform-style:preserve-3d;transform:rotateX(9deg) rotateY(-23deg);animation:fl-box-float 6.5s ease-in-out infinite}
        @keyframes fl-box-float{0%,100%{transform:rotateX(9deg) rotateY(-23deg) translateY(0)}50%{transform:rotateX(9deg) rotateY(-18deg) translateY(-10px)}}
        @media(prefers-reduced-motion:reduce){.fl-box3d{animation:none}}
        .fl-box3d .face{position:absolute;box-sizing:border-box;border:1px solid rgba(99,102,241,.55)}
        /* FRENTE (arte do produto) — z=0; profundidade vai pra trás */
        .fl-box-front{width:200px;height:262px;top:0;left:0;border-radius:3px;background:linear-gradient(150deg,#16161f 0%,#0a0b10 55%,#101019 100%);box-shadow:0 0 26px rgba(99,102,241,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 22px;text-align:center;overflow:hidden}
        .fl-box-front::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 78% 48% at 50% 0%,rgba(99,102,241,.34),transparent 70%);pointer-events:none}
        .fl-box-front::after{content:'';position:absolute;top:-20%;left:-32%;width:46%;height:140%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.08),transparent);transform:skewX(-14deg);pointer-events:none}
        /* LATERAL DIREITA — profundidade 56px, dobra na borda direita pra trás */
        .fl-box-right{width:56px;height:262px;top:0;left:200px;transform-origin:left center;transform:rotateY(90deg);background:linear-gradient(180deg,#0c0d14,#070709);box-shadow:inset 0 0 30px rgba(0,0,0,.5)}
        /* TOPO — profundidade 56px, dobra na borda superior pra trás */
        .fl-box-top{width:200px;height:56px;top:0;left:0;transform-origin:center top;transform:rotateX(-90deg);background:linear-gradient(180deg,#1d1d2a,#101019)}
        /* conteúdo da frente */
        .fl-box-logo{width:58px;height:58px;border-radius:15px;background:#0c0d0f;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;margin-bottom:16px;position:relative;z-index:1;box-shadow:0 8px 22px rgba(99,102,241,.3)}
        .fl-box-logo svg{filter:drop-shadow(0 0 6px rgba(99,102,241,.55))}
        .fl-box-name{font-size:20px;font-weight:800;letter-spacing:-.02em;color:#fff;position:relative;z-index:1;line-height:1.12}
        .fl-box-sub{font-size:10.5px;color:var(--fl-ink2);margin-top:6px;position:relative;z-index:1;letter-spacing:.02em}
        .fl-box-seal{margin-top:18px;padding:7px 14px;border-radius:100px;background:rgba(99,102,241,.16);border:1px solid rgba(99,102,241,.45);color:#a5b4fc;font-size:9px;font-weight:700;letter-spacing:.09em;line-height:1.3;position:relative;z-index:1}
        .fl-box-floor{height:26px;border-radius:50%;background:radial-gradient(ellipse,rgba(99,102,241,.22),transparent 70%);filter:blur(8px);margin-top:6px}
        .fl-benefits-grid{display:grid;grid-template-columns:300px 1fr;gap:48px;align-items:center}
        @media(max-width:820px){.fl-benefits-grid{grid-template-columns:1fr;gap:40px;justify-items:center}}

        /* PROVA SOCIAL */
        .fl-proof-inner{max-width:760px;margin:0 auto;text-align:center}
        .fl-proof-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:var(--fl-green);padding:5px 14px;border-radius:100px;font-size:11.5px;font-weight:700;letter-spacing:.08em;margin-bottom:28px}
        .fl-proof blockquote{font-size:clamp(19px,2.5vw,26px);font-weight:600;line-height:1.45;letter-spacing:-.018em;color:var(--fl-ink);margin-bottom:28px;font-style:italic}
        .fl-proof-meta{display:flex;align-items:center;justify-content:center;gap:14px}
        .fl-proof-avatar{width:46px;height:46px;border-radius:50%;background:var(--fl-bg3);border:2px solid var(--fl-line);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;color:var(--fl-accent)}
        .fl-proof-who strong{display:block;font-size:15px;font-weight:700}
        .fl-proof-who span{font-size:13px;color:var(--fl-ink3)}
        .fl-proof-nums{display:flex;justify-content:center;gap:0;margin-top:44px;padding-top:44px;border-top:1px solid var(--fl-line)}
        .fl-proof-m{flex:1;text-align:center;border-right:1px solid var(--fl-line)}
        .fl-proof-m:last-child{border-right:none}
        .fl-proof-m .n{font-size:32px;font-weight:800;letter-spacing:-.04em;color:var(--fl-accent)}
        .fl-proof-m .l{font-size:12px;color:var(--fl-ink3);margin-top:4px;line-height:1.4}
        .fl-about{max-width:600px;margin:40px auto 0;font-size:15px;color:var(--fl-ink2);line-height:1.7;text-align:center}
        .fl-about strong{color:var(--fl-ink);font-weight:600}
        @media(max-width:600px){.fl-proof-nums{flex-wrap:wrap}.fl-proof-m{flex:1 0 50%;border-right:none;border-bottom:1px solid var(--fl-line);padding:14px 0}.fl-proof-m:nth-child(odd){border-right:1px solid var(--fl-line)}}

        /* PASSOS (como você entra) */
        .fl-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        @media(max-width:760px){.fl-steps{grid-template-columns:1fr;gap:20px}}
        .fl-step-n{width:42px;height:42px;border-radius:50%;background:rgba(99,102,241,.12);color:var(--fl-accent);font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
        .fl-step h3{font-size:17px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}
        .fl-step p{font-size:14px;color:var(--fl-ink2);line-height:1.6}
        .fl-reassure{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:40px;color:var(--fl-ink2);font-size:14.5px;text-align:center}

        /* FORM */
        .fl-form-card{background:rgba(255,255,255,.02);border:1px solid var(--fl-line);border-radius:16px;padding:32px;max-width:560px;margin:0 auto}
        @media(max-width:600px){.fl-form-card{padding:24px 20px}}
        .fl-progress{display:flex;gap:6px;margin-bottom:8px}
        .fl-progress span{flex:1;height:5px;border-radius:99px;background:var(--fl-line);transition:background .3s}
        .fl-progress span.on{background:var(--fl-accent)}
        .fl-progress-label{font-size:12px;color:var(--fl-ink3);margin-bottom:22px;display:block}
        .fl-step-q{font-size:19px;font-weight:700;letter-spacing:-.01em;margin-bottom:18px;line-height:1.3}
        .fl-opts{display:flex;flex-direction:column;gap:10px}
        .fl-opt{width:100%;text-align:left;background:var(--fl-bg3);border:1px solid var(--fl-line);border-radius:12px;padding:16px 18px;font-size:15px;color:var(--fl-ink);font-family:inherit;cursor:pointer;transition:border-color .15s,background .15s;display:flex;justify-content:space-between;align-items:center;gap:12px}
        .fl-opt:hover{border-color:rgba(99,102,241,.35)}
        .fl-opt.sel{border-color:var(--fl-accent);background:rgba(99,102,241,.08)}
        .fl-opt:focus-visible{outline:2px solid var(--fl-accent);outline-offset:2px}
        .fl-back{background:none;border:none;color:var(--fl-ink3);font-family:inherit;font-size:13px;cursor:pointer;margin-bottom:16px;padding:0}
        .fl-back:hover{color:var(--fl-ink2)}
        .fl-field{margin-bottom:16px}
        .fl-field label{display:block;font-size:13px;font-weight:600;color:var(--fl-ink2);margin-bottom:6px}
        .fl-input{width:100%;background:var(--fl-bg3);border:1px solid var(--fl-line);border-radius:12px;padding:14px 16px;font-size:15px;color:var(--fl-ink);font-family:inherit;transition:border-color .15s}
        .fl-input::placeholder{color:var(--fl-ink3)}
        .fl-input:focus{outline:none;border-color:var(--fl-accent)}
        .fl-input.err{border-color:var(--fl-red)}
        .fl-field-err{font-size:13px;color:var(--fl-red);margin-top:6px}
        .fl-consent{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--fl-ink2);line-height:1.5;margin:18px 0}
        .fl-consent input{margin-top:3px;flex-shrink:0;width:16px;height:16px;accent-color:var(--fl-accent)}
        .fl-consent a{color:var(--fl-accent);text-decoration:underline}
        .fl-submit{width:100%;background:var(--fl-accent);color:#fff;border:none;border-radius:12px;padding:16px;font-size:16px;font-weight:800;font-family:inherit;cursor:pointer;transition:transform .15s,box-shadow .2s;letter-spacing:-.01em}
        .fl-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.4)}
        .fl-submit:disabled{opacity:.7;cursor:not-allowed}
        .fl-submit-hint{text-align:center;font-size:12.5px;color:var(--fl-ink3);margin-top:12px}
        .fl-send-err{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.28);color:#fca5a5;border-radius:10px;padding:12px 14px;font-size:13.5px;margin-bottom:16px;line-height:1.5}
        .fl-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
        .fl-confirm{text-align:center;padding:8px 4px}
        .fl-confirm-ico{width:64px;height:64px;border-radius:50%;background:rgba(34,197,94,.14);display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
        .fl-confirm h3{font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:14px}
        .fl-confirm p{font-size:15px;color:var(--fl-ink2);line-height:1.65;max-width:420px;margin:0 auto}
        .fl-confirm .micro{font-size:13px;color:var(--fl-ink3);margin-top:16px}

        /* FAQ */
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

        /* REVEAL */
        .fl-root .rev{opacity:0;transform:translateY(22px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev.in{opacity:1;transform:none}
        @media(prefers-reduced-motion:reduce){.fl-root .rev{opacity:1;transform:none;transition:none}}

        .hidden{display:none !important}

        @media(max-width:600px){
          #fl-nav{padding:14px 20px;gap:12px}
          .fl-brand{font-size:15px;white-space:nowrap}
          .fl-nav-cta{padding:9px 14px;font-size:13px}
          .fl-section,.fl-section-sm{padding:60px 20px}
          .fl-final{padding:80px 20px}
          .fl-footer{flex-direction:column;align-items:flex-start;padding:32px 20px}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav id="fl-nav">
        <a href="/fleet" className="fl-brand"><LogoMark /> LogCodex Fleet</a>
        <button className="fl-nav-cta" onClick={scrollTo('vaga')}>Quero minha vaga →</button>
      </nav>

      <main>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <ShaderBackground />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(9,11,15,0.72) 0%, rgba(9,11,15,0.52) 50%, rgba(9,11,15,0.92) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: 'clamp(90px,11vh,130px) clamp(20px,5vw,40px) clamp(60px,8vh,100px)' }}>
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="fl-hero-badge">
            <span className="dot" aria-label="Inscrições abertas" />
            ACESSO ANTECIPADO · LOTE 1 · 20 VAGAS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
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
                  style={{ display: 'block' }}
                  className="fl-grad"
                >
                  {ROTATING[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 32px' }}
          >
As 20 primeiras transportadoras entram com <strong style={{ color: 'rgba(255,255,255,0.8)' }}>30% de desconto por 12 meses</strong> e onboarding feito junto com você. Sem cartão, sem compromisso — você entra na lista do Lote 1 e a gente te chama.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="fl-cta-white" onClick={scrollTo('vaga')}>Quero minha vaga →</button>
            <button className="fl-btn-ghost" onClick={scrollTo('como')}>Ver como funciona</button>
          </motion.div>

          {/* CHAT — experimente o assistente (demo) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }} style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.24)', marginBottom: '10px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Experimente o Assistente Fleet
            </p>
            <LancamentoChat onWantSpot={() => document.getElementById('vaga')?.scrollIntoView({ behavior: 'smooth' })} />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.15)', marginTop: '10px' }}>
              Pergunte como perguntaria para um gerente da sua operação
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAIXA DE OFERTA — estojo 3D + preço do Lote 1 (logo após o hero) ── */}
      <div className="fl-section-sm rev" style={{ borderBottom: '1px solid var(--fl-line)' }}>
        <div className="fl-hero-offer">
          <ProductBox scale={0.82} />
          <div className="fl-price-box" style={{ margin: 0 }}>
            <span className="fl-eyebrow" style={{ marginBottom: '14px' }}>Preço de lançamento · Lote 1</span>
            <div className="fl-price-plan" style={{ textAlign: 'center' }}>
              <div className="name">Plano Starter · até 10 veículos</div>
              <div><span className="fl-price-old">R$ 99</span><span className="fl-price-new fl-grad">R$ 69,30</span><span style={{ fontSize: '14px', color: 'var(--fl-ink3)', marginLeft: '4px' }}>/mês</span></div>
              <div className="fl-price-meta">por 12 meses · sem fidelidade</div>
            </div>
            <div className="fl-price-foot">30% de desconto por 12 meses · 20 vagas</div>
          </div>
        </div>
      </div>

      {/* ── GRID ASSISTENTE (texto + vídeo) ── */}
      <div style={{ background: 'var(--fl-bg)', borderBottom: '1px solid var(--fl-line)', padding: '80px 40px' }}>
        <div className="fl-ai-grid rev">
          <div>
            <span className="fl-eyebrow">Assistente Fleet · IA</span>
            <h2 className="fl-ai-title">Pergunte qualquer coisa<br />sobre sua operação.</h2>
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
          <div className="fl-laptop fl-laptop-sm" style={{ margin: '0 auto' }}>
            <div className="fl-laptop-frame">
              <div className="fl-laptop-bar">
                <div className="fl-laptop-dot" style={{ background: '#ef4444' }} />
                <div className="fl-laptop-dot" style={{ background: '#f59e0b' }} />
                <div className="fl-laptop-dot" style={{ background: '#22c55e' }} />
              </div>
              <div className="fl-laptop-screen">
                <video src={`${BASE}/screenshots/logcodex-fleet-assistant_2.mp4`} poster={`${BASE}/screenshots/logcodex-fleet-assistant-poster.jpg`} autoPlay muted loop playsInline preload="metadata" aria-label="Assistente Fleet IA — perguntas em linguagem natural" />
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
            Você sabe quanto <em>faturou</em> esse mês.<br />Mas sabe quanto <em>sobrou?</em>
          </h2>
        </div>
        <div className="fl-vs">
          <div className="fl-vs-card bad">
            <div className="fl-vs-label bad-l"><X /> Sem o Fleet</div>
            <div className="fl-vs-item"><X /><div><strong>Custo real da viagem: desconhecido</strong><p>Combustível, pedágio e manutenção somem entre notas fiscais e WhatsApp. Você fecha o mês sem saber se lucrou.</p></div></div>
            <div className="fl-vs-item"><X /><div><strong>Acerto vira tarde perdida</strong><p>Sem documento claro, o acerto com motorista é sempre tenso. Às vezes refaz três vezes na mesma semana.</p></div></div>
            <div className="fl-vs-item"><X /><div><strong>Decisão no achismo</strong><p>Fecha o frete sem saber a margem real. Só descobre que perdeu dinheiro quando o caixa fecha no vermelho.</p></div></div>
          </div>
          <div className="fl-vs-card good">
            <div className="fl-vs-label good-l"><Check /> Com o Fleet</div>
            <div className="fl-vs-item"><Check /><div><strong>Custo real calculado automaticamente</strong><p>Cada despesa registrada no momento. O custo total sai sem você abrir uma planilha — por viagem, por motorista, por rota.</p></div></div>
            <div className="fl-vs-item"><Check /><div><strong>Acerto em 30 minutos</strong><p>O sistema calcula: proposta − despesas = acerto. Motorista vê, confere e aprova. Sem discussão, sem retrabalho.</p></div></div>
            <div className="fl-vs-item"><Check /><div><strong>Margem antes de fechar o frete</strong><p>Você vê o lucro estimado da rota antes de aceitar. Decide com número, não com instinto.</p></div></div>
          </div>
        </div>
      </div>

      {/* ── COMO FUNCIONA (vídeos do sistema) ── */}
      <div className="fl-section rev" id="como" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="fl-eyebrow">O que você vai usar</span>
          <h2 className="fl-h2">Da viagem ao acerto,<br /><em>tudo em um lugar.</em></h2>
          <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
            Não é mais um sistema pra aprender. É a sua operação atual — organizada, calculada e acessível de qualquer celular.
          </p>
        </div>

        {/* Vídeo viagens */}
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
                <video src={`${BASE}/screenshots/logcodex-fleet-viagens.mp4`} poster={`${BASE}/screenshots/logcodex-fleet-viagens-poster.jpg`} autoPlay muted loop playsInline preload="metadata" aria-label="LogCodex Fleet — registro de viagens" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>

        {/* Vídeo financeiro */}
        <div>
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
                <video src={`${BASE}/screenshots/logcodex-fleet-financeiro.mp4`} poster={`${BASE}/screenshots/logcodex-fleet-financeiro-poster.jpg`} autoPlay muted loop playsInline preload="metadata" aria-label="LogCodex Fleet — acertos financeiros" />
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
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title: 'Viagens documentadas', desc: 'Origem, destino, km e valor do frete em menos de 5 minutos. Custo real calculado automaticamente — por viagem, por motorista, por rota.' },
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: 'Financeiro completo', desc: 'Acertos com motoristas, cobranças a receber, DRE por período e despesas por viagem — do lançamento ao resultado, sem abrir planilha.' },
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg>, title: 'Despesas e combustível', desc: 'Diesel, ARLA, pedágio e manutenção lançados por viagem. Sabe exatamente quanto cada caminhão custou no mês — antes de fechar o caixa.' },
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>, title: 'Dashboard operacional', desc: 'Faturamento, margem por rota, viagens ativas e acertos pendentes — visão completa da operação em tempo real, de qualquer celular.' },
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'Assistente Fleet (IA)', desc: '"Qual rota deu mais prejuízo esse mês?" — o assistente consulta seus dados reais e responde em segundos. Sem filtro, sem relatório, sem Excel.' },
            { icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>, title: 'Propostas e clientes', desc: 'Crie propostas com rota, valor e validade. Converta em viagem com um clique e já inicie o controle de custo — da cotação ao fechamento.' },
          ] as { icon: React.ReactNode; title: string; desc: string }[]).map((f) => (
            <div className="fl-feat-card" key={f.title}>{f.icon}<h3>{f.title}</h3><p>{f.desc}</p></div>
          ))}
        </div>
      </div>

      {/* ── PROVA SOCIAL JCLS + quem é a LogCodex ── */}
      <div className="fl-section-sm rev" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div className="fl-proof-inner fl-proof">
          <div className="fl-proof-badge">✓ CLIENTE EM PRODUÇÃO</div>
          <blockquote>
            "Antes do Fleet, todo acerto com motorista virava uma tarde perdida. Agora fechamos em 30 minutos. O sistema calcula, o motorista vê e confirma — sem briga."
          </blockquote>
          <div className="fl-proof-meta">
            <div className="fl-proof-avatar">J</div>
            <div className="fl-proof-who"><strong>Junior Rodrigo</strong><span>Gestor · JCLS Transportes · Paraná</span></div>
          </div>
          <div className="fl-proof-nums">
            <div className="fl-proof-m"><div className="n">−12h</div><div className="l">por semana no acerto</div></div>
            <div className="fl-proof-m"><div className="n">~0</div><div className="l">erros de acerto</div></div>
            <div className="fl-proof-m"><div className="n">180</div><div className="l">viagens/mês</div></div>
            <div className="fl-proof-m"><div className="n">5</div><div className="l">motoristas ativos</div></div>
          </div>
          <p className="fl-about">
            Isto não é promessa de startup. O Fleet <strong>já roda na operação real da JCLS Transportes</strong>, no Paraná, todos os dias. A LogCodex constrói sistemas que ligam tecnologia à operação logística — o Fleet, controle de frota, é o primeiro produto: estável, testado e em produção.
          </p>
        </div>
      </div>

      {/* ── O QUE VOCÊ GANHA NO LOTE 1 (com embalagem 3D) ── */}
      <div className="fl-section rev" style={{ background: 'var(--fl-bg2)', borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="fl-eyebrow">Por que entrar agora</span>
          <h2 className="fl-h2">O que você leva no Lote 1</h2>
        </div>
        <div className="fl-benefits-grid">
          {/* Embalagem 3D do produto */}
          <ProductBox />

          {/* Benefícios */}
          <div className="fl-feat-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="fl-feat-card">
              <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <h3>Preço de lançamento</h3>
              <p>30% de desconto por 12 meses. Starter por R$ 69,30 (<span className="fl-strike">R$ 99</span>/mês).</p>
            </div>
            <div className="fl-feat-card">
              <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3>Onboarding assistido</h3>
              <p>A gente configura o sistema junto com você. Você não começa do zero — começa no ponto certo.</p>
            </div>
            <div className="fl-feat-card">
              <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <h3>Voz na construção</h3>
              <p>Quem entra no Lote 1 tem prioridade: o que você precisa entra na fila primeiro.</p>
            </div>
            <div className="fl-feat-card">
              <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3>Vaga garantida</h3>
              <p>São 20 vagas. Depois disso, essa condição não volta.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMO VOCÊ ENTRA ── */}
      <div className="fl-section rev" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="fl-eyebrow">Sem pegadinha</span>
          <h2 className="fl-h2">Como você entra</h2>
        </div>
        <div className="fl-steps">
          <div className="fl-step"><div className="fl-step-n">1</div><h3>Você entra na lista.</h3><p>Responde 3 perguntas rápidas sobre sua operação. Leva 30 segundos.</p></div>
          <div className="fl-step"><div className="fl-step-n">2</div><h3>A gente te chama.</h3><p>Por ordem de entrada, no WhatsApp. Você conhece o sistema com a condição do Lote 1.</p></div>
          <div className="fl-step"><div className="fl-step-n">3</div><h3>Você decide.</h3><p>Testa com a sua operação real. Só continua se fizer sentido pra você.</p></div>
        </div>
        <div className="fl-reassure"><Check /> Você não paga nada para entrar na lista. Não tem cartão, não tem contrato.</div>
      </div>

      {/* ── FORM ── */}
      <div className="fl-section-sm rev" id="vaga" style={{ background: 'var(--fl-bg2)', borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="fl-eyebrow">Garanta sua vaga</span>
          <h2 className="fl-h2">Garanta sua vaga no Lote 1</h2>
          <p className="fl-lead" style={{ margin: '0 auto' }}>Responde 3 perguntas pra gente entender sua operação. Sem enrolação.</p>
        </div>
        <LeadForm utm={utm} variant={variant} hasJs={hasJs} />
      </div>

      {/* ── FAQ ── */}
      <div className="fl-section-sm rev" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="fl-eyebrow">Dúvidas comuns</span>
          <h2 className="fl-h2">Antes de entrar,<br /><em>vale saber.</em></h2>
        </div>
        <div className="fl-faq-list">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="fl-faq"><summary>{q}</summary><p className="ans">{a}</p></details>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div className="fl-final rev">
        <h2>20 vagas.<br /><em>Depois, o preço é cheio.</em></h2>
        <p>O Fleet vai abrir pra todo mundo. Mas o preço de lançamento e o onboarding assistido são só pra quem entra no Lote 1.</p>
        <button className="fl-btn-primary" onClick={scrollTo('vaga')} style={{ fontSize: '18px', padding: '18px 40px' }}>Quero minha vaga no Lote 1 →</button>
      </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1d2335' }}>
        <div className="fl-footer">
          <a href="/fleet" className="fl-footer-brand"><LogoMark /> LogCodex Fleet</a>
          <div className="fl-footer-links">
            <a href="/fleet">Conheça o Fleet</a>
            <a href="mailto:leonardo.antunes@logcodex.com">Contato</a>
            <a href="/politica-de-privacidade">Política de privacidade</a>
          </div>
          <span style={{ fontSize: '13px', color: '#475569' }}>© 2026 LogCodex</span>
        </div>
      </footer>
    </div>
  )
}

// ── Caixa 3D de software (box volumétrico) — reutilizável (hero + benefícios) ──
function ProductBox({ scale = 1 }: { scale?: number }) {
  // wrapper com altura proporcional ao scale para não sobrar/faltar espaço no fluxo
  return (
    <div style={{ height: scale === 1 ? undefined : `${Math.round(320 * scale)}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="fl-box-stage" style={{ transform: scale === 1 ? undefined : `scale(${scale})` }}>
        <div className="fl-box3d">
          <div className="face fl-box-top" />
          <div className="face fl-box-right" />
          <div className="face fl-box-front">
            <div className="fl-box-logo"><LogoMark /></div>
            <div className="fl-box-name">LogCodex<br />Fleet</div>
            <div className="fl-box-sub">Controle de frota com IA</div>
            <div className="fl-box-seal">ACESSO ANTECIPADO<br />· LOTE 1 ·</div>
          </div>
        </div>
      </div>
      <div className="fl-box-floor" style={{ width: `${Math.round(230 * scale)}px`, margin: '0 auto' }} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// FORM MULTI-ETAPA — SSR-safe (L15/L17)
// ════════════════════════════════════════════════════════════════

type FieldErrors = { nome?: string; whatsapp?: string; email?: string; consent?: string }

function LeadForm({ utm, variant, hasJs }: { utm: Utm; variant: string; hasJs: boolean }) {
  const [step, setStep] = useState(1)
  const [qVeiculos, setQVeiculos] = useState<string | null>(null)
  const [qControle, setQControle] = useState<string | null>(null)
  const [qDor, setQDor] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sendErr, setSendErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [doneName, setDoneName] = useState<string | null>(null)

  const select = (setter: (v: string) => void, value: string, next: number) => { setter(value); setStep(next) }

  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a gente saber como te chamar.'
    if (whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Informe um WhatsApp válido com DDD. É por onde a gente te chama.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Esse e-mail não parece válido. Confira e tente de novo.'
    if (!consent) e.consent = 'Marque a caixa de consentimento para a gente poder entrar em contato.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSendErr(null)
    if (!validate()) return
    const form = ev.currentTarget as HTMLFormElement
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    const turnstileToken = (form.elements.namedItem('cf-turnstile-response') as HTMLInputElement | null)?.value ?? ''
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome, whatsapp, email, consent,
          q_veiculos: qVeiculos, q_controle: qControle, q_dor: qDor,
          website: honeypot, turnstile_token: turnstileToken, variant, ...utm,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSendErr(json.error?.message ?? json.message ?? 'Não conseguimos enviar agora. Tente de novo.')
        return
      }
      const name = json.data?.nome ?? json.nome ?? nome
      trackLeadConversion(`${qVeiculos}|${qControle}`)
      setDoneName(name)
    } catch {
      setSendErr('Não conseguimos enviar agora. Verifique sua internet e toque em "Garantir minha vaga" de novo.')
    } finally {
      setLoading(false)
    }
  }

  if (doneName) {
    return (
      <div className="fl-form-card">
        <div className="fl-confirm">
          <div className="fl-confirm-ico">
            <svg width="32" height="32" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="8.5" fill="#22c55e" fillOpacity="0.18" /><path d="M5 8.8 L7.2 11 L12 6" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h3>Pronto, {doneName}! Você está na lista. 🎉</h3>
          <p>Você é uma das transportadoras do Lote 1. Em breve a gente te chama no WhatsApp pra liberar seu acesso com a condição de lançamento — <strong style={{ color: 'var(--fl-ink)' }}>30% de desconto por 12 meses</strong>. As vagas são limitadas a 20.</p>
          <p className="micro">Pode fechar esta página. A gente te encontra.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="fl-form-card" onSubmit={onSubmit} method="post" noValidate>
      <div className="fl-hp" aria-hidden="true">
        <label>Não preencha este campo<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className={hasJs ? '' : 'hidden'}>
        <div className="fl-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
          <span className={step >= 1 ? 'on' : ''} /><span className={step >= 2 ? 'on' : ''} /><span className={step >= 3 ? 'on' : ''} /><span className={step >= 4 ? 'on' : ''} />
        </div>
        <span className="fl-progress-label">Etapa {step} de 4</span>
      </div>

      <div className={hasJs && step !== 1 ? 'hidden' : ''}>
        <p className="fl-step-q">Quantos veículos tem a sua frota?</p>
        <div className="fl-opts" role="radiogroup" aria-label="Quantos veículos tem a sua frota?">
          {Q_VEICULOS.map((opt) => (
            <button type="button" key={opt} role="radio" aria-checked={qVeiculos === opt} className={`fl-opt${qVeiculos === opt ? ' sel' : ''}`} onClick={() => select(setQVeiculos, opt, 2)}>{opt}{qVeiculos === opt && <Check />}</button>
          ))}
        </div>
      </div>

      <div className={hasJs && step === 2 ? '' : 'hidden'}>
        <button type="button" className="fl-back" onClick={() => setStep(1)}>← Voltar</button>
        <p className="fl-step-q">Como você controla a frota hoje?</p>
        <div className="fl-opts" role="radiogroup" aria-label="Como você controla a frota hoje?">
          {Q_CONTROLE.map((opt) => (
            <button type="button" key={opt} role="radio" aria-checked={qControle === opt} className={`fl-opt${qControle === opt ? ' sel' : ''}`} onClick={() => select(setQControle, opt, 3)}>{opt}{qControle === opt && <Check />}</button>
          ))}
        </div>
      </div>

      <div className={hasJs && step === 3 ? '' : 'hidden'}>
        <button type="button" className="fl-back" onClick={() => setStep(2)}>← Voltar</button>
        <p className="fl-step-q">O que mais te incomoda hoje?</p>
        <div className="fl-opts" role="radiogroup" aria-label="O que mais te incomoda hoje?">
          {Q_DOR.map((opt) => (
            <button type="button" key={opt} role="radio" aria-checked={qDor === opt} className={`fl-opt${qDor === opt ? ' sel' : ''}`} onClick={() => select(setQDor, opt, 4)}>{opt}{qDor === opt && <Check />}</button>
          ))}
        </div>
      </div>

      <div className={hasJs && step === 4 ? '' : 'hidden'}>
        <button type="button" className="fl-back" onClick={() => setStep(3)}>← Voltar</button>
        <p className="fl-step-q">Quase lá. Pra onde mandamos sua vaga?</p>

        <div className="fl-field">
          <label htmlFor="lc-nome">Seu nome</label>
          <input id="lc-nome" name="nome" className={`fl-input${errors.nome ? ' err' : ''}`} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João da Silva" autoComplete="name" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'err-nome' : undefined} />
          {errors.nome && <p className="fl-field-err" id="err-nome">{errors.nome}</p>}
        </div>

        <div className="fl-field">
          <label htmlFor="lc-wpp">WhatsApp</label>
          <input id="lc-wpp" name="whatsapp" className={`fl-input${errors.whatsapp ? ' err' : ''}`} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? 'err-wpp' : undefined} />
          {errors.whatsapp && <p className="fl-field-err" id="err-wpp">{errors.whatsapp}</p>}
        </div>

        <div className="fl-field">
          <label htmlFor="lc-email">E-mail</label>
          <input id="lc-email" name="email" type="email" className={`fl-input${errors.email ? ' err' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com.br" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
          {errors.email && <p className="fl-field-err" id="err-email">{errors.email}</p>}
        </div>

        <label className="fl-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} />
          <span>Aceito receber contato da LogCodex sobre o Fleet. <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de privacidade</a></span>
        </label>
        {errors.consent && <p className="fl-field-err" style={{ marginTop: '-8px', marginBottom: '12px' }}>{errors.consent}</p>}

        {TURNSTILE_SITE_KEY ? <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} style={{ marginBottom: '16px' }} /> : null}
        {sendErr && <div className="fl-send-err">{sendErr}</div>}

        <button type="submit" className="fl-submit" disabled={loading}>{loading ? 'Garantindo sua vaga…' : 'Garantir minha vaga →'}</button>
        <p className="fl-submit-hint">Leva 30 segundos · a gente só te chama no WhatsApp</p>
      </div>

      <noscript>
        <button type="submit" className="fl-submit" style={{ marginTop: '16px' }}>Continuar</button>
      </noscript>
    </form>
  )
}
