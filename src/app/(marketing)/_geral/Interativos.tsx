'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ContactModalHome } from '../contato/ContactModalHome'
import { precarregarHorarios } from '../contato/AgendaPicker'
import { Icone } from './Icone'
import { Cubo } from './Marca'

// Peças pequenas com clique, separadas do resto da página (que é estática).

// "Falar com especialista": só avisa por um evento; a janela da agenda tem
// estado próprio, então o clique não redesenha a página inteira (lição da
// /hospedagem, 09/10: meio segundo de atraso medido).
const EVENTO_AGENDA = 'hg:abrir-agenda'

export function BotaoAgenda({ children = 'Falar com especialista', variante = 'primario', className = '' }: { children?: ReactNode; variante?: 'primario' | 'nav' | 'claro'; className?: string }) {
  const precarregar = () => {
    precarregarHorarios().catch(() => {})
  }
  return (
    <button
      type="button"
      className={`hg-btn hg-btn--${variante} ${className}`}
      onClick={() => window.dispatchEvent(new Event(EVENTO_AGENDA))}
      onPointerEnter={precarregar}
      onFocus={precarregar}
    >
      <span>{children}</span>
      <Icone nome="seta" className="hg-btn__seta" />
    </button>
  )
}

export function Agenda() {
  const [aberta, setAberta] = useState(false)
  useEffect(() => {
    const abrir = () => setAberta(true)
    window.addEventListener(EVENTO_AGENDA, abrir)
    // Horários buscados com a página aberta: ao clicar, a agenda já vem pronta.
    precarregarHorarios().catch(() => {})
    return () => window.removeEventListener(EVENTO_AGENDA, abrir)
  }, [])
  return <ContactModalHome open={aberta} onClose={() => setAberta(false)} nicho="geral" classeExtra="cm--hg" marca={<Cubo className="hg-cubo--modal" />} />
}

// Entrada das seções ao rolar (piso da skill site-entregue-sem-animacao):
// cada [data-rev] sobe com fade uma vez, escalonado em 90 ms entre irmãos, e o
// ícone de traço dentro dele se desenha. Quem esconde é o CSS, só com a classe
// `hg-js` na raiz (posta por um script antes da pintura): sem JS, ou com
// "reduzir movimento", nada fica invisível.
export function Movimento() {
  useEffect(() => {
    const raiz = document.documentElement
    if (!raiz.classList.contains('hg-js')) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('.hg [data-rev]'))
    for (const el of els) {
      const irmaos = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-rev')) : [el]
      el.style.setProperty('--i', String(Math.max(0, irmaos.indexOf(el))))
    }
    raiz.classList.add('hg-pronto')
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))

    // Cartões fluidos: a luz segue o mouse. Um ouvinte só, para a página toda.
    let quadro = 0
    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const card = (e.target as HTMLElement).closest?.<HTMLElement>('.hg-luz')
      if (!card) return
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
      })
    }
    // Clique na marca: o cubo se desmonta e monta de novo (como na /hospedagem).
    const aoClicar = (e: MouseEvent) => {
      const cubo = (e.target as HTMLElement).closest?.('.hg-marca, .hg-fecho__logo')?.querySelector('.hg-cubo')
      if (!cubo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      cubo.classList.remove('hg-cubo--anima')
      void cubo.getBoundingClientRect()
      cubo.classList.add('hg-cubo--anima')
    }
    document.addEventListener('pointermove', aoMover, { passive: true })
    document.addEventListener('click', aoClicar)
    return () => {
      io.disconnect()
      cancelAnimationFrame(quadro)
      document.removeEventListener('pointermove', aoMover)
      document.removeEventListener('click', aoClicar)
    }
  }, [])
  return null
}

