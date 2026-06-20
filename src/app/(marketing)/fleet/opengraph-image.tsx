import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'LogCodex Fleet — controle de frota sem planilha. Saiba quanto sobra em cada viagem.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [fontData, boxPng, phonePng] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/PlusJakartaSans-Bold.ttf')),
    readFile(join(process.cwd(), 'assets/og-box3d-clean.png')),
    readFile(join(process.cwd(), 'assets/og-app-screenshot-rounded.png')),
  ])

  const boxSrc = `data:image/png;base64,${boxPng.toString('base64')}`
  const phoneSrc = `data:image/png;base64,${phonePng.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #090b0f 0%, #0f1729 50%, #1e1b4b 100%)',
          fontFamily: 'PlusJakartaSans',
          color: '#fff',
          padding: '40px 0 40px 20px',
        }}
      >
        {/* Left — 3D product box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '380px',
          }}
        >
          <img
            alt="LogCodex Fleet — embalagem 3D"
            src={boxSrc}
            width={360}
            height={400}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Center — text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 1,
            padding: '0 24px',
          }}
        >
          {/* Badge — prova social */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: 12,
              letterSpacing: '0.05em',
              color: '#a5b4fc',
              marginBottom: '16px',
            }}
          >
            EM PRODUÇÃO · JCLS TRANSPORTES · PARANÁ
          </div>

          {/* Headline — gradiente azul grifado */}
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Saiba quanto sobra em cada viagem.
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#94a3b8',
              marginBottom: '24px',
              lineHeight: 1.5,
            }}
          >
            Controle de frota sem planilha. Viagens, despesas e acertos num lugar só.
          </div>

          {/* Offer box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '14px 24px',
            }}
          >
            <span style={{ fontSize: 15, color: '#94a3b8' }}>A partir de</span>
            <span style={{ fontSize: 34, fontWeight: 700, color: '#818cf8' }}>
              R$ 99
            </span>
            <span style={{ fontSize: 15, color: '#94a3b8' }}>/mês</span>
          </div>

          {/* Bottom line */}
          <div style={{ fontSize: 13, color: '#64748b', marginTop: '16px' }}>
            7 dias grátis · Sem cartão · Sem contrato
          </div>
        </div>

        {/* Right — phone mockup with pre-rounded screenshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '280px',
            height: '630px',
          }}
        >
          {/* Phone bezel */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '240px',
              height: '500px',
              borderRadius: '36px',
              background: '#1a1d27',
              border: '4px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.1)',
              padding: '12px',
            }}
          >
            {/* Pre-rounded screenshot — no clipping needed */}
            <img
              alt="Assistente Fleet — chat com IA"
              src={phoneSrc}
              width={216}
              height={476}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'PlusJakartaSans',
          data: fontData,
          style: 'normal' as const,
          weight: 700,
        },
      ],
    }
  )
}
