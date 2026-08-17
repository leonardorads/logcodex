'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Dock magnético de integrações — adaptado do componente Motiq (MIT).
 *
 * O original é shadcn + Tailwind + clsx/tailwind-merge; este projeto não usa
 * nenhum dos quatro (não há components.json nem tailwind.config), então a
 * física foi mantida e a camada de estilo reescrita em CSS puro, a convenção
 * do repo. Sem dependência nova.
 *
 * A ideia: os ícones não têm hover individual — todos amostram UM campo
 * gaussiano compartilhado, então o vizinho reage junto e a barra se move como
 * líquido sob um ímã.
 */

type Integracao = {
  id: string
  label: string
  cor: string
  icone: React.ReactNode
}

const INTEGRACOES: Integracao[] = [
  {
    id: 'whatsapp', label: 'WhatsApp', cor: '#25d366',
    icone: <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.65 6.35L3 29l6.85-1.6A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.45 18.1c-.27.76-1.58 1.46-2.16 1.52-.55.06-1.07.26-3.6-.75-3.02-1.2-4.96-4.27-5.11-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.47.77-2.2 1.04-2.5.27-.3.6-.37.8-.37l.57.01c.18 0 .43-.07.67.51l.87 2.1c.07.17.12.37.01.58l-.32.54-.48.5c-.15.15-.32.32-.14.63.18.3.8 1.31 1.72 2.12 1.18 1.05 2.18 1.38 2.49 1.53.3.15.47.13.65-.08l.43-.52c.18-.22.36-.18.6-.11l1.92.9c.22.1.37.15.42.24.05.33-.12 1.35-.39 2.11z" />,
  },
  {
    id: 'telegram', label: 'Telegram', cor: '#2aabee',
    icone: <path d="M26.8 5.2 3.9 14c-1.6.6-1.6 1.5-.3 1.9l5.8 1.8 2.2 6.8c.3.7.5 1 1 1 .5 0 .7-.2 1-.6l2.8-2.7 5.8 4.3c1.1.6 1.8.3 2.1-1l3.8-17.9c.4-1.6-.6-2.3-1.3-1.4zM11 17.4l12.6-7.9c.6-.4 1.1-.2.7.2L13.6 19.5l-.4 4.3-2.2-6.4z" />,
  },
  {
    id: 'teams', label: 'Microsoft Teams', cor: '#5059c9',
    icone: <path d="M19.5 11h7.7c.4 0 .8.4.8.8v7c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5V11zm3.9-1.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM11 10h7v11.5c0 3-2.5 5.5-5.5 5.5-2.6 0-4.8-1.8-5.4-4.2H4a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h7v-2zm2.8-1.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z" />,
  },
  {
    id: 'slack', label: 'Slack', cor: '#e01e5a',
    icone: <path d="M7.5 19.5a2.5 2.5 0 1 1-2.5-2.5h2.5v2.5zm1.3 0a2.5 2.5 0 0 1 5 0v6.3a2.5 2.5 0 0 1-5 0v-6.3zM11.3 7.5a2.5 2.5 0 1 1 2.5-2.5v2.5h-2.5zm0 1.3a2.5 2.5 0 0 1 0 5H5a2.5 2.5 0 0 1 0-5h6.3zM23.3 11.3a2.5 2.5 0 1 1 2.5 2.5h-2.5v-2.5zm-1.3 0a2.5 2.5 0 0 1-5 0V5a2.5 2.5 0 0 1 5 0v6.3zM19.5 23.3a2.5 2.5 0 1 1-2.5 2.5v-2.5h2.5zm0-1.3a2.5 2.5 0 0 1 0-5h6.3a2.5 2.5 0 0 1 0 5h-6.3z" />,
  },
  {
    id: 'sheets', label: 'Google Sheets', cor: '#0f9d58',
    icone: <path d="M19 2H8a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9l-7-7zm0 2.5L23.5 9H19V4.5zM11 15h10v2h-4v2h4v2h-4v2h4v2H11v-2h4v-2h-4v-2h4v-2H11v-2z" />,
  },
  {
    id: 'excel', label: 'Excel', cor: '#217346',
    icone: <path d="M19 2H8a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9l-7-7zm0 2.5L23.5 9H19V4.5zm-8.4 10.6h2.6l1.8 3.2 1.9-3.2h2.5l-3.1 4.9 3.2 5.1h-2.6l-1.9-3.3-1.9 3.3h-2.5l3.2-5.1-3.2-4.9z" />,
  },
  {
    id: 'chatgpt', label: 'ChatGPT', cor: '#10a37f',
    icone: <path d="M28 13.1a7.1 7.1 0 0 0-.6-5.8 7.2 7.2 0 0 0-7.7-3.4A7.1 7.1 0 0 0 8.4 6.3a7.1 7.1 0 0 0-4.8 3.5 7.2 7.2 0 0 0 .9 8.4 7.1 7.1 0 0 0 .6 5.8 7.2 7.2 0 0 0 7.7 3.4 7.1 7.1 0 0 0 11.3-2.4 7.1 7.1 0 0 0 4.8-3.5 7.2 7.2 0 0 0-.9-8.4zM17.7 27a5.3 5.3 0 0 1-3.4-1.2l.2-.1 5.6-3.2c.3-.2.5-.5.5-.8v-7.9l2.4 1.4v6.5c0 2.9-2.4 5.3-5.3 5.3zM6.3 22.1a5.3 5.3 0 0 1-.6-3.6l.2.1 5.6 3.2c.3.2.6.2.9 0l6.9-4v2.7l-5.7 3.3a5.3 5.3 0 0 1-7.3-1.7zM4.8 10.8a5.3 5.3 0 0 1 2.8-2.3v6.6c0 .3.2.6.5.8l6.8 4-2.4 1.4-5.7-3.3a5.3 5.3 0 0 1-2-7.2zm19.5 4.5-6.9-4 2.4-1.4 5.7 3.3a5.3 5.3 0 0 1-.8 9.5v-6.6c0-.3-.2-.6-.4-.8zm2.4-3.6-.2-.1-5.6-3.3a.9.9 0 0 0-.9 0l-6.9 4V9.6l5.7-3.3a5.3 5.3 0 0 1 7.9 5.4zM10.7 16.6l-2.4-1.4V8.7c0-2.9 2.4-5.3 5.3-5.3 1.2 0 2.4.4 3.4 1.2l-.2.1-5.6 3.2c-.3.2-.5.5-.5.8v7.9zm1.3-2.9 3-1.8 3.1 1.8v3.5l-3 1.8-3.1-1.8v-3.5z" />,
  },
  {
    id: 'claude', label: 'Claude', cor: '#d97757',
    icone: <path d="M8.6 20.3 14 17.2l.1-.3-.1-.1h-.3l-1 0-3.4-.2-2.9-.1-2.9-.2-.7-.2L2 15.2l.1-.5.6-.4.9.1 1.9.1 2.9.2 2.1.1 3.1.3h.5l.1-.2-.2-.1-.1-.1-3.2-2.2-3.5-2.3-1.8-1.3-1-.7-.5-.6-.2-1.4L5 5.2l1.3.1.3.1 1.3 1 2.8 2.2 3.7 2.7.5.5.2-.2v-.1l-.2-.4-2-3.5-2-3.6-1-1.4-.2-.9c-.1-.3 0-.6.1-.8l.7-.5 1.1.2.5.4.7 1.6 1.1 2.5 1.8 3.4.5 1 .3.9.1.3h.2v-.2l.2-2 .3-2.5.3-3.2.1-.9.5-1.1 1-.7.8.4.6.9-.1.6-.4 2.5-.8 4.1-.5 2.8h.3l.3-.3 1.3-1.8 2.3-2.8 1-1.1 1.2-1.2.7-.6h1.4l1 1.5-.5 1.6-1.4 1.8-1.2 1.5-1.7 2.3-1 1.8.1.1h.3l3.7-.8 2-.3 2.4-.4 1.1.5.1.5-.4 1.1-2.5.6-2.9.6-4.3 1-.1.1.1.1 1.9.2h.8l2 .1 3.7.3 1 .6.6.8-.1.6-1.5.8-2-.5-4.7-1.1-1.6-.4h-.2v.1l1.3 1.3 2.4 2.2 3 2.8.2.7-.4.6-.4-.1-2.7-2-1-.9-2.4-2h-.2v.2l.5.8 2.9 4.4.2 1.3-.2.4-.7.3-.8-.2-1.6-2.3-1.7-2.5-1.3-2.3-.2.1-.8 8.5-.4.4-.9.3-.7-.5-.4-.9.4-1.8.5-2.3.4-1.8.4-2.3.2-.7v-.1h-.2l-1.7 2.3-2.6 3.5-2 2.2-.5.2-.8-.4.1-.8.5-.7 2.8-3.5 1.7-2.2 1.1-1.3v-.2h-.1l-6.8 4.4-1.2.2-.5-.5.1-.8.3-.3 2.4-1.6z" />,
  },
]

