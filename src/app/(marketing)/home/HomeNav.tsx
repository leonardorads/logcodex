'use client'

import { useEffect, useState } from 'react'
import { LogoMark } from './LogoMark'

const LINKS = [
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#metodo', label: 'Como entregamos' },
  { href: '#incluso', label: 'O que está incluso' },
  { href: '#capacidades', label: 'Capacidades' },
  { href: '#faq', label: 'FAQ' },
]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function HomeNav({ onOpenContact }: { onOpenContact: (intent: 'agendar' | null) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const nav = document.getElementById('lcx-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setDrawerOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <style>{`
        .nav-toggle {
          display: none; background: none; border: none; cursor: pointer;
          color: var(--ink); padding: 8px; margin: -8px;
        }
        .nav-toggle svg { width: 22px; height: 22px; display: block; }
        .nav-drawer {
          position: fixed; inset: 0; z-index: 60;
          background: rgba(12,13,15,0.97);
          backdrop-filter: blur(12px);
          display: flex; flex-direction: column;
          padding: 96px 28px 40px;
          animation: nav-drawer-in .18s ease;
        }
        @keyframes nav-drawer-in { from { opacity: 0 } to { opacity: 1 } }
        .nav-drawer a {
          font-size: 22px; font-weight: 400; color: var(--ink);
          padding: 16px 0; border-bottom: 1px solid var(--line);
        }
        .nav-drawer .nav-drawer-cta {
          margin-top: 32px; text-align: center;
          padding: 15px 24px; border-radius: 10px;
          background: #fff; color: #0c0d0f; font-weight: 700; font-size: 15px;
        }
        @media (max-width: 800px) {
          .lcx-root .nav-links { display: none; }
          .nav-toggle { display: block; }
        }
      `}</style>

      <nav id="lcx-nav">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <LogoMark />
          LogCodex
        </a>
        <div className="nav-links">
          {LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={go(href.slice(1))}>{label}</a>
          ))}
        </div>
        <a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); onOpenContact('agendar') }}>
          Falar com especialista
        </a>
        <button className="nav-toggle" aria-label="Abrir menu" onClick={() => setDrawerOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {drawerOpen && (
        <div className="nav-drawer">
          <button className="nav-toggle" aria-label="Fechar menu" style={{ position: 'absolute', top: 24, right: 20 }} onClick={() => setDrawerOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={go(href.slice(1))}>{label}</a>
          ))}
          <a
            href="#"
            className="nav-drawer-cta"
            onClick={(e) => { e.preventDefault(); setDrawerOpen(false); onOpenContact('agendar') }}
          >
            Falar com especialista
          </a>
        </div>
      )}
    </>
  )
}
