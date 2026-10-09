'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CuboLogo } from './CuboLogo'

// Marca do topo (pedido do Leo, 09/10): ao passar o mouse, as letras de
// "logcodex" fazem uma onda e ganham o dourado da página, e o cubo "respira"
// junto. No toque (celular) o efeito roda uma vez a cada toque.
const NOME = 'logcodex'.split('')

export function NomeLogo({ ativo }: { ativo: boolean }) {
  const reduz = useReducedMotion()
  return (
    <span className="pz-logo-nome" aria-label="logcodex">
      {NOME.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: 'inline-block' }}
          animate={ativo && !reduz ? { y: [0, -6, 0], color: ['#eef1f7', '#f0cfa0', '#eef1f7'] } : { y: 0, color: '#eef1f7' }}
          transition={{ duration: 0.55, delay: ativo ? i * 0.045 : 0, ease: 'easeOut' }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  )
}

export function Marca() {
  const [on, setOn] = useState(false)
  const [toque, setToque] = useState(0)
  const ativo = on || toque > 0
  return (
    <a
      href="#topo"
      className="pz-marca"
      aria-label="LogCodex Hospedagem"
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      onTouchStart={() => {
        setToque((t) => t + 1)
        setTimeout(() => setToque((t) => Math.max(0, t - 1)), 900)
      }}
    >
      <CuboLogo size={30} realce={ativo} />
      <span>
        <NomeLogo ativo={ativo} /> <em>Hospedagem</em>
      </span>
    </a>
  )
}
