'use client'

import { useEffect, useRef } from 'react'

const STEPS = [
  {
    tag: '/01 · diagnóstico',
    title: 'Mapeamento completo da operação',
    desc: <>Entendemos como sua operação funciona hoje — processos, sistemas em uso, gargalos, rotina do time. <strong>O diagnóstico vira a base de tudo que vem depois.</strong></>,
  },
  {
    tag: '/02 · desenho da solução',
    title: 'A solução certa, não a genérica',
    desc: <>A partir do diagnóstico, desenhamos o que precisa ser construído ou configurado — sem empurrar módulos que não resolvem o seu problema. <strong>Você não paga pelo que não usa.</strong></>,
  },
  {
    tag: '/03 · integração',
    title: 'Conectado ao que você já usa',
    desc: <>Planilhas, outro sistema, apps de rastreamento — a integração parte do que já existe. <strong>Você não recomeça do zero.</strong></>,
  },
  {
    tag: '/04 · implantação assistida',
    title: 'A gente assume a parte pesada',
    desc: <>A implantação é conduzida pela LogCodex, em etapas, sem exigir que sua equipe pare a rotina para aprender sistema. <strong>A operação continua rodando enquanto o sistema é ajustado.</strong></>,
  },
  {
    tag: '/05 · capacitação',
    title: 'Seu time treinado, não só logado',
    desc: <>Ninguém recebe acesso sem saber usar. O treinamento acompanha o ritmo real da equipe — não um manual genérico. <strong>Adoção não é um problema que sobra pra você resolver.</strong></>,
  },
  {
    tag: '/06 · suporte técnico',
    title: 'Suporte consultivo, não só ticket',
    desc: <>Depois que o sistema entra no ar, o suporte continua — técnico e consultivo, acompanhando a operação, não só respondendo chamado. <strong>Você não fica sozinho depois do go-live.</strong></>,
  },
  {
    tag: '/07 · automação com IA',
    title: 'IA aplicada à realidade logística',
    desc: <>Processos repetitivos da operação — triagem, cálculo, resposta a perguntas recorrentes — são automatizados com IA aplicada ao seu contexto real. <strong>Não é IA genérica, é IA na sua rotina.</strong></>,
  },
]

// Timeline com revelação própria, sequencial e ligada ao scroll — cada passo só
// aparece quando ELE entra na viewport (não a seção inteira). Isolado do
// fallback global de 1200ms do MarketingPage (que forçaria tudo visível de uma
// vez), para o efeito de "desenrolar" a lista ficar genuíno em 7 passos.
export function SecComoEntregamos() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const steps = container.querySelectorAll<HTMLElement>('.tl-step')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('tl-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '-80px 0px -10% 0px', threshold: 0.15 }
    )
    steps.forEach((el) => io.observe(el))

    // Progresso da linha vertical: 0 quando o topo da timeline chega ao meio
    // da tela, 1 quando o fim passa por lá. rAF para não recalcular layout a
    // cada evento de scroll (getBoundingClientRect força reflow).
    let ticking = false
    const atualizarProgresso = () => {
      ticking = false
      const r = container.getBoundingClientRect()
      const vh = window.innerHeight
      // A linha começa a crescer quando o topo da timeline chega a 85% da
      // altura da tela e termina quando o fim dela passa dos 55%. Sem essa
      // janela, o cálculo saturava em 1 assim que a seção entrava.
      const inicio = vh * 0.85
      const fim = vh * 0.55
      const percorrido = inicio - r.top
      const total = Math.max(r.height + (inicio - fim), 1)
      const p = Math.min(1, Math.max(0, percorrido / total))
      container.style.setProperty('--tl-progresso', p.toFixed(3))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(atualizarProgresso)
    }
    atualizarProgresso()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="process" id="metodo">
      <div className="wrap-narrow">
        <div className="process-head reveal">
          <p className="eyebrow">Como entregamos · 02</p>
          <h2 className="section-title">Do diagnóstico ao time treinado.<br /><em>Sem a operação parar.</em></h2>
        </div>
        <p className="reveal" style={{ color: 'var(--ink-3)', fontSize: '17px', lineHeight: 1.8, maxWidth: '640px', marginBottom: '64px' }}>
          A LogCodex não entrega uma licença de software. Entrega um projeto completo — do primeiro diagnóstico ao suporte contínuo, com a nossa equipe assumindo a parte técnica em cada etapa.
        </p>

        <div className="timeline" ref={containerRef}>
          {STEPS.map((s, i) => (
            <div key={s.tag} className={`tl-step${i === 0 ? ' now' : ''}`}>
              <span className="tl-num">{s.tag}</span>
              <h3 className="tl-title">{s.title}</h3>
              <p className="tl-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Leitura cronológica: o passo entra pela esquerda (sentido da linha
           do tempo), e dentro dele o número → título → descrição aparecem em
           cascata, como se a etapa estivesse sendo escrita naquele instante. */
        .tl-step {
          opacity: 0;
          transform: translateX(-18px);
          transition: opacity .55s var(--ease), transform .55s var(--ease);
        }
        .tl-step.tl-in { opacity: 1; transform: none; }

        /* O atraso vem na MESMA declaração da forma curta de transition:
           escrever transition-delay numa regra separada não adianta, porque a
           forma curta reseta o delay e vence por vir depois na cascata — foi
           assim que o escalonamento dos cards da /fleet falhou antes. */
        .lcx-root .tl-step .tl-num,
        .lcx-root .tl-step .tl-title,
        .lcx-root .tl-step .tl-desc {
          opacity: 0;
          transform: translateY(10px);
        }
        .lcx-root .tl-step .tl-num   { transition: opacity .5s var(--ease) .10s, transform .5s var(--ease) .10s; }
        .lcx-root .tl-step .tl-title { transition: opacity .5s var(--ease) .20s, transform .5s var(--ease) .20s; }
        .lcx-root .tl-step .tl-desc  { transition: opacity .5s var(--ease) .30s, transform .5s var(--ease) .30s; }
        .lcx-root .tl-step.tl-in .tl-num,
        .lcx-root .tl-step.tl-in .tl-title,
        .lcx-root .tl-step.tl-in .tl-desc { opacity: 1; transform: none; }

        /* O marcador pulsa ao acender: é o "tique" do relógio da etapa. */
        .tl-step::before {
          transform: scale(.4);
          opacity: 0;
          transition: transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s var(--ease);
        }
        .tl-step.tl-in::before { transform: scale(1); opacity: 1; }

        /* A linha vertical se desenha de cima para baixo conforme a seção é
           percorrida — o progresso é escrito por JS em --tl-progresso. */
        .lcx-root .timeline::before {
          transform-origin: top;
          transform: scaleY(var(--tl-progresso, 0));
          transition: transform .18s linear;
        }

        @media (prefers-reduced-motion: reduce) {
          .tl-step,
          .tl-step .tl-num, .tl-step .tl-title, .tl-step .tl-desc,
          .tl-step::before {
            opacity: 1; transform: none; transition: none;
          }
          .lcx-root .timeline::before { transform: none; }
        }
      `}</style>
    </section>
  )
}
