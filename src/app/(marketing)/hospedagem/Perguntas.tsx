'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Gift, House, LayoutDashboard, Plus, RotateCcw, Search, Smartphone, Timer, Wallet } from 'lucide-react'
import { PERGUNTAS } from './faq-data'

const ICONES: Record<(typeof PERGUNTAS)[number]['icone'], ReactNode> = {
  gift: <Gift size={18} />,
  timer: <Timer size={18} />,
  wallet: <Wallet size={18} />,
  painel: <LayoutDashboard size={18} />,
  volta: <RotateCcw size={18} />,
  busca: <Search size={18} />,
  celular: <Smartphone size={18} />,
  casa: <House size={18} />,
}

// Acordeão das perguntas: a resposta abre com a altura animada (em vez do
// "salto" do <details>), o texto entra suave e o "+" gira para "×".
// Uma aberta por vez, para a seção não virar um paredão de texto.
// Cada pergunta tem um ícone vivo (pedido do Leo, 09/10): flutua de leve,
// balança ao passar o mouse e "acende" em dourado quando a pergunta abre.
export function Perguntas() {
  const [aberta, setAberta] = useState<number | null>(null)
  const reduz = useReducedMotion()
  return (
    <div className="pz-faqs">
      {PERGUNTAS.map(({ q, a, icone }, i) => {
        const on = aberta === i
        return (
          <div key={q} className={`pz-faq ${on ? 'is-on' : ''}`}>
            <motion.button
              type="button"
              aria-expanded={on}
              aria-controls={`pz-faq-${i}`}
              onClick={() => setAberta(on ? null : i)}
              initial="parado"
              whileHover="mexe"
            >
              <motion.span
                className="pz-faq__icone"
                aria-hidden
                variants={{ parado: { rotate: 0, scale: 1 }, mexe: { rotate: [0, -14, 10, -4, 0], scale: 1.12, transition: { duration: 0.6 } } }}
              >
                <motion.span
                  style={{ display: 'grid', placeItems: 'center' }}
                  animate={
                    reduz ? undefined
                      : on ? { y: 0, scale: [1, 1.3, 1], rotate: [0, 360] }
                      : { y: [0, -3, 0], scale: 1, rotate: 0 }
                  }
                  transition={
                    on ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                      : { y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }, default: { duration: 0.3 } }
                  }
                >
                  {ICONES[icone]}
                </motion.span>
              </motion.span>
              <span className="pz-faq__q">{q}</span>
              <motion.span className="pz-faq__mais" animate={{ rotate: on ? 135 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <Plus size={18} />
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`pz-faq-${i}`}
                  key="r"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3, delay: 0.1 } } }}
                  exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.32, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.15 } } }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.p initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -6 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    {a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
