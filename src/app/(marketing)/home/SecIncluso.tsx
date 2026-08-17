'use client'

const ITENS = [
  {
    n: '01',
    title: 'Diagnóstico completo',
    desc: 'Mapeamento da sua operação antes de qualquer proposta — sem achismo.',
    icon: <path d="M11 2a9 9 0 1 0 5.3 16.3L21 23l0.7-0.7-4.7-4.7A9 9 0 0 0 11 2z M11 6v5l3.5 2" />,
  },
  {
    n: '02',
    title: 'Integração com sistemas existentes',
    desc: 'Planilhas, sistemas legados, apps de rastreamento — conectados, não substituídos às cegas.',
    icon: <path d="M8 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3 M16 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3 M8 12h8" />,
  },
  {
    n: '03',
    title: 'Personalização da solução',
    desc: 'Configurada para o seu porte e sua rotina, não um pacote genérico.',
    icon: <path d="M12 2v4 M12 18v4 M4.9 4.9l2.8 2.8 M16.3 16.3l2.8 2.8 M2 12h4 M18 12h4 M4.9 19.1l2.8-2.8 M16.3 7.7l2.8-2.8 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  },
  {
    n: '04',
    title: 'Implantação assistida',
    desc: 'A LogCodex conduz a implantação — sua equipe não carrega o projeto sozinha.',
    icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  },
  {
    n: '05',
    title: 'Capacitação do time',
    desc: 'Treinamento real, no ritmo da sua operação, não um vídeo genérico.',
    icon: <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />,
  },
  {
    n: '06',
    title: 'Suporte técnico consultivo',
    desc: 'Depois do go-live, o suporte continua acompanhando — não só abrindo chamado.',
    icon: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />,
  },
  {
    n: '07',
    title: 'Automação com IA',
    desc: 'Processos repetitivos da operação automatizados com IA aplicada ao seu contexto.',
    icon: <path d="M12 8V4H8 M12 4l4 4 M4 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z M9 16v-3 M15 16v-3 M8 12h.01 M16 12h.01" />,
  },
]

export function SecIncluso({ onOpenContact }: { onOpenContact: (intent: 'agendar') => void }) {
  return (
    <section className="invest" id="incluso">
      <div className="wrap">
        <div className="services-head reveal">
          <div>
            <p className="eyebrow">O que está incluso · 03</p>
            <h2 className="section-title">Não é licença de software.<br /><em>É a entrega completa.</em></h2>
          </div>
          <p className="section-sub">
            Cada projeto da LogCodex inclui as sete frentes abaixo. Não vendemos acesso a um sistema — conduzimos a transformação da sua operação, do diagnóstico ao suporte contínuo.
          </p>
        </div>

        <div className="invest-grid">
          {ITENS.slice(0, 3).map((item) => (
            <div key={item.n} className="inv-card reveal-zoom">
              <svg className="inc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
              <h3>{item.title}</h3>
              <p className="tagline">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="invest-grid" style={{ borderTop: 'none' }}>
          {ITENS.slice(3, 6).map((item) => (
            <div key={item.n} className="inv-card reveal-zoom">
              <svg className="inc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
              <h3>{item.title}</h3>
              <p className="tagline">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="invest-grid" style={{ borderTop: 'none', gridTemplateColumns: '1fr' }}>
          <div className="inv-card reveal-zoom" style={{ borderRight: 'none' }}>
            <svg className="inc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ITENS[6].icon}</svg>
            <h3>{ITENS[6].title}</h3>
            <p className="tagline">{ITENS[6].desc}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <a
            href="#"
            className="btn btn-primary"
            onClick={(e) => { e.preventDefault(); onOpenContact('agendar') }}
          >
            Falar com especialista
          </a>
        </div>
      </div>

      <style>{`
        .inc-icon { width: 26px; height: 26px; color: var(--accent); margin-bottom: 16px; }
      `}</style>
    </section>
  )
}
