'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BrainCircuit, CheckCheck, LayoutDashboard, MessagesSquare } from 'lucide-react'

// Bônus do plano de 12 meses (decisão do Leo, 09/10/2026): painel CRM, WhatsApp
// automático e IA integrada, sem custo adicional. Apresentado como parte do
// plano, sem "brinde" nem preço riscado (orientação do Codex na mesma data).
// O painel ao lado é um desenho de EXEMPLO (hóspedes fictícios), em loop.
const ITENS = [
  { icon: <LayoutDashboard size={20} />, t: 'Painel de gestão (CRM)', d: 'Hóspedes, reservas e o dia a dia da pousada num só lugar.' },
  { icon: <MessagesSquare size={20} />, t: 'WhatsApp automático', d: 'Confirmações e lembretes saem sozinhos, na hora certa.' },
  { icon: <BrainCircuit size={20} />, t: 'IA integrada ao sistema', d: 'Atendimento, painel e WhatsApp trabalhando juntos.' },
]

const HOSPEDES = [
  { n: 'Marina S.', d: '14–16 nov · 2 pessoas', s: 'Confirmada', c: 'ok' },
  { n: 'Rafael e Bia', d: '21–24 nov · casal', s: 'Pix recebido', c: 'ok' },
  { n: 'Família Costa', d: '02–06 dez · 4 pessoas', s: 'Aguardando', c: 'espera' },
  { n: 'Lucas M.', d: '28–30 nov · 1 pessoa', s: 'Lembrete enviado', c: 'ia' },
  { n: 'Ana e Paulo', d: '27–31 dez · casal', s: 'Confirmada', c: 'ok' },
  { n: 'Grupo da Júlia', d: '10–12 jan · 5 pessoas', s: 'Respondido pela IA', c: 'ia' },
]

function PainelDemo() {
  const reduz = useReducedMotion()
  const [ini, setIni] = useState(0)
  useEffect(() => {
    if (reduz) return
    const t = setInterval(() => setIni((i) => (i + 1) % HOSPEDES.length), 2600)
    return () => clearInterval(t)
  }, [reduz])
  const lista = [0, 1, 2, 3].map((k) => HOSPEDES[(ini + k) % HOSPEDES.length])
  return (
    <div className="pz-painel" aria-label="Exemplo ilustrativo do painel">
      <div className="pz-painel__topo">
        <span><LayoutDashboard size={15} /> Painel da pousada</span>
        <span className="pz-tag pz-tag--claro">exemplo</span>
      </div>
      <div className="pz-painel__nums">
        <div><b>12</b><span>reservas diretas</span></div>
        <div><b>3</b><span>chegam esta semana</span></div>
        <div><b>24h</b><span>atendimento com IA</span></div>
      </div>
      <ul className="pz-painel__lista">
        <AnimatePresence initial={false} mode="popLayout">
          {lista.map((h) => (
            <motion.li
              key={h.n}
              layout
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <span className="pz-painel__avatar">{h.n[0]}</span>
              <span className="pz-painel__quem">
                <b>{h.n}</b>
                <small>{h.d}</small>
              </span>
              <span className={`pz-painel__status pz-painel__status--${h.c}`}>
                {h.c === 'ok' && <CheckCheck size={12} />} {h.s}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export function PlanoAnual() {
  return (
    <div className="pz-plano">
      <div className="pz-plano__texto">
        <span className="pz-plano__selo">Plano de 12 meses</span>
        <h2>
          O painel do seu negócio <span className="pz-brilho">vem junto.</span>
        </h2>
        <p>Fechando por 12 meses, você recebe sem custo adicional:</p>
        <ul>
          {ITENS.map((it, k) => (
            <motion.li
              key={it.t}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.1 + k * 0.12, duration: 0.5 }}
            >
              <span className="pz-plano__icone">{it.icon}</span>
              <span>
                <b>{it.t}</b>
                <small>{it.d}</small>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
      <PainelDemo />
    </div>
  )
}
