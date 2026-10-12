import { createElement } from 'react'
import { ICONES, type NomeIcone } from './icones'

// Ícone de traço. Cada forma recebe pathLength=1: assim o CSS desenha qualquer
// ícone com a mesma duração (stroke-dasharray/dashoffset de 1 → 0).
// Não usar <use>/sprite: o CSS de animação não alcança o conteúdo clonado.
export function Icone({ nome, className = '' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg className={`hg-ic ${className}`} data-ic={nome} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONES[nome].map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs, pathLength: 1 }))}
    </svg>
  )
}

// Emblema de seção: azulejo de duas cores com uma luz que corre pela borda. O ícone
// se desenha ao entrar na tela e depois ganha um gesto próprio, de tempos em tempos
// (a lupa procura, o relógio gira, o foguete sobe...). No hover do cartão, ele
// salta e se redesenha. Tudo no CSS (home-geral.css, "Ícones vivos").
export function Emblema({ nome, className = '' }: { nome: NomeIcone; className?: string }) {
  return (
    <span className={`hg-emblema ${className}`} aria-hidden="true">
      <Icone nome={nome} />
    </span>
  )
}
