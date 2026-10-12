'use client'

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Cursor, MolduraCelular, Status } from './Aparelho'
import { Icone } from './Icone'
import type { NomeIcone } from './icones'
import { Numero, TextoDigitado, useCena, type Marca } from './useRoteiro'

// Cena do topo (v2, pedido do Leo em 12/10): dois aparelhos contam a mesma
// história ao mesmo tempo, cada um do seu lado.
// - CELULAR DA CLIENTE: procura no Google → entra no site → agenda pelo
//   WhatsApp com a IA → adiciona à agenda → abre o app Calendário e vê o horário.
// - PAINEL DO NEGÓCIO (CRM com menu): a conversa chega, o horário cai na agenda
//   da semana e, no fim, a ficha da cliente abre com os detalhes.
// O negócio (Studio Equilíbrio) e a cliente são FICTÍCIOS e a cena é marcada
// como exemplo; sem nota, avaliação, preço ou número de resultado inventado.
// Roda em looping (useCena) e só com a cena à vista.
//
// Tudo é desenhado num "palco" de tamanho fixo (640x560 no computador, 380x620
// no celular) e ESCALADO para caber na coluna: a cena não se desmonta em
// larguras intermediárias.

const BUSCA = 'fisioterapia perto de mim'
const MSG_1 = 'Olá! Vim pelo site e quero agendar fisioterapia.'
const MSG_2 = 'Quinta à tarde, tem?'

const ROTEIRO: Marca[] = [
  { em: 500, p: 1 }, // digitando a busca
  { em: 2700, p: 2 }, // resultados
  { em: 3800, p: 3 }, // toque no resultado
  { em: 4400, p: 4 }, // site aberto
  { em: 5500, p: 5 }, // o site rola e mostra os horários
  { em: 6700, p: 6 }, // toque em "Agendar pelo WhatsApp"
  { em: 7400, p: 7 }, // WhatsApp aberto com a mensagem do site no campo
  { em: 8300, p: 8 }, // toque em enviar → o painel recebe a conversa
  { em: 8900, p: 9 }, // IA digitando
  { em: 10100, p: 10 }, // IA pergunta o dia
  { em: 10800, p: 11 }, // cliente digita
  { em: 12200, p: 12 }, // enviada
  { em: 12800, p: 13 }, // IA digitando
  { em: 14100, p: 14 }, // IA oferece 15h ou 17h (botões)
  { em: 15300, p: 15 }, // toque em "17h"
  { em: 15900, p: 16 }, // "17h" sai e a IA digita
  { em: 17200, p: 17 }, // IA confirma + convite de agenda → o horário cai no painel
  { em: 18600, p: 18 }, // toque em "Adicionar à agenda"
  { em: 19200, p: 19 }, // aviso no topo do celular
  { em: 20300, p: 20 }, // volta para a tela inicial
  { em: 21300, p: 21 }, // toque no Calendário
  { em: 21900, p: 22 }, // Calendário aberto na quinta
  { em: 23100, p: 23 }, // lembrete aparece no evento
  { em: 24300, p: 24 }, // foco no painel
  { em: 25200, p: 25 }, // cursor vai até a Marina
  { em: 26100, p: 26 }, // clique: a ficha abre
  { em: 27100, p: 27 }, // detalhes completos
  { em: 30600, p: 28 }, // tudo assenta e some, para recomeçar
]
const DURACAO = 31400
const ESTATICO = 27

const ETAPAS = ['Achou no Google', 'Agendou no WhatsApp', 'Lembrete no celular', 'Organizado no painel']
// início e fim (ms) de cada etapa, para a barra encher no tempo certo
const TEMPO_ETAPA = [
  [0, 7400],
  [7400, 20300],
  [20300, 24300],
  [24300, 30600],
]

type Tela = 'google' | 'site' | 'zap' | 'inicio' | 'agenda'

