'use client'

import { useEffect, useRef } from 'react'

const OBJECOES = [
  {
    n: '/01',
    objecao: '"Vai dar muito trabalho mudar."',
    resposta: 'O trabalho pesado é nosso. Diagnóstico, desenho da solução e implantação são conduzidos pela LogCodex — seu time participa, não carrega o projeto sozinho.',
  },
  {
    n: '/02',
    objecao: '"Vai ser difícil integrar com o que eu já uso."',
    resposta: 'A integração começa mapeando o que você já usa — planilhas, sistema atual, apps de rastreamento. A solução é desenhada em cima disso, não no lugar disso.',
  },
  {
    n: '/03',
    objecao: '"Minha operação vai parar."',
    resposta: 'A implantação é em etapas, em paralelo à rotina atual. Sua operação continua rodando enquanto o sistema é ajustado — não existe um "desligar tudo para migrar".',
  },
  {
    n: '/04',
    objecao: '"Meu time não vai se adaptar."',
    resposta: 'A capacitação da equipe é parte da entrega, não um manual à parte. O treinamento acompanha o ritmo real do time, com suporte técnico disponível depois.',
  },
]

// Reveal sequencial próprio (isolado do fallback global de 1200ms), com
// deslize lateral da esquerda — distinto do "Como entregamos" (vertical) e
// do roadmap (vertical), para diversificar o movimento entre seções.
export function SecObjecoes() {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const rows = container.querySelectorAll<HTMLElement>('.obj-row')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('obj-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '-80px 0px -10% 0px', threshold: 0.15 }
    )
    rows.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="services" id="implantacao">
      <div className="wrap">
        <div className="services-head reveal">
          <div>
            <p className="eyebrow">Implantação · 04</p>
            <h2 className="section-title">Vai dar trabalho?<br /><em>Essa é a nossa parte.</em></h2>
          </div>
          <p className="section-sub">
            As objeções mais comuns antes de começar um projeto de transformação operacional — e por que elas não se aplicam do jeito que a LogCodex trabalha.
          </p>
        </div>

        <div className="svc-list" ref={listRef}>
          {OBJECOES.map((o) => (
            // `.obj-row` (transição de revelação) isolada do `.svc-row`
            // (transição de hover do padding, definida em marketing.css) —
            // as duas na mesma tag fariam uma sobrescrever a `transition`
            // da outra, travando o hover sem suavização.
            <div key={o.n} className="obj-row">
              <div className="svc-row" style={{ cursor: 'default' }}>
                <span className="svc-n">{o.n}</span>
                <span />
                <span className="svc-name">{o.objecao}</span>
                <span className="svc-desc">{o.resposta}</span>
                <span />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .obj-row {
          width: 100%;
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity .65s var(--ease), transform .65s var(--ease);
        }
        .obj-row.obj-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .obj-row { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </section>
  )
}