/* ---- física do campo magnético (portada do original) ---- */
type Mola = { x: number; v: number }
const criarMola = (x = 0): Mola => ({ x, v: 0 })

function mola(s: Mola, alvo: number, k: number, c: number, dt: number): number {
  const n = dt > 0.012 ? Math.ceil(dt / 0.008) : 1
  const h = dt / n
  for (let i = 0; i < n; i++) {
    s.v += (-k * (s.x - alvo) - c * s.v) * h
    s.x += s.v * h
  }
  return s.x
}

const RAIO = 120
const ESCALA_MAX = 1.55
const ELEVACAO = 20
const RIGIDEZ = 420
const AMORTECIMENTO = 26
const ALCANCE_VERTICAL = 200

export function FleetIntegracoes() {
  const raizRef = useRef<HTMLDivElement>(null)
  const barraRef = useRef<HTMLDivElement>(null)
  const iconesRef = useRef<Array<HTMLButtonElement | null>>([])
  const basesRef = useRef<Array<{ x: number; y: number }>>([])
  const ponteiroRef = useRef({ x: -1e4, y: -1e4, dentro: false })
  const [reduzido, setReduzido] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // setTimeout(0) em vez de chamada direta: setState síncrono no corpo do
    // efeito encadeia renders (regra react-hooks/set-state-in-effect) e ainda
    // faria o servidor e o cliente renderizarem estados diferentes.
    const t = setTimeout(() => setReduzido(mq.matches), 0)
    const onChange = (e: MediaQueryListEvent) => setReduzido(e.matches)
    mq.addEventListener('change', onChange)
    return () => {
      clearTimeout(t)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  // As posições base vêm de offsetLeft, que ignora transform — assim um ícone
  // já escalado não realimenta o campo que ele próprio amostra.
  useEffect(() => {
    const barra = barraRef.current
    if (!barra) return
    const medir = () => {
      const bx = barra.offsetLeft
      const by = barra.offsetTop
      basesRef.current = iconesRef.current.map((el) =>
        el ? { x: bx + el.offsetLeft + el.offsetWidth / 2, y: by + el.offsetTop + el.offsetHeight / 2 } : { x: 0, y: 0 }
      )
    }
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    ro.observe(barra)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const raiz = raizRef.current
    if (!raiz || reduzido) {
      iconesRef.current.forEach((el) => { if (el) el.style.transform = '' })
      return
    }

    const estados = INTEGRACOES.map(() => ({ s: criarMola(1), y: criarMola(0), dx: criarMola(0) }))
    let raf = 0
    let ultimo = performance.now()
    let tOcioso = 0

    const quadro = (agora: number) => {
      raf = requestAnimationFrame(quadro)
      let dt = (agora - ultimo) / 1000
      ultimo = agora
      if (!(dt > 0) || dt > 0.05) dt = 0.016
      tOcioso += dt

      const bases = basesRef.current
      const p = ponteiroRef.current
      const w = raiz.clientWidth
      const cresce = ESCALA_MAX - 1

      // Sem ponteiro, uma onda varre a barra devagar para ela "respirar".
      let px: number, py: number, amp: number
      if (p.dentro) {
        px = p.x; py = p.y; amp = 1
      } else {
        px = w / 2 + Math.sin(tOcioso * 0.5) * w * 0.34
        py = bases[0]?.y ?? 0
        amp = 0.38
      }

      for (let i = 0; i < INTEGRACOES.length; i++) {
        const b = bases[i]
        const el = iconesRef.current[i]
        const st = estados[i]
        if (!b || !el || !st) continue
        const d = px - b.x
        const vert = Math.max(0, 1 - Math.abs(py - b.y) / ALCANCE_VERTICAL)
        const inf = Math.exp(-(d * d) / (2 * RAIO * RAIO)) * amp * vert
        mola(st.s, 1 + cresce * inf, RIGIDEZ, AMORTECIMENTO, dt)
        mola(st.y, -ELEVACAO * inf, 360, 22, dt)
        mola(st.dx, d * 0.13 * inf, 300, 20, dt)
        el.style.transform = `translate3d(${st.dx.x.toFixed(2)}px,${st.y.x.toFixed(2)}px,0) scale(${st.s.x.toFixed(3)})`
      }
    }

    raf = requestAnimationFrame(quadro)
    return () => cancelAnimationFrame(raf)
  }, [reduzido])

  const rastrear = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const raiz = raizRef.current
    if (!raiz) return
    const r = raiz.getBoundingClientRect()
    ponteiroRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, dentro: true }
  }, [])

  const soltar = useCallback(() => {
    ponteiroRef.current = { x: -1e4, y: -1e4, dentro: false }
  }, [])

  return (
    <div className="fl-section" id="integracoes" style={{ borderTop: '1px solid var(--fl-line)' }}>
      <div className="rev" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="fl-eyebrow">Integrações</span>
        <h2 className="fl-h2">Conectado ao que<br /><em>sua operação já usa.</em></h2>
        <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
          O Fleet.ai conversa com as ferramentas que seu time já abre todo dia — sem trocar de sistema, sem exportar planilha na mão.
        </p>
      </div>

      <div
        ref={raizRef}
        className="fi-raiz rev"
        onPointerMove={rastrear}
        onPointerDown={rastrear}
        onPointerLeave={soltar}
        onPointerCancel={soltar}
      >
        <div ref={barraRef} className="fi-barra">
          {INTEGRACOES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="fi-icone"
              aria-label={item.label}
              title={item.label}
              ref={(el) => { iconesRef.current[i] = el }}
              style={{ ['--fi-cor' as string]: item.cor }}
            >
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">{item.icone}</svg>
              <span className="fi-rotulo">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--fl-ink2)', fontSize: '14px', marginTop: '28px' }}>
        Não achou a sua? A integração é desenhada no diagnóstico, caso a caso.
      </p>

      <style>{`
        .fi-raiz { width: 100%; user-select: none; touch-action: pan-y; padding: 46px 0 10px; }
        .fi-barra {
          position: relative; display: flex; flex-wrap: wrap;
          align-items: flex-end; justify-content: center;
          gap: 14px; padding: 16px 20px;
          border: 1px solid var(--fl-line); border-radius: 22px;
          background: rgba(255,255,255,0.02); backdrop-filter: blur(14px);
          max-width: 640px; margin: 0 auto;
        }
        .fi-icone {
          position: relative; display: grid; place-items: center;
          width: 58px; height: 58px; flex-shrink: 0;
          transform-origin: bottom;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 16px; padding: 0; cursor: default;
          background: color-mix(in srgb, var(--fi-cor) 14%, transparent);
          color: var(--fi-cor);
          will-change: transform;
        }
        .fi-icone svg { width: 30px; height: 30px; display: block; }

        /* O rótulo aparece acima do ícone só no hover/foco — o dock precisa
           dizer o nome de cada ferramenta sem virar uma parede de texto. */
        .fi-rotulo {
          position: absolute; bottom: calc(100% + 10px); left: 50%;
          transform: translateX(-50%) translateY(4px);
          white-space: nowrap; font-size: 11.5px; font-weight: 600;
          padding: 5px 10px; border-radius: 8px;
          background: var(--fl-ink); color: var(--fl-bg);
          opacity: 0; pointer-events: none;
          transition: opacity .18s ease, transform .18s ease;
        }
        .fi-icone:hover .fi-rotulo,
        .fi-icone:focus-visible .fi-rotulo { opacity: 1; transform: translateX(-50%) translateY(0); }
        .fi-icone:focus-visible { outline: 2px solid var(--fl-accent); outline-offset: 3px; }

        @media (max-width: 560px) {
          .fi-icone { width: 50px; height: 50px; border-radius: 14px; }
          .fi-icone svg { width: 26px; height: 26px; }
        }

        @media (prefers-reduced-motion: reduce) {
          /* Sem o campo magnético, o hover comum mantém a affordance. */
          .fi-icone { transition: transform .15s ease; }
          .fi-icone:hover { transform: translateY(-6px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
