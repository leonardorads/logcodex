import type { MarqueeItem } from '../home/SecMarquee'

// Versão do marquee com as classes .fl-* da /fleet (paleta e tipografia próprias
// da landing, isoladas de .lcx-root). Mesma mecânica de scroll do SecMarquee.
export function FleetMarquee({ rowA, rowB }: { rowA: MarqueeItem[]; rowB: MarqueeItem[] }) {
  return (
    <div className="fl-marquee-section rev">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="fl-eyebrow">Em síntese</span>
        <h2 className="fl-h2">Tudo que o Fleet<br /><em>já coloca pra rodar.</em></h2>
      </div>

      <div className="fl-marquee-row">
        <div className="fl-marquee-track fl-marquee-track-left">
          {[...rowA, ...rowA].map((item, i) => (
            <div className="fl-marquee-card" key={`${item.label}-${i}`}>
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fl-marquee-row" style={{ marginTop: '14px' }}>
        <div className="fl-marquee-track fl-marquee-track-right">
          {[...rowB, ...rowB].map((item, i) => (
            <div className="fl-marquee-card" key={`${item.label}-${i}`}>
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .fl-marquee-section { padding: 80px 0; overflow: hidden; }
        .fl-marquee-row {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .fl-marquee-track { display: flex; gap: 14px; width: max-content; }
        .fl-marquee-track-left { animation: fl-marquee-left 38s linear infinite; }
        .fl-marquee-track-right { animation: fl-marquee-right 38s linear infinite; }
        .fl-marquee-row:hover .fl-marquee-track { animation-play-state: paused; }
        @keyframes fl-marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fl-marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .fl-marquee-track-left, .fl-marquee-track-right { animation: none; }
        }
        .fl-marquee-card {
          flex: 0 0 auto;
          width: 260px;
          background: var(--fl-bg2);
          border: 1px solid var(--fl-line);
          border-radius: 12px;
          padding: 18px 20px;
        }
        .fl-marquee-card strong { display: block; font-size: 14px; font-weight: 600; color: var(--fl-ink); margin-bottom: 6px; }
        .fl-marquee-card span { font-size: 12.5px; color: var(--fl-ink2); line-height: 1.5; }
        @media (max-width: 600px) {
          .fl-marquee-section { padding: 56px 0; }
          .fl-marquee-card { width: 220px; padding: 14px 16px; }
        }
      `}</style>
    </div>
  )
}
