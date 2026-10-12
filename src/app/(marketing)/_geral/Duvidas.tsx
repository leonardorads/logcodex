'use client'

import { useEffect, useRef } from 'react'
import { Icone } from './Icone'
import type { NomeIcone } from './icones'

// FAQ do piso da skill site-entregue-sem-animacao: um ícone por pergunta (ligado
// ao assunto), abertura e fechamento animados (altura em ~340 ms, conteúdo com
// fade, "+" vira "×", o ícone gira de leve e se redesenha).
// Continua sendo <details>/<summary>: sem JS ou com "reduzir movimento", abre
// e fecha do jeito nativo, sem animação.
export function Duvidas({ itens }: { itens: { icone: NomeIcone; q: string; a: string }[] }) {
  const lista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = lista.current
    if (!raiz) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const limpezas: (() => void)[] = []
    raiz.querySelectorAll('details').forEach((d) => {
      const resumo = d.querySelector('summary')
      const corpo = d.querySelector<HTMLElement>('.hg-duvida__corpo')
      if (!resumo || !corpo || !corpo.animate) return
      let animando: Animation | null = null
      const clique = (e: MouseEvent) => {
        e.preventDefault()
        animando?.cancel()
        if (!d.open) {
          d.open = true
          const h = corpo.scrollHeight
          animando = corpo.animate(
            [
              { height: '0px', opacity: 0, transform: 'translateY(-6px)' },
              { height: `${h}px`, opacity: 1, transform: 'none' },
            ],
            { duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)' }
          )
          animando.onfinish = () => { animando = null }
        } else {
          d.classList.add('hg-fechando')
          animando = corpo.animate(
            [
              { height: `${corpo.offsetHeight}px`, opacity: 1 },
              { height: '0px', opacity: 0 },
            ],
            { duration: 260, easing: 'cubic-bezier(.4,0,.6,1)' }
          )
          animando.onfinish = () => {
            d.open = false
            d.classList.remove('hg-fechando')
            animando = null
          }
        }
      }
      resumo.addEventListener('click', clique)
      limpezas.push(() => resumo.removeEventListener('click', clique))
    })
    return () => limpezas.forEach((f) => f())
  }, [])

  return (
    <div className="hg-duvidas" ref={lista}>
      {itens.map((f) => (
        <details key={f.q} className="hg-duvida" data-rev="">
          <summary>
            <span className="hg-duvida__ic"><Icone nome={f.icone} /></span>
            <span className="hg-duvida__q">{f.q}</span>
            <span className="hg-duvida__mais" aria-hidden="true" />
          </summary>
          <div className="hg-duvida__corpo">
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
