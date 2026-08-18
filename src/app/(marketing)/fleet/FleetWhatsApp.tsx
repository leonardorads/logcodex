'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Demonstração do assistente do Fleet atendendo pelo WhatsApp.
 *
 * Todos os dados são FICTÍCIOS (motoristas, placas, valores) — é uma vitrine
 * do comportamento do agente, não um print de operação real de cliente.
 *
 * O celular é desenhado em CSS puro (o projeto não usa Tailwind nas páginas de
 * marketing); só a entrada das mensagens usa framer-motion, que já é
 * dependência da landing.
 */

interface Viagem {
  rota: string
  motorista: string
  placa: string
  status: string
}

const VIAGENS: Viagem[] = [
  { rota: 'Paranaguá → Arapongas', motorista: 'Marcos Ribeiro', placa: 'RQP2E47', status: 'Planejada' },
  { rota: 'Paranaguá → Londrina', motorista: 'Anderson Prado', placa: 'LFT9J13', status: 'Em rota' },
  { rota: 'Curitiba → Maringá', motorista: 'Rafael Moura', placa: 'BNZ5K80', status: 'Planejada' },
]

type Msg =
  | { id: number; tipo: 'saida'; texto: string; hora: string }
  | { id: number; tipo: 'entrada'; variante: 'viagens'; hora: string }
  | { id: number; tipo: 'entrada'; variante: 'texto'; texto: string; hora: string }

const MENSAGENS: Msg[] = [
  { id: 1, tipo: 'saida', texto: 'Preciso das últimas viagens', hora: '11:14' },
  { id: 2, tipo: 'entrada', variante: 'viagens', hora: '11:14' },
  { id: 3, tipo: 'saida', texto: 'Quanto faturei essa semana?', hora: '11:15' },
  {
    id: 4,
    tipo: 'entrada',
    variante: 'texto',
    texto: 'Faturamento de 11 a 17/08: R$ 48.320,00\n\n12 viagens concluídas\nMargem média: 23%\nDespesa com diesel: R$ 11.940,00',
    hora: '11:15',
  },
  // A partir daqui a conversa deixa de ser consulta e vira TAREFA: é o que
  // separa "painel que responde" de "assistente que faz". Sem isso a demo
  // inteira mostrava só perguntas.
  // Cita a viagem pelo número e pela rota que JÁ apareceram no card acima:
  // pedido genérico ("manda pro Anderson") parece exemplo; com referência
  // parece a operação de verdade.
  { id: 5, tipo: 'saida', texto: 'Envia a ordem de viagem VG-2418 pro Anderson', hora: '11:16' },
  {
    id: 6,
    tipo: 'entrada',
    variante: 'texto',
    texto: 'Ordem VG-2418 enviada ✅\n\nAnderson Prado · LFT9J13\nParanaguá → Londrina · 19/08, 07h\nEntregue no WhatsApp dele às 11:16',
    hora: '11:16',
  },
  // Tarefa que cruza CANAIS: lê o e-mail, entende o anexo e cadastra sozinho.
  // É o pedido que mais parece "funcionário", não "sistema".
  {
    id: 7,
    tipo: 'saida',
    texto: 'Lê os documentos que a Ana mandou por e-mail agora e cadastra os veículos',
    hora: '11:17',
  },
  {
    id: 8,
    tipo: 'entrada',
    variante: 'texto',
    texto: '3 veículos cadastrados ✅\n\nLidos de "CRLVs — frota nova.pdf"\n\nMBB1F29 · Scania R450 · 2022\nJKD7H04 · Volvo FH460 · 2021\nPTR3M85 · Carreta Randon · 2020\n\nRenavam e chassi conferidos.',
    hora: '11:17',
  },
  // A última não tem pergunta antes: o sistema avisa SOZINHO. É a mensagem
  // que mostra automação de verdade — ninguém pediu.
  {
    id: 9,
    tipo: 'entrada',
    variante: 'texto',
    texto: '🔔 Alerta automático\n\nA viagem Curitiba → Maringá está há 3 dias sem acerto.\n\nQuer que eu cobre o Rafael agora?',
    hora: '11:18',
  },
]

