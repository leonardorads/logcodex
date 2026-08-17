'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const CAPACIDADES = [
  {
    n: '/01',
    icon: <path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    name: 'Controle de frota com IA (Fleet)',
    desc: 'Viagens, acertos com motoristas, despesas e um assistente que responde perguntas em português com dados reais da operação.',
  },
  {
    n: '/02',
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    name: 'Assistente conversacional aplicado à operação',
    desc: '"Quanto gastei com combustível em maio?" — resposta com contexto real, sem abrir relatório. A mesma abordagem se estende a outros processos do cliente.',
  },
  {
    n: '/03',
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />,
    name: 'Painéis operacionais sob medida',
    desc: 'Viagens ativas, faturamento, margem, pendências — o que decide o dia a dia da operação, sem esperar relatório fechado.',
  },
]

const ROADMAP = [
  { status: 'AGORA', name: 'Controle de frota (Fleet)', desc: 'Viagens, acertos, despesas e assistente de IA — em operação real.' },
  { status: 'PRÓXIMO', name: 'Otimização de rotas', desc: 'Roteirização inteligente: menor custo, menor KM, melhor sequência de entregas.' },
  { status: 'EM BREVE', name: 'Gestão de pátio', desc: 'Controle de entrada, saída e posição de veículos e carretas.' },
  { status: 'EM BREVE', name: 'Gestão de armazém', desc: 'Estoque, posições, separação e expedição integrados ao transporte.' },
]

