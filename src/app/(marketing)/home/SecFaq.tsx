'use client'

import { useState } from 'react'
import { FAQ } from './faq-data'

/**
 * O `<details>` nativo abre e fecha instantaneamente — o navegador troca o
 * `display` do conteúdo, e não existe transição de CSS para isso. Para animar
 * é preciso assumir o controle: manter o item aberto durante o fechamento
 * (senão o conteúdo some antes de encolher) e animar a altura medida.
 *
 * `grid-template-rows: 0fr → 1fr` faz a animação sem precisar medir pixel,
 * então funciona com qualquer tamanho de resposta e responde a mudança de
 * largura da tela sem recalcular nada.
 */
export function SecFaq() {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal-left">
            <p className="eyebrow">FAQ · 06</p>
            <h2 className="section-title">Antes de conversar,<br /><em>vale saber.</em></h2>
          </div>

          <div className="faq-list reveal-right">
            {FAQ.map(({ q, a }) => {
              const estaAberto = aberto === q
              return (
                <div className={`faq-item${estaAberto ? ' faq-open' : ''}`} key={q}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={estaAberto}
                    onClick={() => setAberto(estaAberto ? null : q)}
                  >
                    <span>{q}</span>
                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="faq-ans-wrap">
                    <div className="faq-ans-inner">
                      <p className="ans">{a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .lcx-root .faq-q {
          width: 100%; display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; padding: 24px 0; background: none; border: none;
          font-family: inherit; text-align: left; cursor: pointer;
          color: var(--ink); font-size: 17px; font-weight: 400; letter-spacing: -0.01em;
          transition: color .2s var(--ease);
        }
        .lcx-root .faq-q:hover { color: var(--accent); }
        .lcx-root .faq-chevron {
          width: 18px; height: 18px; flex-shrink: 0; margin-top: 3px;
          color: var(--ink-3);
          transition: transform .35s var(--ease), color .2s var(--ease);
        }
        .lcx-root .faq-open .faq-chevron { transform: rotate(180deg); color: var(--accent); }

        /* 0fr → 1fr anima sem precisar medir altura em pixel: serve para
           qualquer tamanho de resposta e sobrevive a mudança de largura. */
        .lcx-root .faq-ans-wrap {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .38s var(--ease);
        }
        .lcx-root .faq-open .faq-ans-wrap { grid-template-rows: 1fr; }
        .lcx-root .faq-ans-inner { overflow: hidden; }
        .lcx-root .faq-ans-inner .ans {
          opacity: 0; transform: translateY(-4px);
          transition: opacity .3s var(--ease), transform .3s var(--ease);
        }
        .lcx-root .faq-open .faq-ans-inner .ans {
          opacity: 1; transform: none;
          transition-delay: .08s;
        }

        @media (prefers-reduced-motion: reduce) {
          .lcx-root .faq-ans-wrap,
          .lcx-root .faq-chevron,
          .lcx-root .faq-ans-inner .ans { transition: none; }
        }
      `}</style>
    </section>
  )
}
