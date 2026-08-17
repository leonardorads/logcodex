import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'Fleet.ai — o assistente de frota que responde pelo WhatsApp, implantado sob medida pela LogCodex.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Prévia de link (WhatsApp, LinkedIn, Telegram).
 *
 * A caixa 3D de produto saiu: a LogCodex não vende software de prateleira, e a
 * embalagem contava exatamente a história errada. No lugar entra a demonstração
 * do assistente no WhatsApp — o mesmo recurso que a seção `#whatsapp` da página
 * mostra, e o argumento mais forte para quem recebe o link JUSTAMENTE por
 * WhatsApp: a prévia já é do canal em que a pessoa está.
 *
 * O celular é desenhado aqui em JSX, não é imagem: a conversa precisa bater com
 * a da página (mesmos dados fictícios de FleetWhatsApp.tsx) e um PNG ficaria
 * dessincronizado no primeiro ajuste de copy.
 *
 * Restrições do Satori (motor do ImageResponse), que não é um browser:
 *  - todo elemento com mais de um filho precisa de `display: flex` explícito;
 *  - não há `gap` confiável — o espaçamento vem de margin;
 *  - sem `position: relative` aninhado complexo, sem pseudo-elementos.
 */

// Mesmos dados fictícios da seção do WhatsApp na página — motoristas, placas e
// valores inventados. Nada de operação real de cliente aparece aqui.
// Sem emoji no rótulo da rota: o Satori não embute fonte de emoji e renderiza
// um retângulo vazio no lugar (o 🚛 da página vira caixa cinza aqui).
//
// Só DUAS viagens e fontes grandes: no WhatsApp esta arte chega com ~340px de
// largura, então o celular ocupa uns 90px reais. Tudo que for menor que ~13px
// aqui vira borrão ilegível lá — a conversa precisa ser lida de relance, não
// reproduzir a tela inteira do app.
const VIAGENS = [
  { rota: 'Paranaguá → Arapongas', meta: 'Marcos Ribeiro · Planejada' },
  { rota: 'Paranaguá → Londrina', meta: 'Anderson Prado · Em rota' },
]

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
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #090b0f 0%, #0f1729 50%, #1e1b4b 100%)',
          fontFamily: 'PlusJakartaSans',
          color: '#fff',
          padding: '0 34px 0 64px',
        }}
      >
        {/* ── Esquerda: a mensagem ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 1,
            paddingRight: '48px',
          }}
        >
          {/* Badge — prova social sem identificar o cliente: esta arte aparece
              em toda prévia de link compartilhado, com alcance maior que a
              própria página. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(37, 211, 102, 0.14)',
              border: '1px solid rgba(37, 211, 102, 0.42)',
              borderRadius: '999px',
              padding: '7px 18px',
              fontSize: 13,
              letterSpacing: '0.05em',
              color: '#5ee89b',
              marginBottom: '22px',
            }}
          >
            EM PRODUÇÃO · OPERAÇÃO REAL
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: '18px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Sua frota responde no WhatsApp.
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 21,
              color: '#94a3b8',
              lineHeight: 1.45,
              marginBottom: '30px',
              maxWidth: '520px',
            }}
          >
            Pergunte em português e receba viagens, custos e acertos na hora — sem abrir
            painel, sem planilha, sem app novo.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.34)',
              borderRadius: '14px',
              padding: '15px 26px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: 23, fontWeight: 700, color: '#a5b4fc' }}>
              Implantação sob medida
            </span>
          </div>

          <div style={{ display: 'flex', fontSize: 15, color: '#64748b' }}>
            Diagnóstico · integração · suporte técnico
          </div>
        </div>

        {/* ── Direita: o celular com a conversa ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '470px',
            height: '630px',
          }}
        >
          {/* O aparelho cabe inteiro nos 630px da arte, com respiro em cima e
              embaixo — se estourar, o WhatsApp corta a base na miniatura. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '348px',
              height: '556px',
              borderRadius: '42px',
              background: '#0f0f10',
              border: '5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)',
              padding: '11px',
            }}
          >
            {/* Tela */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                borderRadius: '32px',
                background: '#0b141a',
                overflow: 'hidden',
              }}
            >
              {/* Cabeçalho da conversa */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#111b21',
                  padding: '11px 14px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '19px',
                    background: 'linear-gradient(140deg, #c9a876, #a9855a)',
                    marginRight: '11px',
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#191510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4h13v10H1z" />
                    <path d="M14 8h4l3 3v3h-7z" />
                    <circle cx="5" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: '#e9edef' }}>Fleet.ai</span>
                  <span style={{ fontSize: 14, color: '#8696a0', marginTop: '2px' }}>online</span>
                </div>
              </div>

              {/* Corpo da conversa */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '10px 11px 8px',
                  background: '#0b141a',
                }}
              >
                {/* Pergunta do gestor. `marginTop: auto` cola a conversa na
                    base do corpo, como num chat real — sem isso sobra um vão
                    entre a última resposta e o campo de digitação. */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#005c4b',
                      borderRadius: '10px',
                      borderTopRightRadius: '3px',
                      padding: '8px 11px 6px',
                      maxWidth: '278px',
                    }}
                  >
                    <span style={{ fontSize: 17, color: '#e9edef', lineHeight: 1.35 }}>
                      Preciso das últimas viagens
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontSize: 11.5,
                        color: 'rgba(233,237,239,.55)',
                        marginTop: '3px',
                      }}
                    >
                      11:14
                    </span>
                  </div>
                </div>

                {/* Resposta com as viagens */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#202c33',
                      borderRadius: '10px',
                      borderTopLeftRadius: '3px',
                      padding: '9px 11px 6px',
                      maxWidth: '278px',
                    }}
                  >
                    {VIAGENS.map((v, i) => (
                      <div
                        key={v.rota}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginBottom: i === VIAGENS.length - 1 ? '0' : '9px',
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#e9edef' }}>
                          {v.rota}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            color: 'rgba(233,237,239,.72)',
                            marginTop: '2px',
                            lineHeight: 1.3,
                          }}
                        >
                          {v.meta}
                        </span>
                      </div>
                    ))}
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontSize: 11.5,
                        color: 'rgba(233,237,239,.55)',
                        marginTop: '5px',
                      }}
                    >
                      11:14
                    </span>
                  </div>
                </div>

                {/* Pergunta de faturamento */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#005c4b',
                      borderRadius: '10px',
                      borderTopRightRadius: '3px',
                      padding: '8px 11px 6px',
                      maxWidth: '278px',
                    }}
                  >
                    <span style={{ fontSize: 17, color: '#e9edef', lineHeight: 1.35 }}>
                      Quanto faturei essa semana?
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontSize: 11.5,
                        color: 'rgba(233,237,239,.55)',
                        marginTop: '3px',
                      }}
                    >
                      11:15
                    </span>
                  </div>
                </div>

                {/* Resposta com os números */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#202c33',
                      borderRadius: '10px',
                      borderTopLeftRadius: '3px',
                      padding: '9px 11px 6px',
                      maxWidth: '278px',
                    }}
                  >
                    <span style={{ fontSize: 16.5, fontWeight: 700, color: '#e9edef', lineHeight: 1.35 }}>
                      Faturamento de 11 a 17/08: R$ 48.320,00
                    </span>
                    <span
                      style={{
                        fontSize: 14.5,
                        color: 'rgba(233,237,239,.75)',
                        marginTop: '7px',
                        lineHeight: 1.45,
                      }}
                    >
                      12 viagens concluídas
                    </span>
                    <span style={{ fontSize: 14.5, color: 'rgba(233,237,239,.75)', lineHeight: 1.45 }}>
                      Margem média: 23%
                    </span>
                    <span style={{ fontSize: 14.5, color: 'rgba(233,237,239,.75)', lineHeight: 1.45 }}>
                      Diesel: R$ 11.940,00
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontSize: 11.5,
                        color: 'rgba(233,237,239,.55)',
                        marginTop: '5px',
                      }}
                    >
                      11:15
                    </span>
                  </div>
                </div>
              </div>

              {/* Campo de digitação */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#111b21',
                  padding: '8px 11px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    background: '#2a3942',
                    borderRadius: '999px',
                    padding: '9px 14px',
                    marginRight: '9px',
                  }}
                >
                  <span style={{ fontSize: 15, color: '#8696a0' }}>Mensagem</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '17px',
                    background: '#00a884',
                    flexShrink: 0,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0b141a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>
            </div>
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
