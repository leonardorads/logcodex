// Seção server-only — o CTA abre o modal via link para #contato,
// que a Closer/Nav já tratam com onClick. Aqui é âncora simples de rolagem.
// Reveal com leve zoom-in (scale), diferente do slide-up padrão das outras
// seções — reforça a diversidade de movimento pedida entre seções.
export function SecDiagnostico() {
  return (
    <section className="stmt" id="diagnostico">
      <span className="stmt-num reveal-fade">/01 · Diagnóstico</span>
      <div className="wrap reveal-zoom">
        <p>
          Antes de propor qualquer coisa,<br />
          <strong>a gente entende</strong> a sua <em>operação.</em>
        </p>
      </div>
    </section>
  )
}
