'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ContactModalHome, type ContactIntent } from '../contato/ContactModalHome'
import { FleetChat } from '../FleetChat'
import { FleetShaderBackground } from './FleetShaderBackground'
import { FleetWhatsApp } from './FleetWhatsApp'
import { FleetIntegracoes } from './FleetIntegracoes'
import { FleetFaq } from './FleetFaq'
import { FleetMarquee } from './FleetMarquee'
import { FLEET_MARQUEE_ROW_A, FLEET_MARQUEE_ROW_B } from '../home/marquee-data'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Monograma do Fleet — arte fornecida pelo Leonardo (badge dourado com
// caminhão e rede neural sobre o baú). O PNG em /public já vem recortado nos
// cantos arredondados e com fundo transparente, então assenta sobre qualquer
// fundo da página sem moldura visível. `width`/`height` fixam o tamanho de
// exibição; o arquivo tem 512px para ficar nítido em telas retina.
const LogoMark = () => (
  <Image
    src={`${BASE}/fleet-icon.png`}
    alt="Fleet.ai"
    width={42}
    height={42}
    priority
    style={{ flexShrink: 0, display: 'block' }}
  />
)

// O que está incluso na implantação. O ícone é o miolo de um <svg> comum
// (stroke currentColor), então herda a cor do card e o estado de hover.
const INCLUSO = [
  {
    t: 'Diagnóstico completo',
    d: 'Mapeamento da sua operação antes de qualquer proposta.',
    icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  },
  {
    t: 'Integração com sistemas existentes',
    d: 'Planilhas, sistema legado, apps de rastreamento — conectados, não descartados.',
    icon: <><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 0 1 0 10h-2" /><path d="M8 12h8" /></>,
  },
  {
    t: 'Personalização da solução',
    d: 'A base Fleet ajustada ao seu porte e sua rotina.',
    icon: <><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M1 14h6" /><path d="M9 8h6" /><path d="M17 16h6" /></>,
  },
  {
    t: 'Implantação assistida',
    d: 'A LogCodex conduz a implantação — sua equipe não carrega o projeto sozinha.',
    icon: <><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
  },
  {
    t: 'Capacitação do time',
    d: 'Treinamento real, no ritmo da sua operação.',
    icon: <><path d="M12 3 2 8l10 5 10-5Z" /><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" /></>,
  },
  {
    t: 'Suporte técnico consultivo',
    d: 'Acompanhamento contínuo depois do go-live, não só ticket.',
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></>,
  },
]

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
  const [intent, setIntent] = useState<ContactIntent>(null)
  const [wordIndex, setWordIndex] = useState(0)

  const openModal = (nextIntent: ContactIntent = 'agendar') => {
    setIntent(nextIntent)
    setModalOpen(true)
  }

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const nav = document.getElementById('fl-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Seleciona todas as variantes de revelação (rev, rev-fade, rev-zoom…).
    const alvos = document.querySelectorAll<HTMLElement>('.fl-root [class*="rev"]')

    // Sem IntersectionObserver não há como saber o que entrou na tela: revela
    // tudo de uma vez, porque conteúdo invisível para sempre é pior que
    // conteúdo sem animação. Esse é o ÚNICO caso que dispensa o scroll.
    if (!('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('in'))
      return () => window.removeEventListener('scroll', onScroll)
    }

    // Antes havia um setTimeout de 1400ms que marcava TODAS as seções como
    // visíveis independentemente do scroll — por isso a landing não animava ao
    // navegar: 1,4s depois de carregar, a página inteira já estava revelada e
    // não sobrava nada para acontecer na rolagem.
    const io = new IntersectionObserver(
      (es) => { for (const e of es) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } } },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    alvos.forEach((el) => io.observe(el))

    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  return (
    <div className="fl-root">
      <ContactModalHome open={modalOpen} onClose={() => setModalOpen(false)} intent={intent} />
      <style>{`
        :root{--fl-bg:#0a0a0a;--fl-bg2:#121212;--fl-bg3:#1a1a1a;--fl-line:#292929;--fl-ink:#f2f0ec;--fl-ink2:#a3a09a;--fl-ink3:#5c5952;--fl-accent:#c9a876;--fl-accent-ink:#1a1712;--fl-green:#22c55e;--fl-red:#ef4444;--fl-amber:#f59e0b;--fl-ease:cubic-bezier(.16,1,.3,1)}
        /* overflow-x:clip contém o deslize lateral das seções (rev-left /
           rev-right): elas ocupam a largura toda, então transladar 26px joga a
           caixa inteira para fora da viewport e cria barra de rolagem
           horizontal enquanto a animação não termina. Usar "clip" em vez de
           "hidden" é proposital — hidden criaria um container de rolagem e
           afetaria o nav fixo; clip só recorta. */
        .fl-root{background:var(--fl-bg);color:var(--fl-ink);min-height:100vh;font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:clip}
        .fl-root *{box-sizing:border-box;margin:0;padding:0}
        /* NAV */
        #fl-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;transition:background .3s,backdrop-filter .3s}
        #fl-nav.scrolled{background:rgba(9,11,15,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--fl-line)}
        .fl-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:#fff;text-decoration:none;letter-spacing:-.01em}
        .fl-nav-cta{background:var(--fl-accent);color:var(--fl-accent-ink);padding:10px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:.01em;transition:opacity .15s;border:none;cursor:pointer;font-family:inherit}
        .fl-nav-cta:hover{opacity:.88}

        /* HERO */
        .fl-hero{padding:130px 40px 80px;text-align:center;max-width:860px;margin:0 auto}
        .fl-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,118,.1);border:1px solid rgba(201,168,118,.28);color:#ddc49a;padding:6px 16px;border-radius:100px;font-size:12.5px;font-weight:600;margin-bottom:28px;letter-spacing:.06em}
        .fl-hero-badge .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 7px #22c55e;animation:pulse 2.2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .fl-hero h1{font-size:clamp(38px,7.5vw,82px);line-height:1.04;font-weight:800;letter-spacing:-.035em;margin-bottom:22px;color:#fff}
        .fl-hero h1 em{font-style:normal;color:rgba(255,255,255,.38)}
        .fl-hero-sub{font-size:clamp(16px,2vw,20px);color:var(--fl-ink2);line-height:1.65;max-width:580px;margin:0 auto 36px;font-weight:400}
        .fl-hero-sub strong{color:var(--fl-ink);font-weight:600}

        /* CTA principal */
        .fl-btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--fl-accent);color:var(--fl-accent-ink);padding:16px 32px;border-radius:12px;font-size:17px;font-weight:800;text-decoration:none;border:none;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .2s;letter-spacing:-.01em}
        .fl-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(201,168,118,.35)}
        .fl-btn-ghost{display:inline-flex;align-items:center;gap:6px;color:var(--fl-ink2);font-size:15px;font-weight:500;padding:12px 20px;border-radius:10px;border:1px solid var(--fl-line);text-decoration:none;transition:color .15s,border-color .15s;background:none;cursor:pointer;font-family:inherit}
        .fl-btn-ghost:hover{color:var(--fl-ink);border-color:rgba(255,255,255,.18)}
        .fl-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
        .fl-fine{font-size:13px;color:var(--fl-ink3);text-align:center;margin-top:8px}

        /* LAPTOP MOCKUP */
        .fl-laptop{position:relative;width:100%;max-width:960px;margin:0 auto}
        .fl-laptop-sm{max-width:520px}
        .fl-laptop-frame{background:#1c1c1c;border-radius:12px 12px 0 0;border:2px solid #2a2a2a;padding:10px 10px 0;box-shadow:0 40px 100px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04)}
        .fl-laptop-bar{background:#141414;border-radius:8px 8px 0 0;height:26px;display:flex;align-items:center;padding:0 12px;gap:6px;margin-bottom:8px}
        .fl-laptop-dot{width:10px;height:10px;border-radius:50%}
        .fl-laptop-screen{border-radius:4px;overflow:hidden;border:1px solid #1e2330}
        .fl-laptop-screen img{width:100%;display:block}
        .fl-laptop-base{background:linear-gradient(to bottom,#1c1c1c,#141414);height:16px;border-radius:0 0 4px 4px;border:2px solid #2a2a2a;border-top:none;width:100%}
        .fl-laptop-foot{background:#121212;height:9px;border-radius:0 0 14px 14px;width:40%;margin:0 auto;border:1px solid #2a2a2a;border-top:none}

        /* SECTION LAYOUT */
        .fl-section{padding:80px 40px;max-width:1100px;margin:0 auto}
        .fl-section-sm{padding:80px 40px;max-width:860px;margin:0 auto}
        /* 13.5px: os rótulos de seção estavam pequenos demais para separar
           blocos numa página longa. */
        .fl-eyebrow{font-size:13.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--fl-accent);margin-bottom:14px;display:block}
        /* Rótulo numerado de módulo ("01 · Viagens e rotas"): é divisor de
           capítulo, não legenda — em 12px sumia ao lado do título. Ganha
           corpo, um filete dourado e o número destacado. */
        .fl-eyebrow-num{
          font-size:clamp(17px,2.2vw,23px);font-weight:800;letter-spacing:-.01em;
          text-transform:none;color:var(--fl-ink);margin-bottom:18px;
          display:inline-flex;align-items:center;gap:12px;
        }
        .fl-eyebrow-num::before{
          content:'';width:34px;height:2px;border-radius:2px;
          background:linear-gradient(90deg,var(--fl-accent),transparent);
        }
        .fl-eyebrow-num b{color:var(--fl-accent);font-weight:800}
        .fl-h2{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin-bottom:16px}
        .fl-h2 em{font-style:normal;color:var(--fl-ink2)}
        .fl-lead{font-size:17px;color:var(--fl-ink2);line-height:1.7;max-width:520px}

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
        .fl-feat-card:hover{border-color:rgba(201,168,118,.35)}
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

        /* INCLUSO — cards temáticos, sem preço */
        .fl-incluso-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px;align-items:start}
        .fl-incluso-card{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:16px;padding:30px}
        /* Atraso escalonado: cada card entra ~90ms depois do anterior.
           O seletor precisa de 3 classes porque a regra .fl-root .rev-zoom usa
           a forma curta "transition", que zera o transition-delay — com menos
           especificidade que ela, o atraso era descartado e os 6 cards
           apareciam juntos. */
        .fl-root .fl-incluso-card.rev-zoom{transition-delay:calc(var(--i,0) * 90ms)}
        .fl-incluso-icon{
          display:inline-flex;align-items:center;justify-content:center;
          width:42px;height:42px;margin-bottom:16px;border-radius:11px;
          background:rgba(201,168,118,.1);border:1px solid rgba(201,168,118,.22);
          color:var(--fl-accent);
          transition:background .25s var(--fl-ease),border-color .25s var(--fl-ease),transform .25s var(--fl-ease);
        }
        .fl-incluso-icon svg{width:20px;height:20px}
        .fl-incluso-card:hover .fl-incluso-icon{
          background:rgba(201,168,118,.18);border-color:rgba(201,168,118,.45);transform:translateY(-2px);
        }
        .fl-incluso-card h3{font-size:17px;font-weight:700;margin-bottom:10px;letter-spacing:-.015em}
        .fl-incluso-card p{font-size:13.5px;color:var(--fl-ink2);line-height:1.6}

        /* OBJEÇÕES / FAQ */
        /* FAQ deixou de ser <details> nativo (abria sem animação) e virou
           botão controlado em FleetFaq.tsx — mesmo tratamento da home. */
        .fl-faq-list{display:flex;flex-direction:column}
        .fl-faq{border-bottom:1px solid var(--fl-line)}
        .fl-faq-q{
          width:100%;display:flex;align-items:flex-start;justify-content:space-between;
          gap:20px;padding:20px 0;background:none;border:none;text-align:left;
          font-family:inherit;font-size:16px;font-weight:600;letter-spacing:-.01em;
          color:var(--fl-ink);cursor:pointer;transition:color .2s var(--fl-ease)
        }
        .fl-faq-q:hover{color:var(--fl-accent)}
        .fl-faq-chevron{
          width:18px;height:18px;flex-shrink:0;margin-top:2px;color:var(--fl-ink3);
          transition:transform .35s var(--fl-ease),color .2s var(--fl-ease)
        }
        .fl-faq-open .fl-faq-chevron{transform:rotate(180deg);color:var(--fl-accent)}
        /* 0fr → 1fr: anima sem medir altura em pixel. */
        .fl-faq-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .38s var(--fl-ease)}
        .fl-faq-open .fl-faq-wrap{grid-template-rows:1fr}
        .fl-faq-inner{overflow:hidden}
        .fl-faq .ans{
          padding:0 0 20px;font-size:15px;color:var(--fl-ink2);line-height:1.7;max-width:640px;
          opacity:0;transform:translateY(-4px);
          transition:opacity .3s var(--fl-ease),transform .3s var(--fl-ease)
        }
        .fl-faq-open .ans{opacity:1;transform:none;transition-delay:.08s}
        @media(prefers-reduced-motion:reduce){
          .fl-faq-wrap,.fl-faq-chevron,.fl-faq .ans{transition:none}
        }

        /* CTA FINAL */
        .fl-final{padding:120px 40px;text-align:center;background:radial-gradient(ellipse 70% 55% at 50% 100%,rgba(201,168,118,.11),transparent)}
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
        .fl-ai-grid{display:flex;flex-direction:column;align-items:center;gap:48px;max-width:780px;margin:64px auto 0;text-align:center}
        .fl-ai-eyebrow{font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--fl-accent);margin-bottom:16px;display:block}
        .fl-ai-title{font-size:clamp(26px,3.5vw,42px);font-weight:800;letter-spacing:-.035em;line-height:1.06;margin-bottom:20px;color:#fff}
        .fl-ai-desc{font-size:16px;color:var(--fl-ink2);line-height:1.7;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto}
        .fl-ai-metrics{display:flex;flex-direction:row;gap:12px;justify-content:center;flex-wrap:wrap}
        .fl-ai-metric{display:flex;align-items:center;gap:10px;padding:10px 18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px}
        .fl-ai-metric-n{font-size:18px;font-weight:800;letter-spacing:-.03em;color:var(--fl-accent);flex-shrink:0}
        .fl-ai-metric-l{font-size:13px;color:var(--fl-ink2);line-height:1.4;text-align:left}
        @media(max-width:600px){.fl-ai-metrics{flex-direction:column}.fl-ai-grid{gap:36px;margin-top:48px}}

        /* REVEAL — variantes para o movimento não ficar igual em toda seção,
           mesmo princípio já usado na home. Todas suaves e discretas. */
        .fl-root .rev{opacity:0;transform:translateY(22px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev-fade{opacity:0;transition:opacity 1.1s var(--fl-ease)}
        .fl-root .rev-zoom{opacity:0;transform:scale(.955);transition:opacity .95s var(--fl-ease),transform .95s var(--fl-ease)}
        .fl-root .rev-left{opacity:0;transform:translateX(-26px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev-right{opacity:0;transform:translateX(26px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev.in,.fl-root .rev-fade.in,.fl-root .rev-zoom.in,
        .fl-root .rev-left.in,.fl-root .rev-right.in{opacity:1;transform:none}
        @media(prefers-reduced-motion:reduce){
          .fl-root .rev,.fl-root .rev-fade,.fl-root .rev-zoom,
          .fl-root .rev-left,.fl-root .rev-right{opacity:1;transform:none;transition:none}
        }

        /* MOBILE */
        @media(max-width:600px){
          #fl-nav{padding:14px 20px}
          .fl-hero{padding:110px 20px 60px}
          .fl-section,.fl-section-sm{padding:60px 20px}
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
          Fleet.ai
        </a>
        <button type="button" className="fl-nav-cta" onClick={() => openModal('agendar')}>Falar com especialista</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <FleetShaderBackground />
        {/* overlay escuro igual ao site */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.52) 50%, rgba(10,10,10,0.92) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,40px) clamp(60px,8vh,100px)' }}>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 7px #4ade80', animation: 'pulse 2.2s infinite' }} />
            Em produção
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
                  style={{ display: 'block', color: 'transparent', backgroundImage: 'linear-gradient(90deg, #c9a876, #e4c896)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
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
            style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 32px' }}
          >
            O Fleet é a base de controle de frota que já colocamos em operação real — viagens, acertos e financeiro, sem planilha. É um exemplo do que a LogCodex implanta sob medida para a sua transportadora.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}
          >
            <button type="button" onClick={() => openModal('agendar')} style={{ padding: '15px 32px', borderRadius: '12px', background: '#fff', color: '#0c0d0f', fontSize: '16px', fontWeight: 800, textDecoration: 'none', transition: 'transform .15s', letterSpacing: '-.01em', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Falar com especialista →</button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.22)', marginBottom: '40px' }}
          >
            Diagnóstico sem compromisso · a solução é desenhada para a sua operação
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
            <FleetChat onOpenContact={() => openModal('agendar')} />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.15)', marginTop: '10px', textAlign: 'center' }}>
              Pergunte como perguntaria para um gerente da sua operação
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── GRID ASSISTENTE (texto + GIF lado a lado, mockup reduzido) ── */}
      <div style={{ background: 'var(--fl-bg)', borderBottom: '1px solid var(--fl-line)', padding: '0 40px 80px' }}>
        <div className="fl-ai-grid rev-zoom">
          {/* Texto */}
          <div>
            <span className="fl-ai-eyebrow">Assistente Fleet · IA</span>
            <h3 className="fl-ai-title">
              Pergunte qualquer coisa<br />sobre sua operação.
            </h3>
            <p className="fl-ai-desc">
              "Qual motorista deu mais prejuízo esse mês?" — o assistente consulta os dados reais e responde em segundos. Sem abrir relatório, sem filtrar planilha. Esse é o tipo de automação que a LogCodex aplica na operação de cada cliente.
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

          {/* Mockup — tamanho reduzido */}
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

      {/* ── ASSISTENTE NO WHATSAPP ──
          Vem logo depois do assistente no desktop: é o mesmo recurso, agora no
          celular — a leitura natural é "no computador… e também no WhatsApp". */}
      <FleetWhatsApp />

      {/* ── INTEGRAÇÕES ──
          Depois do WhatsApp de propósito: a seção anterior mostra UM canal
          funcionando, esta responde "e as outras ferramentas que eu uso?". */}
      <FleetIntegracoes />

      {/* ── ANTES vs DEPOIS ── */}
      <div className="fl-section rev">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="fl-eyebrow">O problema que essa base resolve</span>
          <h2 className="fl-h2" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Você sabe quanto <em>faturou</em> esse mês.<br />
            Mas sabe quanto <em>sobrou?</em>
          </h2>
        </div>
        <div className="fl-vs">
          <div className="fl-vs-card bad">
            <div className="fl-vs-label bad-l"><X /> Sem controle integrado</div>
            <div className="fl-vs-item">
              <X />
              <div>
                <strong>Custo real da viagem: desconhecido</strong>
                <p>Combustível, pedágio e manutenção somem entre notas fiscais e WhatsApp. O mês fecha sem saber se lucrou.</p>
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
            <div className="fl-vs-label good-l"><Check /> Com a base Fleet implantada</div>
            <div className="fl-vs-item">
              <Check />
              <div>
                <strong>Custo real calculado automaticamente</strong>
                <p>Cada despesa registrada no momento. O custo total sai sem abrir planilha — por viagem, por motorista, por rota.</p>
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
                <p>O lucro estimado da rota aparece antes de aceitar. Decisão com número, não com instinto.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMO FUNCIONA ── */}
      <div className="fl-section rev-left" id="como" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="fl-eyebrow">Como funciona na prática</span>
          <h2 className="fl-h2">Da viagem ao acerto,<br /><em>tudo em um lugar.</em></h2>
          <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
            Não é mais um sistema pra aprender do zero. É a operação atual da transportadora — organizada, calculada e acessível de qualquer celular. A LogCodex implanta essa base ajustada à sua rotina.
          </p>
        </div>

        {/* GIF viagens */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="fl-eyebrow fl-eyebrow-num"><b>01</b> · Viagens e rotas</span>
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
                <video src={`${BASE}/screenshots/logcodex-fleet-viagens.mp4`} autoPlay muted loop playsInline preload="metadata" aria-label="Fleet.ai — registro de viagens" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>

        {/* GIF financeiro */}
        <div>
          <style>{`
            .fl-fin-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px}
            @media(max-width:860px){.fl-fin-cards{grid-template-columns:1fr 1fr}}
            @media(max-width:500px){.fl-fin-cards{grid-template-columns:1fr}}
          `}</style>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="fl-eyebrow fl-eyebrow-num"><b>02</b> · Financeiro</span>
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
              { t: 'Cobranças e propostas', d: 'Propostas com validade e valor por rota. Convertidas em cobrança com um clique.' },
              { t: 'DRE por período', d: 'Receita, despesas e resultado líquido por semana, mês ou rota — sem esperar fechar o mês.' },
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
                <video src={`${BASE}/screenshots/logcodex-fleet-financeiro.mp4`} autoPlay muted loop playsInline preload="metadata" aria-label="Fleet.ai — acertos financeiros" />
              </div>
            </div>
            <div className="fl-laptop-base" />
            <div className="fl-laptop-foot" />
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="fl-section rev-right" style={{ background: 'var(--fl-bg2)', borderTop: '1px solid var(--fl-line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="fl-eyebrow">O que essa base cobre</span>
          <h2 className="fl-h2">Controle completo da operação.<br /><em>Ajustado ao seu dia a dia.</em></h2>
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
              desc: '"Qual rota deu mais prejuízo esse mês?" — o assistente consulta os dados reais e responde em segundos. Sem filtro, sem relatório, sem Excel.',
            },
            {
              icon: <svg className="fl-feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
              title: 'Propostas e clientes',
              desc: 'Propostas com rota, valor e validade. Convertidas em viagem com um clique, já iniciando o controle de custo — da cotação ao fechamento.',
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

      {/* ── SÍNTESE (marquee) ── */}
      <FleetMarquee rowA={FLEET_MARQUEE_ROW_A} rowB={FLEET_MARQUEE_ROW_B} />

      {/* ── PROVA SOCIAL ──
          O depoimento nominal foi removido a pedido do Leonardo (17/08/2026).
          Substituído por prova genérica: afirma que o produto roda em operação
          real, sem identificar o cliente. */}
      <div className="fl-section-sm rev" style={{ background: 'var(--fl-bg)', borderTop: '1px solid var(--fl-line)' }}>
        <div className="fl-proof-inner">
          <div className="fl-proof-badge">✓ EM PRODUÇÃO</div>
          <blockquote>
            Não é protótipo nem promessa: o Fleet.ai roda todos os dias numa transportadora real, com viagens, acertos de motorista e financeiro de verdade passando pelo sistema.
          </blockquote>
          <div className="fl-proof-nums">
            <div className="fl-proof-m">
              <div className="n">Diário</div>
              <div className="l">uso em operação real</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">Acerto</div>
              <div className="l">de horas para minutos</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">WhatsApp</div>
              <div className="l">sem app novo pro motorista</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── O QUE ESTÁ INCLUSO NA IMPLANTAÇÃO (substitui a seção de planos) ── */}
      {/* Sem classe de revelação no wrapper: se a seção inteira aparecesse de
          uma vez, o escalonamento dos cards ficaria invisível. Cabeçalho e
          cards são revelados separadamente. */}
      <div className="fl-section" id="incluso" style={{ borderTop: '1px solid var(--fl-line)' }}>
        <div className="rev" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="fl-eyebrow">Como a LogCodex implanta essa base</span>
          <h2 className="fl-h2">Não é uma licença.<br /><em>É a operação implantada por nós.</em></h2>
          <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
            O Fleet é a base que já colocamos em produção. Para a sua transportadora, a solução é desenhada a partir de um diagnóstico da sua rotina — o que muda é o que sua operação precisa, não um pacote fechado.
          </p>
        </div>
        <div className="fl-incluso-grid">
          {INCLUSO.map((item, i) => (
            // O atraso escalonado faz os cards entrarem em sequência em vez de
            // todos de uma vez — a variável é lida pelo CSS de transition-delay.
            <div
              key={item.t}
              className="fl-incluso-card rev-zoom"
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="fl-incluso-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
              </span>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button type="button" className="fl-btn-primary" onClick={() => openModal('agendar')}>
            Falar com especialista →
          </button>
        </div>
      </div>

      {/* ── OBJEÇÕES / FAQ ── */}
      <div className="fl-section-sm rev-fade" style={{ borderTop: '1px solid var(--fl-line)', background: 'var(--fl-bg2)' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="fl-eyebrow">Dúvidas comuns</span>
          <h2 className="fl-h2">Antes de conversar,<br /><em>vale saber.</em></h2>
        </div>
        <FleetFaq />
      </div>

      {/* ── CTA FINAL ── */}
      <div className="fl-final rev">
        <h2>Saiba quanto sobra<br /><em>em cada viagem.</em></h2>
        <p>Conte como sua operação funciona hoje. A gente faz o diagnóstico e desenha a solução — usando o Fleet, integrando a outros sistemas, ou construindo o que fizer sentido.</p>
        <button type="button" className="fl-btn-primary" onClick={() => openModal('agendar')} style={{ fontSize: '18px', padding: '18px 40px' }}>
          Falar com especialista →
        </button>
        <p className="fl-fine" style={{ marginTop: '16px' }}>Sem compromisso · retorno pelo WhatsApp</p>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1d2335' }}>
        <div className="fl-footer">
          <a href="/" className="fl-footer-brand">
            <LogoMark />
            Fleet.ai
          </a>
          <div className="fl-footer-links">
            <a href="/">logcodex.com</a>
            <a href="mailto:leonardo.antunes@logcodex.com">Contato</a>
            <a href="#incluso">Como implantamos</a>
          </div>
          <span style={{ fontSize: '13px', color: '#475569' }}>© 2026 LogCodex</span>
        </div>
      </footer>
    </div>
  )
}
