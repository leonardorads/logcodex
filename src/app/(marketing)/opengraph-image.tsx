import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'LogCodex: sistemas sob medida para o seu negócio. Site, WhatsApp com IA, CRM e automações.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Prévia de link da HOME GERAL (WhatsApp, LinkedIn, Telegram).
 * A arte da logística mudou junto com a página para logistica/opengraph-image.tsx.
 *
 * Restrições do Satori (motor do ImageResponse), que não é um browser:
 *  - todo elemento com mais de um filho precisa de `display: flex` explícito;
 *  - não há `gap` confiável: o espaçamento vem de margin;
 *  - sem fonte de emoji embutida (emoji vira retângulo vazio).
 */

// Cubo LogCodex: mesma geometria e cores de _geral/Marca.tsx e hospedagem/CuboLogo.tsx
type P = [number, number]
const sub = (p: P, q: P): P => [p[0] - q[0], p[1] - q[1]]
function faceCubo(o: P, u: P, v: P, cor: (i: number, j: number) => string): [string, string][] {
  const out: [string, string][] = []
  const f = 0.07
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const u0 = i / 3 + f / 2, u1 = (i + 1) / 3 - f / 2, v0 = j / 3 + f / 2, v1 = (j + 1) / 3 - f / 2
      const pts = ([[u0, v0], [u1, v0], [u1, v1], [u0, v1]] as P[]).map(([a, b]) => `${(o[0] + a * u[0] + b * v[0]).toFixed(2)},${(o[1] + a * u[1] + b * v[1]).toFixed(2)}`).join(' ')
      out.push([pts, cor(i, j)])
    }
  return out
}
const T: P = [32, 4], UR: P = [60, 20], B: P = [32, 68], LL: P = [4, 52], UL: P = [4, 20], C: P = [32, 36]
const CUBO = [
  ...faceCubo(UL, sub(T, UL), sub(C, UL), () => '#4b5b75'),
  ...faceCubo(UL, sub(C, UL), sub(LL, UL), (i, j) => (i === 0 || j === 2 ? '#f2f6fc' : '#505c6d')),
  ...faceCubo(C, sub(UR, C), sub(B, C), (i, j) => (i === 0 || j === 0 || j === 2 ? '#2f6bff' : '#1d3a86')),
]

const FRENTES = [
  { t: 'Ser encontrado', c: '#5b9dff' },
  { t: 'Atender no WhatsApp', c: '#3ddc97' },
  { t: 'Organizar o dia a dia', c: '#f5b75b' },
]

export default async function Image() {
  const fonte = await readFile(join(process.cwd(), 'assets/fonts/PlusJakartaSans-Bold.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          color: '#eef0f5',
          fontFamily: 'Jakarta',
          background: 'radial-gradient(900px 600px at 95% -10%, rgba(110,104,255,.45), transparent 60%), radial-gradient(700px 500px at -10% 110%, rgba(40,170,160,.22), transparent 60%), #08090d',
        }}
      >
        {/* Marca: o cubo LogCodex (o mesmo da home e da /hospedagem) */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <svg width="52" height="59" viewBox="2 2 60 68">
            {CUBO.map(([pts, cor], k) => <polygon key={k} points={pts} fill={cor} />)}
          </svg>
          <span style={{ fontSize: 34, marginLeft: '16px', letterSpacing: '-0.01em' }}>logcodex</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 70, lineHeight: 1.04, letterSpacing: '-0.035em', maxWidth: '980px' }}>
          <span style={{ marginRight: '18px' }}>Sistemas</span>
          <span style={{ marginRight: '18px', color: '#a5a8ff' }}>sob medida</span>
          <span>para o seu negócio.</span>
        </div>

        <div style={{ display: 'flex', fontSize: 25, color: '#aab0bd', lineHeight: 1.45, marginTop: '26px', maxWidth: '900px' }}>
          Site, WhatsApp com IA, CRM e automações para pequenos e médios negócios. Prévia grátis antes de decidir.
        </div>

        <div style={{ display: 'flex', marginTop: '40px' }}>
          {FRENTES.map((f) => (
            <div
              key={f.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 18px',
                marginRight: '12px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,.14)',
                background: 'rgba(255,255,255,.04)',
                fontSize: 19,
                color: '#d7dbe5',
              }}
            >
              <div style={{ display: 'flex', width: '9px', height: '9px', borderRadius: '5px', background: f.c, marginRight: '10px' }} />
              {f.t}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: '46px', fontSize: 19, color: '#8b91a0' }}>logcodex.com.br</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Jakarta', data: fonte, style: 'normal' as const, weight: 700 }],
    }
  )
}