// O roadmap tem revelação própria, sequencial e ligada ao scroll — cada linha
// só aparece quando ELA entra na viewport, isolado do fallback global de
// 1200ms do MarketingPage (que forçaria as 4 linhas visíveis de uma vez),
// mesmo padrão já usado em SecComoEntregamos.tsx.
export function SecCapacidades() {
  const roadmapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = roadmapRef.current
    if (!container) return

    const rows = container.querySelectorAll<HTMLElement>('.rm-row')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('rm-in')
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
    <>
      <section className="services" id="capacidades">
        <div className="wrap">
          <div className="services-head reveal">
            <div>
              <p className="eyebrow">Capacidades · 05</p>
              <h2 className="section-title">O que já colocamos<br /><em>rodando em operação real.</em></h2>
            </div>
            <p className="section-sub">
              O Fleet é um exemplo do que a LogCodex já entregou e mantém em produção — não é o centro da oferta. A solução para a sua operação é desenhada a partir do seu diagnóstico, podendo usar o Fleet, integrá-lo a outros sistemas, ou construir algo diferente.
            </p>
          </div>

          <div className="svc-list">
            {CAPACIDADES.map((c) => (
              // `reveal-right` isolado num wrapper, não na própria `.svc-row`:
              // essa classe já tem `transition: padding` (hover) definida no
              // CSS global — se `reveal-right` fosse aplicada na mesma tag,
              // a `transition` do MarketingPage (opacity/transform) tomaria
              // a propriedade inteira e o hover perderia a suavização,
              // saltando o padding em vez de animar.
              <div key={c.n} className="reveal-right">
                <div className="svc-row">
                  <span className="svc-n">{c.n}</span>
                  <svg className="svc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                  <span className="svc-name">{c.name}</span>
                  <span className="svc-desc">{c.desc}</span>
                  <span className="svc-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOT — ASSISTENTE (única prova visual mantida na home) */}
      <section style={{ padding: '0 clamp(16px,4vw,40px) 100px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Texto à esquerda, ícone grande à direita: o ícone deixa de ser um
            selo de 26px dentro do eyebrow e vira a âncora visual do bloco. */}
        <div className="reveal cap-fleet-head">
          <div className="cap-fleet-txt">
            <p className="eyebrow eyebrow-fleet" style={{ marginBottom: '12px' }}>Em produção · Fleet.ai</p>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: '10px' }}>
              Pergunta em português. <em style={{ fontStyle: 'normal', color: 'var(--ink-3)' }}>Resposta com dados reais.</em>
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.6 }}>
              Um exemplo do tipo de automação que a LogCodex constrói em cima da operação real do cliente.
            </p>
          </div>
          <div className="cap-fleet-icone">
            <Image src={`${BASE}/fleet-icon.png`} alt="Fleet.ai" width={168} height={168} />
          </div>
        </div>

        {/* 520px: o vídeo é ilustrativo e competia com o texto em 620px. */}
        <div className="reveal-zoom lcx-laptop" style={{ maxWidth: '520px' }}>
          <div className="lcx-laptop-frame">
            <div className="lcx-laptop-bar">
              <div className="lcx-laptop-dot lcx-dot-red" />
              <div className="lcx-laptop-dot lcx-dot-yellow" />
              <div className="lcx-laptop-dot lcx-dot-green" />
            </div>
            <div className="lcx-laptop-screen">
              <video
                src={`${BASE}/screenshots/logcodex-fleet-assistant_2.mp4`}
                autoPlay muted loop playsInline preload="metadata"
                aria-label="Assistente Fleet — chat IA com dados reais da operação"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
          <div className="lcx-laptop-base" />
          <div className="lcx-laptop-foot" />
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {/* Nova guia: a home é a página de conversão, o Fleet é material de
              apoio — mandar embora quem estava decidindo custa o lead. */}
          <a href="/fleet" className="btn btn-fleet" target="_blank" rel="noopener noreferrer">
            <Image src={`${BASE}/fleet-icon.png`} alt="" width={22} height={22} aria-hidden="true" />
            Conheça o Fleet.ai →
          </a>
        </div>
      </section>

      {/* ROADMAP — absorvido nesta seção */}
      <section className="about" style={{ padding: '160px 40px', borderTop: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div className="services-head reveal" style={{ marginBottom: '64px' }}>
            <div>
              <p className="eyebrow">Roadmap</p>
              <h2 className="section-title">A logística inteira,<br /><em>peça por peça.</em></h2>
            </div>
            <p className="section-sub">
              A LogCodex desenvolve capacidades para toda a operação logística. Cada módulo segue a mesma tese: tecnologia que reduz ruído operacional, entregue como projeto — não como licença.
            </p>
          </div>

          <div className="svc-list" ref={roadmapRef}>
            {ROADMAP.map((r) => (
              // Mesmo isolamento do bloco de Capacidades acima: `.rm-row` (a
              // transição de revelação) não pode ficar na mesma tag que
              // `.svc-row` (a transição de hover do padding), senão uma
              // sobrescreve a outra e o hover perde a suavização.
              <div key={r.name} className="rm-row">
                <div className="svc-row" style={{ cursor: 'default' }}>
                  <span className="svc-n">{r.status}</span>
                  <span />
                  <span className="svc-name">{r.name}</span>
                  <span className="svc-desc">{r.desc}</span>
                  <span className="svc-arrow" style={{ color: r.status === 'AGORA' ? 'var(--accent)' : undefined }}>{r.status === 'AGORA' ? '●' : '○'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        #capacidades .svc-list > .reveal-right { width: 100%; }

        .cap-fleet-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 40px; margin-bottom: 48px;
        }
        .cap-fleet-txt { flex: 1; min-width: 0; }
        .cap-fleet-icone { flex-shrink: 0; line-height: 0; }
        .cap-fleet-icone img {
          width: 168px; height: 168px; border-radius: 34px;
          box-shadow: 0 20px 60px -18px rgba(201,168,118,0.4);
        }
        @media (max-width: 860px) {
          /* Empilha e centraliza: lado a lado em tela estreita espremeria os
             dois. O ícone vem primeiro por ser o elemento de impacto. */
          .cap-fleet-head { flex-direction: column-reverse; text-align: center; gap: 28px; }
          .cap-fleet-txt .eyebrow { justify-content: center; }
          .cap-fleet-txt p:last-child { margin-left: auto; margin-right: auto; }
          .cap-fleet-icone img { width: 132px; height: 132px; border-radius: 28px; }
        }
        .rm-row {
          width: 100%;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .6s var(--ease), transform .6s var(--ease);
        }
        .rm-row.rm-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .rm-row { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </>
  )
}
