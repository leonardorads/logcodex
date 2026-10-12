import type { CSSProperties } from 'react'

// Monograma "LC" da LogCodex, animado (piso da skill site-entregue-sem-animacao).
// Mesmo desenho do LogoMark da página de logística: o L é a base, o C é um arco
// de nós ligados (a "rede").
//
// Duas camadas, de propósito (lição da Toy Hats): a ENTRADA anima o <g> de fora
// (keyframes, uma vez); o HOVER mexe só no círculo de dentro, e só por
// `transition` — um sinal que percorre os nós e volta suave, sem a entrada
// recomeçar e a logo "piscar" ao tirar o mouse.
const NOS: [number, number][] = [
  [24.0, 11.0],
  [20.0, 8.6],
  [16.6, 12.0],
  [16.6, 18.0],
  [20.0, 21.4],
  [24.0, 19.0],
]

export function MarcaLC({ className = '', animar = true }: { className?: string; animar?: boolean }) {
  return (
    <svg className={`hg-logo ${animar ? 'hg-logo--anima' : ''} ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <rect className="hg-logo__moldura" x="0.5" y="0.5" width="31" height="31" rx="7" pathLength={1} />
      <path className="hg-logo__l" d="M9 8.5 V21.5 H13.6" pathLength={1} />
      <path className="hg-logo__c" d="M24.0 11.0 L20.0 8.6 L16.6 12.0 L16.6 18.0 L20.0 21.4 L24.0 19.0" pathLength={1} />
      {NOS.map(([cx, cy], i) => (
        <g key={i} className="hg-logo__no" style={{ '--i': i } as CSSProperties}>
          <circle className={`hg-logo__ponto ${i === 0 ? 'hg-logo__ponto--acento' : ''}`} cx={cx} cy={cy} r={i === 0 ? 1.7 : 1.25} />
        </g>
      ))}
    </svg>
  )
}

// Logo + nome. As letras sobem em sequência no carregamento (50 ms entre elas).
export function MarcaCompleta({ className = '' }: { className?: string }) {
  return (
    <span className={`hg-marca ${className}`}>
      <MarcaLC />
      <span className="hg-marca__nome" aria-label="LogCodex">
        {'LogCodex'.split('').map((l, i) => (
          <span key={i} aria-hidden="true" style={{ '--i': i } as CSSProperties}>{l}</span>
        ))}
      </span>
    </span>
  )
}
