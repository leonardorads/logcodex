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
        {/* Marca: o mesmo monograma LC do site */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <rect x="0.5" y="0.5" width="31" height="31" rx="7" stroke="#eef0f5" strokeOpacity="0.45" />
            <path d="M9 8.5 V21.5 H13.6" stroke="#eef0f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 11 L20 8.6 L16.6 12 L16.6 18 L20 21.4 L24 19" stroke="#eef0f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="11" r="1.7" fill="#8c90ff" />
            <circle cx="20" cy="8.6" r="1.25" fill="#eef0f5" />
            <circle cx="16.6" cy="12" r="1.25" fill="#eef0f5" />
            <circle cx="16.6" cy="18" r="1.25" fill="#eef0f5" />
            <circle cx="20" cy="21.4" r="1.25" fill="#eef0f5" />
            <circle cx="24" cy="19" r="1.25" fill="#eef0f5" />
          </svg>
          <span style={{ fontSize: 32, marginLeft: '16px', letterSpacing: '-0.01em' }}>LogCodex</span>
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