// onde o dedo toca, por passo (em % da tela do celular)
const TOQUES: Record<number, [number, number]> = {
  3: [46, 42],
  6: [50, 68],
  8: [89, 94],
  12: [89, 94],
  15: [64, 86],
  18: [45, 83],
  21: [38.5, 26],
}

export function Mesa() {
  const { ref, p, rodada } = useCena(ROTEIRO, DURACAO, ESTATICO)
  const vista = useRef<HTMLDivElement>(null)
  const [medida, setMedida] = useState<{ modo: 'pc' | 'cel'; escala: number }>({ modo: 'pc', escala: 0.9 })

  useLayoutEffect(() => {
    const el = vista.current
    if (!el) return
    const medir = () => {
      const w = el.clientWidth
      const modo = w < 520 ? 'cel' : 'pc'
      setMedida({ modo, escala: w / (modo === 'pc' ? 640 : 380) })
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const tela: Tela = p < 4 ? 'google' : p < 7 ? 'site' : p < 20 ? 'zap' : p < 22 ? 'inicio' : 'agenda'
  const foco = p >= 24 && p < 28 ? 'painel' : 'cel'
  const etapa = p < 7 ? 0 : p < 20 ? 1 : p < 24 ? 2 : 3
  const altura = medida.modo === 'pc' ? 560 : 620
  const estatico = rodada === 0 && p === ESTATICO

  return (
    <div className="hg-mesa" ref={ref} data-foco={foco} data-modo={medida.modo} data-p={p}>
      <span className="hg-mesa__selo">Exemplo ilustrativo</span>
      <div className="hg-mesa__vista" ref={vista} style={{ height: altura * medida.escala }}>
        <div
          className={`hg-mesa__palco ${p === 28 ? 'hg-mesa__palco--fim' : ''}`}
          style={{ '--escala': medida.escala } as CSSProperties}
          role="img"
          aria-label="Exemplo ilustrativo: uma cliente procura fisioterapia no Google pelo celular, entra no site do Studio Equilíbrio, agenda pelo WhatsApp com a IA e vê o horário no app de calendário. Ao mesmo tempo, o painel do negócio recebe a conversa, o horário entra na agenda da semana e a ficha da cliente abre com os detalhes."
        >
          <span className="hg-legenda hg-legenda--cel" aria-hidden="true"><Icone nome="celular" /> Celular da cliente</span>
          <span className="hg-legenda hg-legenda--painel" aria-hidden="true"><Icone nome="painel" /> Painel do seu negócio</span>
          <Painel p={p} rodada={rodada} estatico={estatico} />
          <Celular p={p} tela={tela} rodada={rodada} />
        </div>
      </div>

      <ol className="hg-mesa__etapas" aria-hidden="true">
        {ETAPAS.map((t, i) => {
          const estado = i === etapa && p < 28 && !estatico ? 'ativa' : i < etapa || estatico || p === 28 ? 'feita' : ''
          const [de, ate] = TEMPO_ETAPA[i]
          return (
            <li key={`${t}-${rodada}`} className={estado ? `hg-etapa--${estado}` : ''} style={{ '--dur': `${(ate - de) / 1000}s` } as CSSProperties}>
              <i />
              <span>{i + 1}</span> {t}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// Celular (mesma moldura do celular da página do Fleet: aro preto, botões
// laterais, barra de status, cabeçalho e campo do WhatsApp, barra inicial)
// ════════════════════════════════════════════════════════════════════

function CheckDuplo() {
  return (
    <svg className="hg-wa-check" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
      <path d="M11.045.585 11.988 1.528 5.858 7.658 2.558 4.358 3.502 3.415 5.858 5.772 11.045.585ZM14.345.585 15.288 1.528 9.158 7.658 8.215 6.715 14.345.585Z" />
    </svg>
  )
}

function Digitando() {
  return (
    <div className="hg-wa-linha hg-wa-in">
      <div className="hg-wa-bolha hg-wa-digitando"><span className="hg-wa-ia"><Icone nome="robo" /> IA</span><i /><i /><i /></div>
    </div>
  )
}

function Msg({ eu, hora, children, extra }: { eu?: boolean; hora: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <div className={`hg-wa-linha ${eu ? 'hg-wa-out' : 'hg-wa-in'}`}>
      <div className="hg-wa-bolha">
        {/* cada resposta do negócio leva o selo da IA (pedido do Leo, 12/10) */}
        {!eu && <span className="hg-wa-ia"><Icone nome="robo" /> IA</span>}
        <p>{children}</p>
        <span className="hg-wa-hora">{hora}{eu && <CheckDuplo />}</span>
        {extra}
      </div>
    </div>
  )
}

const APPS: { nome: string; ic: NomeIcone; cor: string; id?: string }[] = [
  { nome: 'Telefone', ic: 'celular', cor: '#34c759' },
  { nome: 'Calendário', ic: 'agenda', cor: '#ffffff', id: 'agenda' },
  { nome: 'Mapas', ic: 'mapa', cor: '#4a8cff' },
  { nome: 'Relógio', ic: 'relogio', cor: '#1c1c1e' },
  { nome: 'Navegador', ic: 'site', cor: '#2f6bff' },
  { nome: 'Fotos', ic: 'brilho', cor: '#ff9f43' },
  { nome: 'Banco', ic: 'cartao', cor: '#8c5cff' },
  { nome: 'Notas', ic: 'caneta', cor: '#ffd84d' },
]

function Celular({ p, tela, rodada }: { p: number; tela: Tela; rodada: number }) {
  const toque = TOQUES[p]
  const zapHora = (n: number) => `14:${String(30 + n).padStart(2, '0')}`
  const campo = p === 7 ? MSG_1 : p === 11 ? 'digitando' : ''

  return (
    <MolduraCelular>
      {/* ── Google ─────────────────────────── */}
      <div className={`hg-app hg-app--google ${tela === 'google' ? 'hg-app--on' : ''}`}>
        <Status claro />
        <div className="hg-gg">
          <div className="hg-gg__marca"><Icone nome="busca" /> Busca</div>
          <div className="hg-gg__caixa">
            <Icone nome="busca" />
            <span>
              {p >= 1 ? <TextoDigitado key={rodada} texto={BUSCA} ativo={p === 1} cheio={p >= 2} passoMs={70} /> : <em>Pesquisar</em>}
              {p < 2 && <i className="hg-caret" />}
            </span>
          </div>
          <div className="hg-gg__abas"><b>Tudo</b><span>Mapas</span><span>Imagens</span><span>Notícias</span></div>
          {p >= 2 && (
            <div className="hg-gg__resultados">
              <div className={`hg-gg__res hg-gg__res--1 ${p >= 3 ? 'hg-gg__res--alvo' : ''}`}>
                <span className="hg-gg__site"><i>SE</i><span><b>Studio Equilíbrio</b><small>studioequilibrio.com.br</small></span></span>
                <strong>Pilates e Fisioterapia com hora marcada</strong>
                <span>Fisioterapia, pilates e RPG. Agende pelo WhatsApp em poucos minutos.</span>
                <span className="hg-gg__links"><em>Agendar</em><em>Horários</em><em>Como chegar</em></span>
              </div>
              <div className="hg-gg__res hg-gg__res--vazio"><i /><b /><span /><span /></div>
              <div className="hg-gg__res hg-gg__res--vazio"><i /><b /><span /></div>
            </div>
          )}
        </div>
      </div>

      {/* ── Site do negócio ────────────────── */}
      <div className={`hg-app hg-app--site ${tela === 'site' ? 'hg-app--on' : ''}`}>
        <Status claro />
        <div className="hg-nav-cel"><Icone nome="site" /> studioequilibrio.com.br</div>
        <div className="hg-st-vista">
          <div className={`hg-st ${p >= 5 ? 'hg-st--rolou' : ''}`}>
            <div className="hg-st__topo"><b>Studio Equilíbrio</b><Icone nome="conversa" /></div>
            <div className="hg-st__capa">
              <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="300" height="150" fill="#ebe4f8" />
                <circle cx="236" cy="40" r="24" fill="#f6c58f" />
                <path d="M0 110 C60 84 120 118 180 98 S270 84 300 94 V150 H0Z" fill="#b9a6e8" />
                <path d="M0 126 C70 108 140 132 210 116 S280 112 300 116 V150 H0Z" fill="#8d74d6" />
              </svg>
            </div>
            <div className="hg-st__corpo">
              <small>Paranaguá · PR</small>
              <h4>Movimento sem dor, no seu ritmo.</h4>
              <p>Fisioterapia, pilates e RPG com hora marcada.</p>
              <span className="hg-st__chips"><em>Fisioterapia</em><em>Pilates</em><em>RPG</em></span>
              <span className={`hg-st__btn ${p >= 6 ? 'hg-alvo' : ''}`}><Icone nome="conversa" /> Agendar pelo WhatsApp</span>
              <div className="hg-st__horas">
                <Icone nome="relogio" />
                <span><b>Horários</b><small>Seg a sex, 7h às 20h · Sáb, 8h às 12h</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp ───────────────────────── */}
      <div className={`hg-app hg-app--zap ${tela === 'zap' ? 'hg-app--on' : ''} ${tela === 'inicio' || tela === 'agenda' ? 'hg-app--fecha' : ''}`}>
        <Status />
        <div className="hg-wa-head">
          <svg className="hg-wa-voltar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <span className="hg-wa-av">SE</span>
          <span className="hg-wa-info">
            <b>Studio Equilíbrio</b>
            <small>{p === 9 || p === 13 || p === 16 ? 'IA digitando…' : 'online · atende com IA'}</small>
          </span>
          <span className="hg-wa-acoes" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
          </span>
        </div>
        <div className="hg-wa-corpo">
          <div className="hg-wa-msgs">
            <span className="hg-wa-dia">HOJE</span>
            {p >= 8 && <Msg eu hora={zapHora(1)}>{MSG_1}</Msg>}
            {p === 9 && <Digitando />}
            {p >= 10 && <Msg hora={zapHora(1)}>Oi, Marina! Aqui é o atendimento do Studio Equilíbrio. Qual dia fica melhor para você?</Msg>}
            {p >= 12 && <Msg eu hora={zapHora(2)}>{MSG_2}</Msg>}
            {p === 13 && <Digitando />}
            {p >= 14 && (
              <Msg
                hora={zapHora(2)}
                extra={
                  <span className="hg-wa-opcoes">
                    <em>15h</em>
                    <em className={p >= 15 ? 'hg-wa-opcao--sim' : ''}>17h</em>
                  </span>
                }
              >
                Tem sim! Na quinta, 16/10, temos <b>15h</b> ou <b>17h</b>. Qual você prefere?
              </Msg>
            )}
            {p >= 16 && <Msg eu hora={zapHora(3)}>17h</Msg>}
            {p === 16 && <Digitando />}
            {p >= 17 && (
              <Msg
                hora={zapHora(3)}
                extra={
                  <span className={`hg-wa-convite ${p >= 19 ? 'hg-wa-convite--ok' : ''}`}>
                    <span className="hg-wa-convite__ic"><Icone nome="agenda" /></span>
                    <span><b>Fisioterapia · Studio Equilíbrio</b><small>Qui, 16 out · 17:00 às 18:00</small></span>
                    <em>{p >= 19 ? <><Icone nome="check" /> Adicionado</> : 'Adicionar à agenda'}</em>
                  </span>
                }
              >
                Prontinho, Marina! Fisioterapia na quinta, 16/10, às 17h. Te mando um lembrete na véspera.
              </Msg>
            )}
          </div>
        </div>
        <div className="hg-wa-campo">
          <span className="hg-wa-campo__txt">
            {campo === 'digitando' ? (
              <TextoDigitado key={`m2-${rodada}`} texto={MSG_2} ativo={p === 11} cheio={false} passoMs={65} />
            ) : campo ? (
              <span>{campo}</span>
            ) : (
              <em>Mensagem</em>
            )}
          </span>
          <span className={`hg-wa-enviar ${campo ? 'hg-wa-enviar--on' : ''}`} aria-hidden="true">
            {campo ? <Icone nome="enviar" /> : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
            )}
          </span>
        </div>
      </div>

      {/* ── Tela inicial ───────────────────── */}
      <div className={`hg-app hg-app--inicio ${tela === 'inicio' ? 'hg-app--on' : ''} ${tela === 'agenda' ? 'hg-app--atras' : ''}`}>
        <Status />
        <div className="hg-home">
          <div className="hg-home__hora"><b>14:33</b><small>terça-feira, 14 de outubro</small></div>
          <div className="hg-home__apps">
            {APPS.map((a, i) => (
              <span key={a.nome} className={`hg-home__app ${a.id === 'agenda' && p >= 21 ? 'hg-home__app--toque' : ''}`} style={{ '--i': i } as CSSProperties}>
                {a.id === 'agenda' ? (
                  <i className="hg-home__ic hg-home__ic--agenda"><small>TER</small><b>14</b></i>
                ) : (
                  <i className="hg-home__ic" style={{ background: a.cor }}><Icone nome={a.ic} /></i>
                )}
                <small>{a.nome}</small>
              </span>
            ))}
          </div>
          <div className="hg-home__doca">
            <i className="hg-home__ic" style={{ background: '#25d366' }}><Icone nome="conversa" /></i>
            <i className="hg-home__ic" style={{ background: '#2f6bff' }}><Icone nome="site" /></i>
            <i className="hg-home__ic" style={{ background: '#1c1c1e' }}><Icone nome="camadas" /></i>
            <i className="hg-home__ic" style={{ background: '#ff453a' }}><Icone nome="brilho" /></i>
          </div>
        </div>
      </div>

      {/* ── Calendário ─────────────────────── */}
      <div className={`hg-app hg-app--agenda ${tela === 'agenda' ? 'hg-app--on' : ''}`}>
        <Status claro />
        <div className="hg-cal">
          <div className="hg-cal__topo">
            <span><Icone nome="seta" /> Outubro</span>
            <span className="hg-cal__acoes"><Icone nome="busca" /><b>+</b></span>
          </div>
          <div className="hg-cal__semana">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <span key={i} className={i === 3 ? 'hg-cal__dia--sel' : i === 1 ? 'hg-cal__dia--hoje' : ''}>
                <small>{d}</small>
                <b>{13 + i}</b>
              </span>
            ))}
          </div>
          <div className="hg-cal__titulo">Quinta-feira, 16 de outubro</div>
          <div className="hg-cal__grade">
            {['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((h) => (
              <div key={h} className="hg-cal__hora"><small>{h}</small><i /></div>
            ))}
            <div className={`hg-cal__evento ${p >= 22 ? 'hg-cal__evento--on' : ''}`}>
              <b>Fisioterapia</b>
              <small>Studio Equilíbrio · 17:00 às 18:00</small>
            </div>
            {p >= 23 && (
              <div className="hg-cal__detalhe">
                <span><Icone nome="mapa" /> Centro, Paranaguá</span>
                <span className="hg-cal__lembrete"><Icone nome="relogio" /> Lembrete: 1 dia antes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* aviso que desce do topo ao adicionar o evento */}
      <div className={`hg-aviso ${p === 19 ? 'hg-aviso--on' : ''}`}>
        <i className="hg-home__ic hg-home__ic--agenda hg-aviso__ic"><small>TER</small><b>14</b></i>
        <span><b>Calendário</b><small>Fisioterapia adicionada · Qui, 17:00</small></span>
      </div>

      {toque && <span key={`${p}-${rodada}`} className="hg-toque" style={{ left: `${toque[0]}%`, top: `${toque[1]}%` }} />}
    </MolduraCelular>
  )
}

// ════════════════════════════════════════════════════════════════════
// Painel do negócio (CRM sob medida): menu lateral, números da semana, agenda
// por dia e a ficha da cliente
// ════════════════════════════════════════════════════════════════════

const MENU: { nome: string; ic: NomeIcone; ativo?: boolean; badge?: boolean }[] = [
  { nome: 'Início', ic: 'painel' },
  { nome: 'Agenda', ic: 'agenda', ativo: true },
  { nome: 'Conversas', ic: 'conversas', badge: true },
  { nome: 'Clientes', ic: 'pessoas' },
  { nome: 'Financeiro', ic: 'cartao' },
  { nome: 'Relatórios', ic: 'grafico' },
]

type Hora = { h: string; nome: string; serv: string; cor: 'a' | 'b' | 'c' }
const DIAS: { dia: string; n: number; itens: Hora[] }[] = [
  { dia: 'Seg', n: 13, itens: [{ h: '8h', nome: 'Beatriz', serv: 'RPG', cor: 'b' }, { h: '10h', nome: 'Rafael', serv: 'Pilates', cor: 'a' }, { h: '16h', nome: 'Sônia', serv: 'Fisio', cor: 'c' }] },
  { dia: 'Ter', n: 14, itens: [{ h: '9h', nome: 'Carlos', serv: 'Pilates', cor: 'a' }, { h: '15h', nome: 'Lúcia', serv: 'Fisio', cor: 'c' }] },
  { dia: 'Qua', n: 15, itens: [{ h: '7h', nome: 'Pedro', serv: 'Pilates', cor: 'a' }, { h: '14h', nome: 'Ana', serv: 'Avaliação', cor: 'b' }] },
  { dia: 'Qui', n: 16, itens: [{ h: '10h', nome: 'Júlia', serv: 'RPG', cor: 'b' }, { h: '15h', nome: 'Marcos', serv: 'Fisio', cor: 'c' }] },
  { dia: 'Sex', n: 17, itens: [{ h: '8h', nome: 'João', serv: 'Pilates', cor: 'a' }, { h: '11h', nome: 'Clara', serv: 'Fisio', cor: 'c' }, { h: '17h', nome: 'Hugo', serv: 'RPG', cor: 'b' }] },
]

function Painel({ p, rodada, estatico }: { p: number; rodada: number; estatico: boolean }) {
  const chegou = p >= 8
  const marcou = p >= 17
  const ficha = p >= 26 && p < 28
  const fichaCompleta = p >= 27 && p < 28

  return (
    <div className="hg-crm">
      <div className="hg-crm__barra">
        <i /><i /><i />
        <span>painel.studioequilibrio.com.br/agenda</span>
      </div>
      <div className="hg-crm__app">
        <aside className="hg-crm__menu">
          <div className="hg-crm__marca"><i>SE</i><span><b>Studio Equilíbrio</b><small>Painel</small></span></div>
          <nav>
            {MENU.map((m) => (
              <span key={m.nome} className={`hg-crm__item ${m.ativo ? 'hg-crm__item--ativo' : ''}`}>
                <Icone nome={m.ic} />
                <span>{m.nome}</span>
                {m.badge && <em key={`${chegou}-${rodada}`} className={chegou ? 'hg-crm__badge--novo' : ''}>{chegou ? 4 : 3}</em>}
              </span>
            ))}
          </nav>
          <div className="hg-crm__eu"><i>R</i><span><b>Recepção</b><small>online</small></span></div>
        </aside>

        <div className="hg-crm__main">
          <div className="hg-crm__topo">
            <div>
              <b>Agenda da semana</b>
              <small>13 a 17 de outubro</small>
            </div>
            <span className="hg-crm__busca"><Icone nome="busca" /> Buscar cliente</span>
            <span className={`hg-crm__sino ${chegou ? 'hg-crm__sino--on' : ''}`} key={`s-${chegou}-${rodada}`}>
              <Icone nome="conversa" />
              {chegou && <i />}
            </span>
          </div>

          <div className="hg-crm__kpis">
            <div className="hg-crm__kpi">
              <small>Agendamentos</small>
              {estatico ? <b>13</b> : <Numero key={`a-${rodada}`} valor={marcou ? 13 : 12} />}
              <span>na semana</span>
            </div>
            <div className="hg-crm__kpi">
              <small>Conversas hoje</small>
              {estatico ? <b>9</b> : <Numero key={`c-${rodada}`} valor={chegou ? 9 : 8} />}
              <span>no WhatsApp</span>
            </div>
            <div className="hg-crm__kpi">
              <small>Clientes novos</small>
              {estatico ? <b>4</b> : <Numero key={`n-${rodada}`} valor={marcou ? 4 : 3} />}
              <span>este mês</span>
            </div>
          </div>

          <div className="hg-crm__dias">
            {DIAS.map((d) => (
              <div key={d.dia} className={`hg-crm__dia ${d.n === 16 && marcou ? 'hg-crm__dia--novo' : ''}`}>
                <span className="hg-crm__dia-nome"><small>{d.dia}</small> <b>{d.n}</b></span>
                {d.itens.map((it) => (
                  <span key={it.nome} className={`hg-crm__hora hg-crm__hora--${it.cor}`}>
                    <small>{it.h} {it.serv}</small>
                    <b>{it.nome}</b>
                  </span>
                ))}
                {d.n === 16 && marcou && (
                  <span className={`hg-crm__hora hg-crm__hora--marina ${p >= 26 ? 'hg-crm__hora--sel' : ''}`}>
                    <small>17h Fisio</small>
                    <b>Marina</b>
                    <em>Novo</em>
                  </span>
                )}
                {/* o cursor mora na coluna de quinta: parte de fora e vai até a Marina */}
                {d.n === 16 && (
                  <Cursor className={`hg-crm__cursor ${p >= 25 && p < 28 ? 'hg-crm__cursor--on' : ''} ${p === 26 ? 'hg-cursor--clica' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* avisos do painel (canto de baixo, à esquerda: fora do alcance do celular) */}
          <div className="hg-crm__avisos">
            {p >= 8 && p < 17 && (
              <span className="hg-crm__aviso" key="a1">
                <i className="hg-crm__aviso-ic hg-crm__aviso-ic--zap"><Icone nome="robo" /></i>
                <span><b>Nova conversa no WhatsApp</b><small>Marina S. · a IA está atendendo</small></span>
              </span>
            )}
            {p >= 17 && p < 24 && (
              <span className="hg-crm__aviso" key="a2">
                <i className="hg-crm__aviso-ic"><Icone nome="agenda" /></i>
                <span><b>Novo agendamento</b><small>Marina S. · Qui, 16/10 às 17h</small></span>
              </span>
            )}
          </div>

          {/* ficha da cliente */}
          <div className={`hg-crm__ficha ${ficha ? 'hg-crm__ficha--on' : ''} ${fichaCompleta ? 'hg-crm__ficha--cheia' : ''}`}>
            <div className="hg-crm__ficha-topo">
              <i>MS</i>
              <span><b>Marina S.</b><small>Cliente nova</small></span>
              <em>×</em>
            </div>
            <dl>
              <div><dt>Serviço</dt><dd>Fisioterapia</dd></div>
              <div><dt>Quando</dt><dd>Qui, 16/10 · 17h às 18h</dd></div>
              <div><dt>Origem</dt><dd><span className="hg-crm__tag hg-crm__tag--zap">WhatsApp · IA</span></dd></div>
              <div><dt>Veio de</dt><dd>Busca no Google → site</dd></div>
              <div><dt>Lembrete</dt><dd>Qua, 15/10 às 17h</dd></div>
            </dl>
            <span className="hg-crm__ficha-btn"><Icone nome="conversa" /> Ver conversa</span>
          </div>

        </div>
      </div>
    </div>
  )
}
