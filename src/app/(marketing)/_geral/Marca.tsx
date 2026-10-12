import type { CSSProperties } from 'react'

// Cubo LogCodex: a mesma marca da /hospedagem (pedido do Leo, 12/10: "padronizar
// a logo com o ícone da logcodex ... também precisa ser animada igual").
// Mesma geometria e cores do hospedagem/CuboLogo.tsx (aprovadas em 02/10/2026):
// 3x3 por face, "L" na face clara e "C" na face escura.
//
// Aqui o movimento é CSS (a home não carrega framer-motion), em duas camadas,
// de propósito (lição da Toy Hats):
// - ENTRADA no <g> de fora: cada peça chega do seu lado e assenta com mola;
// - HOVER no polígono de dentro, só por `transition`: as três faces se afastam
//   um pouco ("o cubo respira") e voltam suaves, sem a entrada recomeçar.
// O clique na marca remonta o cubo (Interativos.tsx tira e põe a classe).
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

export function Cubo({ className = '', animar = true }: { className?: string; animar?: boolean }) {
  return (
    <svg className={`hg-cubo ${animar ? 'hg-cubo--anima' : ''} ${className}`} viewBox="2 2 60 68" aria-hidden="true" focusable="false">
      {PECAS.map((p, k) => (
        <g key={k} className={`hg-cubo__peca hg-cubo__peca--f${p.face}`} style={{ '--o': p.ordem } as CSSProperties}>
          <polygon className="hg-cubo__face" points={p.pts} fill={p.cor} />
        </g>
      ))}
    </svg>
  )
}

// Cubo + "logcodex" (minúsculo, como na marca). As letras sobem em sequência no
// carregamento; no hover fazem uma onda e ganham o azul da página (camada de
// dentro), igual à marca da /hospedagem.
const NOME = 'logcodex'.split('')

export function MarcaCompleta({ className = '', animar = true }: { className?: string; animar?: boolean }) {
  return (
    <span className={`hg-marca ${animar ? '' : 'hg-marca--quieta'} ${className}`}>
      <Cubo animar={animar} />
      <span className="hg-marca__nome" aria-label="logcodex">
        {NOME.map((l, i) => (
          <span key={i} aria-hidden="true" style={{ '--i': i } as CSSProperties}>
            <i>{l}</i>
          </span>
        ))}
      </span>
    </span>
  )
}