// Roteiro da animação: quantas mensagens estão visíveis em cada momento e
// quando o "digitando" aparece. Tempo em ms a partir do início do ciclo.
const ROTEIRO = [
  { t: 700, visiveis: 1, digitando: true },
  { t: 2600, visiveis: 2, digitando: false },
  { t: 4400, visiveis: 3, digitando: true },
  { t: 6300, visiveis: 4, digitando: false },
  { t: 8200, visiveis: 5, digitando: true },
  { t: 10000, visiveis: 6, digitando: false },
  { t: 11800, visiveis: 7, digitando: true },
  // Espera maior antes da resposta: ler o e-mail e cadastrar 3 veículos é
  // trabalho, e responder instantâneo tiraria a credibilidade da cena.
  { t: 14200, visiveis: 8, digitando: false },
  // Pausa maior ainda antes do alerta: ele chega SEM ninguém perguntar, e o
  // silêncio é o que faz perceber que partiu do sistema.
  { t: 16800, visiveis: 9, digitando: false },
]
const DURACAO_CICLO = 22500

const PONTOS = [
  {
    t: 'Consulta pelo celular',
    d: 'O gestor pergunta em português e recebe os dados da operação na hora — sem abrir painel, de qualquer lugar.',
  },
  {
    t: 'Confirmação de acerto pelo motorista',
    d: 'O motorista confirma acertos e envia comprovantes pelo WhatsApp, sem instalar aplicativo nem aprender sistema.',
  },
  {
    t: 'Notificação automática',
    d: 'Viagem sem fechamento, acerto pendente ou despesa fora do padrão avisam sozinhos, no momento em que acontecem.',
  },
  {
    t: 'No canal que já existe',
    d: 'Zero app novo, zero treinamento: funciona no WhatsApp que a equipe já usa o dia inteiro.',
  },
]

function CheckDuplo() {
  return (
    <svg className="wa-check" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
      <path d="M11.045.585 11.988 1.528 5.858 7.658 2.558 4.358 3.502 3.415 5.858 5.772 11.045.585ZM14.345.585 15.288 1.528 9.158 7.658 8.215 6.715 14.345.585Z" />
    </svg>
  )
}

function BolhaViagens() {
  return (
    <div className="wa-viagens">
      {VIAGENS.map((v) => (
        <div key={v.rota + v.placa}>
          <p className="wa-viagem-rota">
            <span aria-hidden="true">🚛</span> {v.rota}
          </p>
          <p className="wa-viagem-meta">
            Motorista: {v.motorista} | Placa: {v.placa} | {v.status}
          </p>
        </div>
      ))}
    </div>
  )
}

