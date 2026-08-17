'use client'

export function SecCloser({ onOpenContact }: { onOpenContact: (intent: 'agendar') => void }) {
  return (
    <section className="closer" id="contato">
      <div className="closer-content">
        <p className="eyebrow reveal-fade" style={{ justifyContent: 'center' }}>Comece pelo diagnóstico</p>
        <h2 className="reveal-zoom"><strong>Comece</strong> pelo diagnóstico.<br /><em>O resto é com a gente.</em></h2>
        <p className="reveal-fade">
          Conte como sua operação funciona hoje. A gente faz o diagnóstico, desenha a solução, integra com o que você já usa e implanta tudo — do primeiro contato ao suporte contínuo.
        </p>
        <a href="#" className="btn btn-primary reveal-fade" onClick={(e) => { e.preventDefault(); onOpenContact('agendar') }}>
          Falar com especialista →
        </a>
        <p className="fine reveal-fade">Diagnóstico completo · sem compromisso · retorno pelo WhatsApp</p>
      </div>
    </section>
  )
}
