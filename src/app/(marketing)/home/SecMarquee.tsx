export interface MarqueeItem {
  label: string
  desc: string
  icon: React.ReactNode
}

// Duas fileiras rolando em direções opostas — cada uma dobra a própria lista
// (renderizada 2x) para o loop de CSS ficar contínuo sem salto.
export function SecMarquee({
  eyebrow,
  title,
  titleEm,
  rowA,
  rowB,
}: {
  eyebrow: string
  title: string
  titleEm: string
  rowA: MarqueeItem[]
  rowB: MarqueeItem[]
}) {
  return (
    <section className="marquee-section">
      <div className="wrap reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</p>
        <h2 className="section-title" style={{ margin: '0 auto' }}>{title}<br /><em>{titleEm}</em></h2>
      </div>

      <div className="marquee-row reveal-fade">
        <div className="marquee-track marquee-track-left">
          {[...rowA, ...rowA].map((item, i) => (
            <div className="marquee-card" key={`${item.label}-${i}`}>
              <span className="marquee-icon">{item.icon}</span>
              <strong>{item.label}</strong>
              <span className="marquee-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-row reveal-fade" style={{ marginTop: '16px' }}>
        <div className="marquee-track marquee-track-right">
          {[...rowB, ...rowB].map((item, i) => (
            <div className="marquee-card" key={`${item.label}-${i}`}>
              <span className="marquee-icon">{item.icon}</span>
              <strong>{item.label}</strong>
              <span className="marquee-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-section {
          padding: 120px 0;
          border-top: 1px solid var(--line);
          background: var(--bg-2);
          overflow: hidden;
        }
        .marquee-row {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
        }
        .marquee-track-left { animation: marquee-left 42s linear infinite; }
        .marquee-track-right { animation: marquee-right 42s linear infinite; }
        .marquee-row:hover .marquee-track { animation-play-state: paused; }
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track-left, .marquee-track-right { animation: none; }
        }
        .marquee-card {
          flex: 0 0 auto;
          width: 280px;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 22px 24px;
        }
        .marquee-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          margin-bottom: 14px;
          border-radius: 9px;
          background: rgba(99,102,241,0.1);
          color: var(--accent);
        }
        .marquee-icon svg { width: 18px; height: 18px; }
        .marquee-card strong {
          display: block;
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .marquee-desc {
          display: block;
          font-size: 13.5px;
          color: var(--ink-2);
          line-height: 1.55;
          font-weight: 300;
        }
        @media (max-width: 640px) {
          .marquee-section { padding: 80px 0; }
          .marquee-card { width: 240px; padding: 18px 20px; }
        }
      `}</style>
    </section>
  )
}
