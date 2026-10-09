'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Cubo LogCodex (3x3 por face: "L" na face clara, "C" na face escura).
// Mesma geometria e cores aprovadas pelo Leo em 02/10/2026
// (projetos/los-bagres/docs/comercial/cubo_logcodex.py), aqui montado peça
// por peça na entrada da página.
type P = [number, number]
const TOPO = '#4b5b75'
const L_LETRA = '#f2f6fc'
const L_RESTO = '#505c6d'
const C_LETRA = '#2f6bff'
const C_RESTO = '#1d3a86'
const T: P = [32, 4], UR: P = [60, 20], B: P = [32, 68], LL: P = [4, 52], UL: P = [4, 20], C: P = [32, 36]
const sub = (p: P, q: P): P => [p[0] - q[0], p[1] - q[1]]

type Peca = { pts: string; cor: string; face: 0 | 1 | 2; ordem: number }

function face(origem: P, u: P, v: P, cor: (i: number, j: number) => string, f: 0 | 1 | 2, folga = 0.07): Peca[] {
  const out: Peca[] = []
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const u0 = i / 3 + folga / 2, u1 = (i + 1) / 3 - folga / 2
      const v0 = j / 3 + folga / 2, v1 = (j + 1) / 3 - folga / 2
      const pts = ([[u0, v0], [u1, v0], [u1, v1], [u0, v1]] as P[])
        .map(([a, b]) => `${(origem[0] + a * u[0] + b * v[0]).toFixed(2)},${(origem[1] + a * u[1] + b * v[1]).toFixed(2)}`)
        .join(' ')
      out.push({ pts, cor: cor(i, j), face: f, ordem: f * 9 + i + j * 3 })
    }
  return out
}

const PECAS: Peca[] = [
  ...face(UL, sub(T, UL), sub(C, UL), () => TOPO, 0),
  ...face(UL, sub(C, UL), sub(LL, UL), (i, j) => (i === 0 || j === 2 ? L_LETRA : L_RESTO), 1),
  ...face(C, sub(UR, C), sub(B, C), (i, j) => (i === 0 || j === 0 || j === 2 ? C_LETRA : C_RESTO), 2),
]
// de onde cada face "chega" ao montar: topo cai de cima, faces entram pelos lados
const ORIGEM: Record<number, P> = { 0: [0, -14], 1: [-12, 8], 2: [12, 8] }

// Interação (pedido do Leo, 09/10): ao passar o mouse as três faces se afastam
// um pouco, como se o cubo "respirasse"; ao clicar, ele se desmonta e se monta
// de novo. `realce` deixa o pai (a marca no topo) acionar o mesmo efeito.
export function CuboLogo({ size = 40, animar = true, realce = false }: { size?: number; animar?: boolean; realce?: boolean }) {
  const reduz = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [volta, setVolta] = useState(0)
  const [montando, setMontando] = useState(animar)
  const anima = (animar || volta > 0) && !reduz
  const aberto = (hover || realce) && !reduz && !montando
  const remonta = () => {
    if (reduz) return
    setMontando(true)
    setVolta((v) => v + 1)
  }
  return (
    <svg
      viewBox="2 2 60 68"
      width={size}
      height={(size * 68) / 60}
      aria-label="LogCodex"
      role="img"
      className="pz-cubo"
      style={{ display: 'block', overflow: 'visible' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={remonta}
    >
      <g key={volta}>
        {PECAS.map((p, k) => {
          const [ox, oy] = ORIGEM[p.face]
          return (
            <motion.polygon
              key={k}
              points={p.pts}
              fill={p.cor}
              initial={anima ? { opacity: 0, x: ox, y: oy } : false}
              animate={aberto ? { opacity: 1, x: ox * 0.32, y: oy * 0.32 } : { opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: montando ? 260 : 340, damping: montando ? 18 : 16, delay: montando ? 0.15 + p.ordem * 0.035 : p.ordem * 0.008 }}
              onAnimationComplete={k === PECAS.length - 1 && montando ? () => setMontando(false) : undefined}
            />
          )
        })}
      </g>
    </svg>
  )
}