export function FleetWhatsApp() {
  const [visiveis, setVisiveis] = useState(0)
  const [digitando, setDigitando] = useState(false)
  const [ciclo, setCiclo] = useState(0)
  const [animar, setAnimar] = useState(true)
  const msgsRef = useRef<HTMLDivElement>(null)

  // Mantém a última mensagem à vista quando a conversa fica mais alta que a
  // tela do celular (acontece nas larguras pequenas, onde o texto quebra mais).
  useEffect(() => {
    const el = msgsRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [visiveis, digitando, ciclo])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Sem animação para quem pediu menos movimento: mostra a conversa inteira.
    // O estado é ajustado dentro de um timer, não no corpo do efeito, para não
    // disparar render em cascata (regra react-hooks/set-state-in-effect) e para
    // manter o SSR e a hidratação renderizando o mesmo estado inicial.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timers.push(setTimeout(() => {
        setAnimar(false)
        setVisiveis(MENSAGENS.length)
      }, 0))
      return () => timers.forEach(clearTimeout)
    }

    for (const passo of ROTEIRO) {
      timers.push(setTimeout(() => {
        setVisiveis(passo.visiveis)
        setDigitando(passo.digitando)
      }, passo.t))
    }
    // Reinicia o ciclo: o ciclo novo remonta as mensagens (key) e o efeito
    // roda de novo, recomeçando a conversa do zero.
    timers.push(setTimeout(() => {
      setVisiveis(0)
      setDigitando(false)
      setCiclo((c) => c + 1)
    }, DURACAO_CICLO))

    return () => timers.forEach(clearTimeout)
  }, [ciclo])

  const lista = MENSAGENS.slice(0, visiveis)

  return (
    <div className="fl-section" id="whatsapp" style={{ borderTop: '1px solid var(--fl-line)', background: 'var(--fl-bg2)' }}>
      <div className="rev" style={{ textAlign: 'center', marginBottom: '48px' }}>
        {/* Glifo oficial do WhatsApp (marca registrada da Meta), no verde da
            marca — usado para identificar o canal, não como endosso. */}
        <div className="wa-marca" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="currentColor" role="img">
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.65 6.35L3 29l6.85-1.6A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.45 18.1c-.27.76-1.58 1.46-2.16 1.52-.55.06-1.07.26-3.6-.75-3.02-1.2-4.96-4.27-5.11-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.47.77-2.2 1.04-2.5.27-.3.6-.37.8-.37l.57.01c.18 0 .43-.07.67.51l.87 2.1c.07.17.12.37.01.58l-.32.54-.48.5c-.15.15-.32.32-.14.63.18.3.8 1.31 1.72 2.12 1.18 1.05 2.18 1.38 2.49 1.53.3.15.47.13.65-.08l.43-.52c.18-.22.36-.18.6-.11l1.92.9c.22.1.37.15.42.24.05.33-.12 1.35-.39 2.11z" />
          </svg>
        </div>
        <span className="fl-eyebrow">Assistente Fleet · WhatsApp</span>
        <h2 className="fl-h2">O mesmo assistente,<br /><em>na palma da mão.</em></h2>
        <p className="fl-lead" style={{ margin: '0 auto', textAlign: 'center' }}>
          Não é só painel no computador. O assistente responde pelo WhatsApp — para o gestor consultar a operação e para o motorista confirmar acerto sem instalar nada. Exemplo com dados fictícios:
        </p>
      </div>

      <div className="wa-layout">
        {/* O reveal fica num wrapper que NÃO re-renderiza: as mensagens mudam
            de estado o tempo todo, e o React reconciliaria a className,
            apagando a classe `in` que o observer adiciona fora do React. */}
        <div className="rev-zoom">
          <div className="wa-phone">
            <span className="wa-btn-side wa-btn-1" aria-hidden="true" />
            <span className="wa-btn-side wa-btn-2" aria-hidden="true" />
            <span className="wa-btn-side wa-btn-3" aria-hidden="true" />
            <span className="wa-btn-side wa-btn-power" aria-hidden="true" />

            <div className="wa-screen">
              {/* Barra de status */}
              <div className="wa-status">
                <span className="wa-status-hora">11:15</span>
                <span className="wa-status-icons" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="16" width="3.5" height="5" rx=".5" /><rect x="7.5" y="12" width="3.5" height="9" rx=".5" /><rect x="13" y="8" width="3.5" height="13" rx=".5" /><rect x="18.5" y="4" width="3.5" height="17" rx=".5" /></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.111 16.404a5.5 5.5 0 0 1 7.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                  <svg viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="1" width="18" height="12" rx="3" /><rect x="3" y="3" width="12" height="8" rx="1.5" fill="currentColor" /><path d="M21 4v6" strokeLinecap="round" /></svg>
                </span>
              </div>

              {/* Cabeçalho da conversa */}
              <div className="wa-head">
                <svg className="wa-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                <span className="wa-avatar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4h13v10H1z" /><path d="M14 8h4l3 3v3h-7z" />
                    <circle cx="5" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                  </svg>
                </span>
                <span className="wa-head-info">
                  <span className="wa-head-nome">Fleet.ai</span>
                  <span className="wa-head-sub">online</span>
                </span>
                <span className="wa-head-acoes" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
                </span>
              </div>

              {/* Conversa */}
              <div className="wa-body">
                <div className="wa-dia">HOJE</div>
                <div className="wa-msgs" ref={msgsRef}>
                  <AnimatePresence mode="sync">
                    {lista.map((m) => (
                      <motion.div
                        key={`${ciclo}-${m.id}`}
                        initial={animar ? { opacity: 0, y: 10, scale: .97 } : false}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: .95 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                        className={`wa-linha ${m.tipo === 'saida' ? 'wa-out' : 'wa-in'}`}
                      >
                        <div className="wa-bolha">
                          {m.tipo === 'entrada' && m.variante === 'viagens'
                            ? <BolhaViagens />
                            : <p className="wa-texto">{m.texto}</p>}
                          <span className="wa-hora">
                            {m.hora}
                            {m.tipo === 'saida' && <CheckDuplo />}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {digitando && (
                      <motion.div
                        key={`${ciclo}-typing`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="wa-linha wa-in"
                      >
                        <div className="wa-bolha wa-digitando">
                          <span className="wa-dot" />
                          <span className="wa-dot" />
                          <span className="wa-dot" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Campo de digitação */}
              <div className="wa-input">
                <svg className="wa-emoji" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" /></svg>
                <span className="wa-campo">
                  Mensagem
                  <span className="wa-campo-icons" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                  </span>
                </span>
                <span className="wa-mic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                </span>
              </div>

              <div className="wa-home-bar" aria-hidden="true"><span /></div>
            </div>
          </div>
        </div>

        <div className="rev-right">
          <ul className="wa-pontos">
            {PONTOS.map((p) => (
              <li key={p.t}>
                <strong>{p.t}</strong>
                {p.d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .wa-layout {
          display: grid; grid-template-columns: minmax(0,320px) 1fr;
          gap: 64px; align-items: center;
        }
        .wa-layout > div { width: 100%; }

        /* ── Aparelho ── */
        .wa-phone {
          position: relative; width: 100%; max-width: 300px; margin: 0 auto;
          /* Era 300/610. A conversa passou de 4 para 7 mensagens e as
             primeiras saíam de vista rápido demais; o aparelho mais alto
             mantém a troca inteira legível sem precisar rolar. */
          aspect-ratio: 300 / 700;
          background: #0f0f10; border-radius: 42px; padding: 10px;
          box-shadow: 0 30px 70px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,118,.14);
        }
        .wa-btn-side { position: absolute; width: 3px; border-radius: 2px; background: #2a2a2c; }
        .wa-btn-1 { left: -3px; top: 88px; height: 26px; }
        .wa-btn-2 { left: -3px; top: 128px; height: 42px; }
        .wa-btn-3 { left: -3px; top: 182px; height: 42px; }
        .wa-btn-power { right: -3px; top: 140px; height: 62px; }

        .wa-screen {
          position: relative; height: 100%; width: 100%; overflow: hidden;
          border-radius: 33px; background: #0b141a;
          display: flex; flex-direction: column;
        }

        .wa-status {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 14px 3px; background: #111b21; color: #fff;
          font-size: 10px; font-weight: 700; flex-shrink: 0;
        }
        .wa-status-icons { display: inline-flex; align-items: center; gap: 5px; }
        .wa-status-icons svg { width: 11px; height: 11px; }
        .wa-status-icons svg:last-child { width: 16px; height: 10px; }

        .wa-marca {
          width: 88px; height: 88px; margin: 0 auto 20px;
          display: grid; place-items: center;
          border-radius: 24px;
          color: #25d366;
          background: rgba(37, 211, 102, 0.10);
          border: 1px solid rgba(37, 211, 102, 0.28);
          box-shadow: 0 14px 44px -14px rgba(37, 211, 102, 0.42);
        }
        .wa-marca svg { width: 52px; height: 52px; display: block; }
        @media (max-width: 640px) {
          .wa-marca { width: 70px; height: 70px; border-radius: 20px; }
          .wa-marca svg { width: 42px; height: 42px; }
        }

        .wa-head {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 10px 8px; background: #111b21; color: #e9edef; flex-shrink: 0;
        }
        .wa-back { width: 15px; height: 15px; flex-shrink: 0; opacity: .9; }
        .wa-avatar {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(140deg, #c9a876, #a9855a);
          color: #191510;
        }
        .wa-avatar svg { width: 16px; height: 16px; }
        .wa-head-info { display: flex; flex-direction: column; min-width: 0; margin-right: auto; }
        .wa-head-nome { font-size: 12.5px; font-weight: 600; line-height: 1.2; color: #e9edef; }
        .wa-head-sub { font-size: 9.5px; color: #8696a0; line-height: 1.2; margin-top: 1px; }
        .wa-head-acoes { display: inline-flex; align-items: center; gap: 11px; color: #aebac1; }
        .wa-head-acoes svg { width: 14px; height: 14px; }

        .wa-body {
          flex: 1; min-height: 0; padding: 8px 8px 4px;
          display: flex; flex-direction: column; overflow: hidden;
          /* Textura sutil do fundo do WhatsApp, sem imagem externa. */
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,.022) 0 2px, transparent 2px),
            radial-gradient(circle at 62% 58%, rgba(255,255,255,.02) 0 2px, transparent 2px),
            radial-gradient(circle at 84% 12%, rgba(255,255,255,.018) 0 2px, transparent 2px),
            #0b141a;
          background-size: 90px 90px, 120px 120px, 70px 70px, auto;
        }
        .wa-dia {
          align-self: center; flex-shrink: 0;
          background: rgba(28,42,51,.92); color: #8696a0;
          font-size: 8.5px; font-weight: 600; letter-spacing: .06em;
          padding: 3px 9px; border-radius: 7px; margin-bottom: 7px;
        }
        .wa-msgs {
          display: flex; flex-direction: column; gap: 5px;
          flex: 1; min-height: 0; overflow-y: auto;
          scrollbar-width: none;
        }
        .wa-msgs::-webkit-scrollbar { display: none; }
        /* Empurra a conversa para baixo quando ela é curta. Não uso
           justify-content:flex-end porque, quando o conteúdo passa da altura,
           ele corta o topo de forma inacessível — com margin-top:auto a área
           rola normalmente, como num chat real. */
        .wa-msgs > *:first-child { margin-top: auto; }
        .wa-linha { display: flex; }
        .wa-linha.wa-out { justify-content: flex-end; }
        .wa-linha.wa-in { justify-content: flex-start; }
        .wa-bolha {
          position: relative; max-width: 84%;
          padding: 5px 8px 4px; border-radius: 8px;
          font-size: 10.5px; line-height: 1.4; color: #e9edef;
        }
        .wa-out .wa-bolha { background: #005c4b; border-top-right-radius: 2px; }
        .wa-in .wa-bolha { background: #202c33; border-top-left-radius: 2px; }
        .wa-texto { white-space: pre-line; margin: 0; }
        .wa-hora {
          display: flex; align-items: center; justify-content: flex-end; gap: 3px;
          font-size: 8px; color: rgba(233,237,239,.55); margin-top: 2px;
        }
        .wa-check { width: 11px; height: 8px; color: #53bdeb; flex-shrink: 0; }

        .wa-viagens { display: flex; flex-direction: column; gap: 7px; }
        .wa-viagem-rota { font-weight: 700; margin: 0 0 1px; font-size: 10.5px; }
        .wa-viagem-meta { margin: 0; font-size: 9.5px; color: rgba(233,237,239,.72); line-height: 1.35; }

        .wa-digitando { display: flex; align-items: center; gap: 3px; padding: 8px 10px; }
        .wa-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #8696a0;
          animation: wa-blink 1.2s infinite ease-in-out;
        }
        .wa-dot:nth-child(2) { animation-delay: .18s; }
        .wa-dot:nth-child(3) { animation-delay: .36s; }
        @keyframes wa-blink { 0%,60%,100% { opacity: .35; transform: translateY(0) } 30% { opacity: 1; transform: translateY(-2px) } }

        .wa-input {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
          padding: 7px 8px; background: #111b21;
        }
        .wa-emoji { width: 16px; height: 16px; color: #8696a0; flex-shrink: 0; }
        .wa-campo {
          flex: 1; display: flex; align-items: center; justify-content: space-between;
          background: #2a3942; border-radius: 999px;
          padding: 6px 10px; font-size: 10.5px; color: #8696a0;
        }
        .wa-campo-icons { display: inline-flex; gap: 7px; }
        .wa-campo-icons svg { width: 13px; height: 13px; }
        .wa-mic {
          width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%;
          background: #00a884; color: #0b141a;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .wa-mic svg { width: 14px; height: 14px; }
        .wa-home-bar { display: flex; justify-content: center; padding: 3px 0 6px; background: #111b21; flex-shrink: 0; }
        .wa-home-bar span { width: 84px; height: 3px; border-radius: 999px; background: rgba(255,255,255,.22); }

        /* ── Lista de pontos ── */
        .wa-pontos { display: flex; flex-direction: column; gap: 22px; }
        .wa-pontos li {
          list-style: none; padding-left: 18px; position: relative;
          font-size: 14px; color: var(--fl-ink2); line-height: 1.65;
        }
        .wa-pontos li::before {
          content: ''; position: absolute; left: 0; top: 7px;
          width: 7px; height: 7px; border-radius: 50%; background: var(--fl-accent);
          box-shadow: 0 0 10px rgba(201,168,118,.5);
        }
        .wa-pontos strong {
          display: block; font-size: 15.5px; font-weight: 700;
          color: var(--fl-ink); margin-bottom: 5px; letter-spacing: -.015em;
        }

        @media (max-width: 900px) {
          .wa-layout { grid-template-columns: 1fr; gap: 44px; }
          .wa-phone { max-width: 280px; }
        }
        @media (max-width: 600px) {
          .wa-phone { max-width: 250px; }
          .wa-pontos strong { font-size: 14.5px; }
          .wa-pontos li { font-size: 13.5px; }
        }
      `}</style>
    </div>
  )
}
