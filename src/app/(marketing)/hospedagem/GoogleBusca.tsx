'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Globe, MapPin, Search, Star } from 'lucide-react'

// Busca no Google desenhada (não é print do Google): o hóspede digita, os
// resultados aparecem e o site oficial da pousada de EXEMPLO se destaca.
// Não promete posição: mostra o que é ter um site próprio para ser achado.
const BUSCA = 'pousada pé na areia ilha do mel'

// A tela do notebook tem proporção real (16:10). O conteúdo é montado num
// "palco" fixo de 640×400 e reduzido inteiro para caber na largura disponível —
// assim a tela não fica espremida/quadrada no celular nem no computador.
const PALCO_L = 640
const PALCO_A = 400

const RESULTADOS = [
  { t: 'Pousadas na Ilha do Mel — compare preços', u: 'plataforma-de-reservas.com', d: 'Dezenas de opções lado a lado…', meu: false },
  { t: 'Pousada Maré Alta — Site oficial | Reserva direta', u: 'suapousada.com.br', d: 'Pé na areia, café da manhã e reserva pelo WhatsApp em 1 minuto.', meu: true },
  { t: 'As 10 melhores pousadas da Ilha do Mel', u: 'guia-de-viagem.com', d: 'Lista com avaliações de hóspedes…', meu: false },
]

export function GoogleBusca() {
  const ref = useRef<HTMLDivElement>(null)
  const telaRef = useRef<HTMLDivElement>(null)
  const visivel = useInView(ref, { amount: 0.3 })
  const reduz = useReducedMotion()
  const [texto, setTexto] = useState(reduz ? BUSCA : '')
  const [escala, setEscala] = useState(0.8)
  const pronto = texto.length === BUSCA.length

  useEffect(() => {
    const el = telaRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setEscala(e.contentRect.width / PALCO_L))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Loop contínuo, como o WhatsApp do topo (pedido do Leo, 09/10): digita →
  // resultados aparecem → ficam à mostra → a busca é apagada → recomeça.
  // Só roda enquanto o notebook está na tela.
  useEffect(() => {
    if (!visivel || reduz) return
    let vivo = true
    const timers: number[] = []
    const espera = (ms: number) => new Promise<void>((r) => { timers.push(window.setTimeout(r, ms)) })
    ;(async () => {
      while (vivo) {
        for (let i = 1; i <= BUSCA.length && vivo; i++) {
          setTexto(BUSCA.slice(0, i))
          await espera(55)
        }
        await espera(5200)
        for (let i = BUSCA.length - 1; i >= 0 && vivo; i--) {
          setTexto(BUSCA.slice(0, i))
          await espera(18)
        }
        await espera(700)
      }
    })()
    return () => {
      vivo = false
      timers.forEach(clearTimeout)
    }
  }, [visivel, reduz])

  return (
    <div className="pz-note" ref={ref}>
      <div className="pz-note__tampa">
        <span className="pz-note__camera" aria-hidden />
        <div className="pz-note__tela" ref={telaRef} style={{ height: PALCO_A * escala }}>
          <div className="pz-note__palco" style={{ width: PALCO_L, height: PALCO_A, transform: `scale(${escala})` }}>
            <div className="pz-note__aba" aria-hidden>
              <i /><i /><i />
              <span>google.com</span>
            </div>
            <div className="pz-google" aria-label="Exemplo ilustrativo de busca no Google">
              <div className="pz-google__barra">
                <Search size={16} />
                <span>
                  {texto}
                  {!pronto && <i className="pz-cursor" />}
                </span>
                <span className="pz-tag pz-tag--claro">exemplo</span>
              </div>
              <div className="pz-google__res">
                {RESULTADOS.map((r, k) => (
                  <motion.div
                    key={r.u}
                    className={`pz-res ${r.meu ? 'pz-res--meu' : ''}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={pronto ? { opacity: r.meu ? 1 : 0.45, y: 0, scale: r.meu ? 1.02 : 1 } : { opacity: 0, y: 14, scale: 1 }}
                    transition={pronto ? { delay: 0.25 + k * 0.18, duration: 0.5 } : { duration: 0.25 }}
                  >
                    <span className="pz-res__url">
                      <Globe size={12} /> {r.u}
                    </span>
                    <b>{r.t}</b>
                    <span className="pz-res__d">{r.d}</span>
                    {r.meu && (
                      <span className="pz-res__mapa">
                        <MapPin size={12} /> No mapa · Rota · Site · WhatsApp
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pz-note__base" aria-hidden />
    </div>
  )
}

// "9 em 10" contando ao aparecer na tela; a estrela dourada "acende" ao chegar no 9
export function NoveEmDez() {
  const ref = useRef<HTMLSpanElement>(null)
  const visivel = useInView(ref, { once: true, amount: 0.6 })
  const reduz = useReducedMotion()
  const [n, setN] = useState(reduz ? 9 : 0)
  useEffect(() => {
    if (!visivel || reduz) return
    const c = animate(0, 9, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [visivel, reduz])
  return (
    <span ref={ref} className="pz-numero">
      <AnimatePresence>
        {n === 9 && (
          <motion.span
            className="pz-numero__estrela"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
            aria-hidden
          >
            <Star size={26} fill="currentColor" strokeWidth={0} />
          </motion.span>
        )}
      </AnimatePresence>
      {n}
      <small> em 10</small>
    </span>
  )
}
