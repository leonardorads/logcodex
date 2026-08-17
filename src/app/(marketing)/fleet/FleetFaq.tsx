'use client'

import { useState } from 'react'
import { FAQ } from './faq-data'

/**
 * Mesmo motivo do FAQ da home (SecFaq.tsx): o `<details>` nativo troca o
 * `display` do conteúdo ao abrir, e não existe transição de CSS para isso —
 * a resposta aparecia de um quadro para o outro.
 *
 * `grid-template-rows: 0fr → 1fr` anima sem precisar medir altura em pixel,
 * então funciona com qualquer tamanho de resposta e sobrevive a mudança de
 * largura da tela (o texto refluindo não quebra a animação).
 *
 * Um aberto por vez: com 6 respostas longas, permitir várias abertas faz a
 * página saltar sob o dedo de quem está lendo.
 */
export function FleetFaq() {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <div className="fl-faq-list">
      {FAQ.map(({ q, a }) => {
        const estaAberto = aberto === q
        return (
          <div className={`fl-faq${estaAberto ? ' fl-faq-open' : ''}`} key={q}>
            <button
              type="button"
              className="fl-faq-q"
              aria-expanded={estaAberto}
              onClick={() => setAberto(estaAberto ? null : q)}
            >
              <span>{q}</span>
              <svg className="fl-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="fl-faq-wrap">
              <div className="fl-faq-inner">
                <p className="ans">{a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
