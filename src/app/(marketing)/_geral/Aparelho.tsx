import type { ReactNode } from 'react'

// Peças de aparelho compartilhadas pelas demonstrações (cena do topo e Fleet).
// A moldura do celular é a mesma do celular da página do Fleet (pedido do Leo,
// 12/10: "deixar o mesmo padrão do fleet que está ótimo"): aro preto, botões
// laterais, barra de status e barra inicial. Estilo em aparelho.css.

export function Status({ claro = false, hora = '14:32' }: { claro?: boolean; hora?: string }) {
  return (
    <div className={`hg-cel__status ${claro ? 'hg-cel__status--claro' : ''}`}>
      <span>{hora}</span>
      <span className="hg-cel__status-ic" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="16" width="3.5" height="5" rx=".5" /><rect x="7.5" y="12" width="3.5" height="9" rx=".5" /><rect x="13" y="8" width="3.5" height="13" rx=".5" /><rect x="18.5" y="4" width="3.5" height="17" rx=".5" /></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.111 16.404a5.5 5.5 0 0 1 7.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
        <svg viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="1" width="18" height="12" rx="3" /><rect x="3" y="3" width="12" height="8" rx="1.5" fill="currentColor" /><path d="M21 4v6" strokeLinecap="round" /></svg>
      </span>
    </div>
  )
}

export function MolduraCelular({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`hg-cel ${className}`}>
      <span className="hg-cel__botao hg-cel__botao--1" />
      <span className="hg-cel__botao hg-cel__botao--2" />
      <span className="hg-cel__botao hg-cel__botao--3" />
      <span className="hg-cel__botao hg-cel__botao--liga" />
      <div className="hg-cel__tela">
        {children}
        <div className="hg-cel__barra"><span /></div>
      </div>
    </div>
  )
}

// Cursor de seta (computador) — o toque do dedo é .hg-toque
export function Cursor({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`hg-cursor ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 3l13 8.5-6 1.2-3.2 5.6z" /></svg>
    </span>
  )
}
