'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BedDouble, CalendarDays, Check, CheckCheck, Coffee, MessageCircle, PawPrint, Sparkles, Sun, Users } from 'lucide-react'

// Celular mostrando, em loop, o caminho que a página promete:
// o hóspede vê o site da pousada -> escolhe as datas -> o número de pessoas ->
// cai no WhatsApp com a mensagem pronta -> conversa até a reserva confirmada.
// A pousada é FICTÍCIA e marcada como exemplo; sem nota, preço ou avaliação
// inventada (só o que um site de verdade mostraria).
const DURACAO_SITE = [3200, 1500, 1400, 1300] // vitrine · datas · pessoas · botão

type Msg = { de: 'hospede' | 'pousada'; t: string; h: string }
const CONVERSA: Msg[] = [
  { de: 'hospede', t: 'Olá! Vi o site de vocês 😍 Quero reservar de 12 a 15 de janeiro para 2 adultos. Tem disponibilidade?', h: '14:32' },
  { de: 'pousada', t: 'Oi, Marina! Temos sim 😊 A suíte com varanda de frente para o mar está livre nessas datas.', h: '14:33' },
  { de: 'hospede', t: 'Que lindo! O café da manhã está incluso?', h: '14:33' },
  { de: 'pousada', t: 'Está sim! Servido no deck, de frente para o mar, das 8h às 10h30 🌅', h: '14:34' },
  { de: 'hospede', t: 'Haha amei. Aceitam pet? Vamos com a Mel, uma beagle 🐶', h: '14:34' },
  { de: 'pousada', t: 'Aceitamos! A Mel vai amar a praia. Posso confirmar a reserva no seu nome?', h: '14:35' },
  { de: 'hospede', t: 'Pode confirmar! 🙌', h: '14:35' },
  { de: 'pousada', t: 'Reserva confirmada, Marina! Te esperamos dia 12 ☀️', h: '14:36' },
]

function Cena({ tipo }: { tipo: 'mar' | 'quarto' | 'cafe' }) {
  // "fotos" desenhadas em SVG — nada de foto de terceiros
  if (tipo === 'quarto')
    return (
      <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" className="pz-cena" aria-hidden>
        <rect width="300" height="190" fill="#e9dccb" />
        <rect x="170" y="22" width="104" height="82" rx="4" fill="#9fc6d8" />
        <rect x="170" y="70" width="104" height="34" fill="#4f86a6" />
        <path d="M222 22 v82 M170 63 h104" stroke="#fff" strokeWidth="4" />
        <rect x="30" y="104" width="160" height="50" rx="8" fill="#fbf7f1" />
        <rect x="30" y="92" width="160" height="22" rx="8" fill="#d8b98d" />
        <rect x="44" y="96" width="44" height="16" rx="6" fill="#fff" />
        <rect x="96" y="96" width="44" height="16" rx="6" fill="#fff" />
        <rect y="154" width="300" height="36" fill="#b98e60" />
      </svg>
    )
  if (tipo === 'cafe')
    return (
      <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" className="pz-cena" aria-hidden>
        <rect width="300" height="190" fill="#f6c88f" />
        <rect y="70" width="300" height="50" fill="#5c8fb0" />
        <rect y="120" width="300" height="70" fill="#a8774a" />
        <path d="M0 132 h300 M0 150 h300 M0 168 h300" stroke="#8c6038" strokeWidth="2" />
        <ellipse cx="150" cy="128" rx="80" ry="14" fill="#fff8ee" />
        <circle cx="122" cy="122" r="12" fill="#fff" /><circle cx="122" cy="122" r="7" fill="#7a4a24" />
        <circle cx="168" cy="124" r="13" fill="#f2b84b" /><circle cx="186" cy="118" r="7" fill="#e0574f" />
        <circle cx="220" cy="48" r="16" fill="#ffe7a8" />
      </svg>
    )
  return (
    <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" className="pz-cena" aria-hidden>
      <defs>
        <linearGradient id="pz-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2350" />
          <stop offset=".55" stopColor="#c76b6b" />
          <stop offset="1" stopColor="#f3b778" />
        </linearGradient>
        <linearGradient id="pz-mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4e78" />
          <stop offset="1" stopColor="#0d2038" />
        </linearGradient>
        <radialGradient id="pz-sol" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff3c9" />
          <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="190" fill="url(#pz-ceu)" />
      <circle className="pz-sol" cx="190" cy="112" r="46" fill="url(#pz-sol)" />
      <circle cx="190" cy="112" r="15" fill="#ffe7a8" />
      <path d="M0 118 C40 92 70 96 105 112 C130 98 150 100 170 118 L0 118Z" fill="#26304f" />
      <rect y="118" width="300" height="72" fill="url(#pz-mar)" />
      <g className="pz-ondas" stroke="#f7c98c" strokeOpacity=".55" strokeWidth="1.4" fill="none">
        <path d="M150 130 h80" /><path d="M165 142 h52" /><path d="M175 154 h30" />
      </g>
      <g fill="#10172b">
        <path d="M18 150 L48 128 L78 150 Z" />
        <rect x="26" y="150" width="44" height="22" />
        <rect x="44" y="158" width="9" height="14" fill="#f3b778" />
      </g>
    </svg>
  )
}

const FOTOS = ['mar', 'quarto', 'cafe'] as const

