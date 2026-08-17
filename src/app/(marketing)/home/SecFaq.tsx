import { FAQ } from './faq-data'

export function SecFaq() {
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal-left">
            <p className="eyebrow">FAQ · 06</p>
            <h2 className="section-title">Antes de conversar,<br /><em>vale saber.</em></h2>
          </div>

          <div className="faq-list reveal-right">
            {FAQ.map(({ q, a }) => (
              <details className="faq-item" key={q}>
                <summary>{q}</summary>
                <p className="ans">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
