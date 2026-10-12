'use client'

import { useEffect, useRef } from 'react'
import { Icone } from './Icone'
import type { NomeIcone } from './icones'

// FAQ do piso da skill site-entregue-sem-animacao: um ícone por pergunta (ligado
// ao assunto), abertura e fechamento animados (altura, conteúdo com fade, "+"
// vira "×", o ícone gira de leve e se redesenha). Uma pergunta aberta por vez:
// abrir outra fecha a anterior, animada (pedido do Leo, 12/10).
// Continua sendo <details>/<summary>: sem JS, abre e fecha do jeito nativo; com
// "reduzir movimento", continua uma por vez, mas sem animação.
export function Duvidas({ itens }: { itens: { icone: NomeIcone; q: string; a: string }[] }) {
  const lista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = lista.current
    if (!raiz) return
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const itens = Array.from(raiz.querySelectorAll('details'))
    const animando = new Map<HTMLDetailsElement, Animation>()

    const fechar = (d: HTMLDetailsElement) => {
      const corpo = d.querySelector<HTMLElement>('.hg-duvida__corpo')
      animando.get(d)?.cancel()
      if (reduz || !corpo?.animate) { d.open = false; return }
      d.classList.add('hg-fechando')
      const a = corpo.animate(
        [
          { height: `${corpo.offsetHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)' }
      )
      animando.set(d, a)
      a.onfinish = () => {
        d.open = false
        d.classList.remove('hg-fechando')
        animando.delete(d)
      }
    }

    const abrir = (d: HTMLDetailsElement) => {
      const corpo = d.querySelector<HTMLElement>('.hg-duvida__corpo')
      animando.get(d)?.cancel()
      d.classList.remove('hg-fechando')
      d.open = true
      if (reduz || !corpo?.animate) return
      const h = corpo.scrollHeight
      const a = corpo.animate(
        [
          { height: '0px', opacity: 0, transform: 'translateY(-6px)' },
          { height: `${h}px`, opacity: 1, transform: 'none' },
        ],
        { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }
      )
      animando.set(d, a)
      a.onfinish = () => animando.delete(d)
    }

    // Uma por vez (pedido do Leo, 12/10): abrir uma pergunta fecha a que estava aberta.
    const limpezas = itens.map((d) => {
      const resumo = d.querySelector('summary')!
      const clique = (e: MouseEvent) => {
        e.preventDefault()
        const fechandoEsta = d.open && !d.classList.contains('hg-fechando')
        if (fechandoEsta) return fechar(d)
        itens.forEach((outra) => { if (outra !== d && outra.open) fechar(outra) })
        abrir(d)
      }
      resumo.addEventListener('click', clique)
      return () => resumo.removeEventListener('click', clique)
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
