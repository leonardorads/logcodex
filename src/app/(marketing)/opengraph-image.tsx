import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'LogCodex — diagnóstico, integração, implantação e suporte para operações logísticas.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Prévia de link da HOME (WhatsApp, LinkedIn, Telegram).
 *
 * Substitui o antigo `public/og-image.png`, que tinha três problemas: era quase
 * todo espaço vazio, dizia só o nome da marca sem contar o que a LogCodex faz, e
 * carregava o slogan antigo ("Tecnologia que resolve. Operação que escala.")
 * além do domínio `.com.br` — enquanto o canônico do site é o `.com`.
 *
 * Gerado em código, como o da /fleet: um PNG estático desatualiza a cada ajuste
 * de posicionamento e ninguém percebe, porque a arte só aparece fora do site.
 *
 * Restrições do Satori (motor do ImageResponse), que não é um browser:
 *  - todo elemento com mais de um filho precisa de `display: flex` explícito;
 *  - não há `gap` confiável — o espaçamento vem de margin;
 *  - sem fonte de emoji embutida (emoji vira retângulo vazio).
 */

// As 7 frentes da entrega, as mesmas da seção "O que está incluso" da página.
// Divididas em duas colunas para caber sem apertar.
const FRENTES_A = ['Diagnóstico completo', 'Integração com o que já existe', 'Implantação assistida', 'Capacitação do time']
const FRENTES_B = ['Suporte técnico consultivo', 'Automação com IA', 'Personalização da solução']

function Item({ texto }: { texto: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
      <div
        style={{
          display: 'flex',
          width: '7px',
          height: '7px',
          borderRadius: '4px',
          background: '#818cf8',
          marginRight: '12px',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 19, color: '#cbd5e1' }}>{texto}</span>
    </div>
  )
}

export default async function Image() {
  const [fontData] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/PlusJakartaSans-Bold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #090b0f 0%, #0f1729 50%, #1e1b4b 100%)',
          fontFamily: 'PlusJakartaSans',
          color: '#fff',
          padding: '0 72px',
        }}
      >
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '26px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '13px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              marginRight: '16px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 21, fontWeight: 700, color: '#fff' }}>LC</span>
          </div>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em' }}>LogCodex</span>
        </div>

        {/* Headline — o posicionamento, não o slogan antigo */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            marginBottom: '20px',
            maxWidth: '900px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Sua operação logística, resolvida ponta a ponta.
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: '#94a3b8',
            lineHeight: 1.45,
            marginBottom: '34px',
            maxWidth: '860px',
          }}
        >
          Não é licença de software: é a entrega completa, do diagnóstico ao time treinado —
          sem travar a operação.
        </div>

        {/* As 7 frentes, em duas colunas */}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '430px' }}>
            {FRENTES_A.map((f) => (
              <Item key={f} texto={f} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FRENTES_B.map((f) => (
              <Item key={f} texto={f} />
            ))}
          </div>
        </div>

        {/* Rodapé — domínio canônico .com, não .com.br */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '22px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(148, 163, 184, 0.18)',
          }}
        >
          <span style={{ fontSize: 17, color: '#64748b' }}>logcodex.com</span>
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
