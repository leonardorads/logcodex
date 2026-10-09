import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'LogCodex Hospedagem — mais hóspedes reservando direto com você.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Prévia de link da /hospedagem (WhatsApp, e-mail, Instagram) — 09/10/2026.
 * Sem este arquivo a página ficava SEM imagem: o `openGraph` próprio do
 * page.tsx substitui o da home inteiro, inclusive a imagem.
 * Mesmas regras do Satori descritas no opengraph-image da home (flex explícito,
 * espaçamento por margin, sem emoji). Cubo com a geometria do CuboLogo.tsx.
 */
type P = [number, number]
const T: P = [32, 4], UR: P = [60, 20], B: P = [32, 68], LL: P = [4, 52], UL: P = [4, 20], C: P = [32, 36]
const sub = (p: P, q: P): P => [p[0] - q[0], p[1] - q[1]]
function face(o: P, u: P, v: P, cor: (i: number, j: number) => string) {
  const out: { pts: string; cor: string }[] = []
  const f = 0.07
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const u0 = i / 3 + f / 2, u1 = (i + 1) / 3 - f / 2, v0 = j / 3 + f / 2, v1 = (j + 1) / 3 - f / 2
      const pts = ([[u0, v0], [u1, v0], [u1, v1], [u0, v1]] as P[])
        .map(([a, b]) => `${(o[0] + a * u[0] + b * v[0]).toFixed(2)},${(o[1] + a * u[1] + b * v[1]).toFixed(2)}`)
        .join(' ')
      out.push({ pts, cor: cor(i, j) })
    }
  return out
}
const PECAS = [
  ...face(UL, sub(T, UL), sub(C, UL), () => '#4b5b75'),
  ...face(UL, sub(C, UL), sub(LL, UL), (i, j) => (i === 0 || j === 2 ? '#f2f6fc' : '#505c6d')),
  ...face(C, sub(UR, C), sub(B, C), (i, j) => (i === 0 || j === 0 || j === 2 ? '#2f6bff' : '#1d3a86')),
]

const PROVAS = ['Prévia grátis com as suas fotos', 'Reserva direta pelo WhatsApp', 'Sem comissão']

export default async function Image() {
  const fonte = await readFile(join(process.cwd(), 'assets/fonts/PlusJakartaSans-Bold.ttf'))
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '64px 72px', fontFamily: 'Jakarta', color: '#eef1f7',
          background: 'radial-gradient(900px 500px at 85% -10%, #142046 0%, rgba(6,9,18,0) 60%), radial-gradient(700px 400px at 0% 110%, rgba(168,118,58,.35) 0%, rgba(6,9,18,0) 60%), #060912',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="64" height="72" viewBox="2 2 60 68">
            {PECAS.map((p, k) => <polygon key={k} points={p.pts} fill={p.cor} />)}
          </svg>
          <span style={{ fontSize: 34, marginLeft: 18, letterSpacing: '-0.01em' }}>logcodex</span>
          <span style={{ fontSize: 30, marginLeft: 12, color: '#f0cfa0' }}>Hospedagem</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 22, color: '#e8b46a', letterSpacing: '0.16em', marginBottom: 18 }}>SITES PARA POUSADAS DE TODO O BRASIL</span>
          <span style={{ fontSize: 68, lineHeight: 1.08, letterSpacing: '-0.03em' }}>Mais hóspedes reservando</span>
          <span style={{ fontSize: 68, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#f0cfa0' }}>direto com você.</span>
        </div>

        <div style={{ display: 'flex' }}>
          {PROVAS.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', marginRight: 34 }}>
              <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 5, background: '#25d366', marginRight: 12 }} />
              <span style={{ fontSize: 22, color: '#c2c9d6' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Jakarta', data: fonte, weight: 700, style: 'normal' }] },
  )
}