// Script que roda antes da pintura: liga o modo "com movimento" (esconde o que
// vai entrar) e, se o JS da página não carregar em 3 s, desliga, para nada
// ficar escondido para sempre.
export const SCRIPT_MOVIMENTO = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('hg-js');setTimeout(function(){if(!d.classList.contains('hg-pronto'))d.classList.remove('hg-js')},3000)}catch(e){}})()`

// Menu com "Setores" e gaveta no celular.
export function MenuSetores({ setores }: { setores: readonly { href: string; label: string; detalhe: string }[] }) {
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    if (!aberto) return
    const fechar = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest('.hg-setores')) return
      setAberto(false)
    }
    document.addEventListener('click', fechar)
    document.addEventListener('keydown', fechar)
    return () => {
      document.removeEventListener('click', fechar)
      document.removeEventListener('keydown', fechar)
    }
  }, [aberto])
  return (
    <div className="hg-setores">
      <button type="button" className="hg-setores__botao" aria-expanded={aberto} aria-controls="hg-setores-lista" onClick={() => setAberto((v) => !v)}>
        Setores
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div id="hg-setores-lista" className={`hg-setores__lista ${aberto ? 'hg-setores__lista--aberta' : ''}`} hidden={!aberto}>
        {setores.map((s) => (
          <a key={s.href} href={s.href}>
            <b>{s.label}</b>
            <small>{s.detalhe}</small>
          </a>
        ))}
      </div>
    </div>
  )
}

export function Gaveta({ links, setores, linkZap }: { links: readonly { href: string; label: string }[]; setores: readonly { href: string; label: string; detalhe: string }[]; linkZap: string }) {
  const [aberta, setAberta] = useState(false)
  useEffect(() => {
    document.body.style.overflow = aberta ? 'hidden' : ''
    if (!aberta) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberta(false)
    document.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', esc)
    }
  }, [aberta])
  return (
    <>
      <button type="button" className="hg-nav__menu" aria-label="Abrir menu" aria-expanded={aberta} aria-controls="hg-gaveta" onClick={() => setAberta(true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <div id="hg-gaveta" className={`hg-gaveta ${aberta ? 'hg-gaveta--aberta' : ''}`} hidden={!aberta}>
        <button type="button" className="hg-gaveta__fechar" aria-label="Fechar menu" onClick={() => setAberta(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <nav aria-label="Menu">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberta(false)}>{l.label}</a>
          ))}
          <span className="hg-gaveta__grupo">Setores</span>
          {setores.map((s) => (
            <a key={s.href} href={s.href} className="hg-gaveta__setor">{s.label} <small>{s.detalhe}</small></a>
          ))}
        </nav>
        <div className="hg-gaveta__acoes" onClick={() => setAberta(false)}>
          <BotaoAgenda />
          <a className="hg-link-zap" href={linkZap} target="_blank" rel="noopener noreferrer">
            <Icone nome="conversa" /> Conversar no WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}

// Barra do topo: ganha fundo depois de rolar um pouco, e o link da seção em que
// a pessoa está fica aceso ("Início" no topo da página).
export function NavRolagem() {
  useEffect(() => {
    const nav = document.querySelector('.hg-nav')
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.hg-nav__links > a[href^="#"]'))
    const secoes = links
      .map((a) => a.getAttribute('href')!)
      .filter((h) => h !== '#topo')
      .map((h) => document.querySelector<HTMLElement>(h))
      .filter((el): el is HTMLElement => !!el)
    let quadro = 0
    const aoRolar = () => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(() => {
        nav?.classList.toggle('hg-nav--rolou', window.scrollY > 12)
        let atual = '#topo'
        for (const s of secoes) if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) atual = `#${s.id}`
        // no fim da página, a última seção é a ativa mesmo sem chegar ao topo
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && secoes.length) atual = `#${secoes[secoes.length - 1].id}`
        for (const a of links) {
          if (a.getAttribute('href') === atual) a.setAttribute('aria-current', 'true')
          else a.removeAttribute('aria-current')
        }
      })
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [])
  return null
}