function Conversa({ onFim, reduz }: { onFim: () => void; reduz: boolean }) {
  // n = quantas mensagens já apareceram; "digitando" antes de cada uma da pousada
  const [n, setN] = useState(reduz ? CONVERSA.length : 1)
  const [digitando, setDigitando] = useState(false)
  useEffect(() => {
    if (reduz) return
    if (n >= CONVERSA.length) {
      const t = setTimeout(onFim, 4200)
      return () => clearTimeout(t)
    }
    const proxima = CONVERSA[n]
    const espera = proxima.de === 'pousada' ? 900 : 1300
    const t1 = setTimeout(() => setDigitando(true), espera)
    const t2 = setTimeout(() => { setDigitando(false); setN((x) => x + 1) }, espera + (proxima.de === 'pousada' ? 1300 : 700))
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [n, reduz, onFim])
  const quemDigita = n < CONVERSA.length ? CONVERSA[n].de : null

  return (
    <div className="pz-zap">
      <div className="pz-zap__topo">
        <span className="pz-zap__avatar">M</span>
        <span>
          <b>Pousada Maré Alta</b>
          <small>{digitando && quemDigita === 'pousada' ? 'digitando…' : 'online · atendimento com IA'}</small>
        </span>
      </div>
      <div className="pz-zap__fio">
        <AnimatePresence initial={false}>
          {CONVERSA.slice(0, n).map((m, i) => (
            <motion.div
              key={i}
              layout
              className={`pz-zap__msg pz-zap__msg--${m.de}`}
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              {m.t}
              <small>
                {m.de === 'pousada' && (
                  <span className="pz-zap__ia">
                    <Sparkles size={9} /> IA
                  </span>
                )}
                {m.h} {m.de === 'hospede' && <CheckCheck size={12} />}
              </small>
            </motion.div>
          ))}
          {n >= CONVERSA.length && (
            <motion.div key="selo" layout className="pz-zap__selo" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5 }}>
              <Check size={13} /> Atendido pela IA · reserva direta
            </motion.div>
          )}
          {digitando && (
            <motion.div key="dig" layout className={`pz-zap__dig pz-zap__dig--${quemDigita}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <i /><i /><i />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PhoneDemo() {
  const reduz = Boolean(useReducedMotion())
  const [passo, setPasso] = useState(reduz ? 4 : 0)
  const [foto, setFoto] = useState(0)
  const [volta, setVolta] = useState(0) // remonta a conversa a cada ciclo

  useEffect(() => {
    if (reduz || passo >= 4) return
    const t = setTimeout(() => setPasso((p) => p + 1), DURACAO_SITE[passo])
    return () => clearTimeout(t)
  }, [passo, reduz])

  // galeria passa sozinha enquanto o hóspede "olha" o site
  useEffect(() => {
    if (reduz || passo !== 0) return
    const t = setInterval(() => setFoto((f) => (f + 1) % FOTOS.length), 1050)
    return () => clearInterval(t)
  }, [passo, reduz])

  const reinicia = useCallback(() => {
    setFoto(0)
    setVolta((v) => v + 1)
    setPasso(0)
  }, [])

  return (
    <div className="pz-phone" aria-label="Exemplo ilustrativo: hóspede vê o site, escolhe as datas e reserva pelo WhatsApp">
      <div className="pz-phone__notch" />
      <div className="pz-phone__tela">
        <AnimatePresence mode="wait">
          {passo < 4 ? (
            <motion.div
              key={`site-${volta}`}
              className="pz-site"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
              transition={{ duration: 0.45 }}
            >
              <div className="pz-site__foto">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={foto} className="pz-site__slide" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                    <Cena tipo={FOTOS[foto]} />
                  </motion.div>
                </AnimatePresence>
                <span className="pz-tag">exemplo</span>
                <span className="pz-pontos">
                  {FOTOS.map((f, i) => <i key={f} className={i === foto ? 'is-on' : ''} />)}
                </span>
              </div>
              <div className="pz-site__corpo">
                <p className="pz-site__nome">Pousada Maré Alta</p>
                <p className="pz-site__chips">
                  <span><Sun size={11} /> Pé na areia</span>
                  <span><Coffee size={11} /> Café no deck</span>
                  <span><PawPrint size={11} /> Pet</span>
                  <span><BedDouble size={11} /> Suítes</span>
                </p>
                <div className={`pz-campo ${passo >= 1 ? 'is-on' : ''}`}>
                  <CalendarDays size={14} />
                  <span>{passo >= 1 ? '12 → 15 de janeiro' : 'Escolha as datas'}</span>
                  {passo >= 1 && <Check size={13} className="pz-ok" />}
                </div>
                <div className={`pz-campo ${passo >= 2 ? 'is-on' : ''}`}>
                  <Users size={14} />
                  <span>{passo >= 2 ? '2 adultos' : 'Quantas pessoas?'}</span>
                  {passo >= 2 && <Check size={13} className="pz-ok" />}
                </div>
                <motion.div
                  className={`pz-reservar ${passo >= 3 ? 'is-on' : ''}`}
                  animate={passo === 3 ? { scale: [1, 0.94, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <MessageCircle size={15} /> Reservar pelo WhatsApp
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`zap-${volta}`} style={{ height: '100%' }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <Conversa onFim={reinicia} reduz={reduz} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
