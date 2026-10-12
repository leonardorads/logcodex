'use client'

import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Cursor, MolduraCelular, Status } from './Aparelho'
import { Icone } from './Icone'
import type { NomeIcone } from './icones'
import { TextoDigitado, useCena, type Marca } from './useRoteiro'

// Demonstração do Fleet (v2, pedido do Leo em 12/10: "mais fiel ao sistema real
// ... o usuário acessando o menu, realizando cadastro manual e depois pedindo
// para o suporte da IA cadastrar os motoristas que estão numa planilha ... e por
// fim emitindo relatório").
//
// Fiel ao sistema de verdade (projetos/logcodex-saas/fleet): mesmo menu lateral
// (grupos, ícones e ordem do layout), tela de Motoristas com "Novo Motorista" e
// os campos do formulário, o "Assistente Fleet" no canto (cores, "Processando...",
// confirmação ANTES de gravar e o selo "Motorista cadastrado!"), e a Central de
// relatórios com a aba Fluxo Mensal e o "Exportar PDF" (o PDF tem o mesmo
// cabeçalho do que o sistema gera).
// Sobre a planilha: o assistente real lê TEXTO (e foto de CNH), não arquivo; por
// isso a cena mostra as linhas sendo copiadas da planilha e coladas no chat, que
// é o que o sistema faz hoje. Relatório em PDF sai pela tela de relatórios, não
// pelo assistente (ele mesmo diz que não emite arquivo).
//
// Transportadora, pessoas e números são FICTÍCIOS e batem entre si (setembro:
// faturamento 86.420 − custo 52.180 = resultado 34.240, margem 39,6%).
// Roda em looping (useCena), só com a cena à vista.

const ROTEIRO: Marca[] = [
  { em: 1800, p: 1 }, // cursor → Cadastros (celular: toque no menu)
  { em: 2600, p: 2 }, // clique: o grupo abre
  { em: 3300, p: 3 }, // cursor → Motoristas
  { em: 4000, p: 4 }, // clique: tela de Motoristas
  { em: 5200, p: 5 }, // cursor → Novo Motorista
  { em: 5900, p: 6 }, // clique: janela "Novo Motorista"
  { em: 6600, p: 7 }, // digita o nome
  { em: 8300, p: 8 }, // digita o CPF
  { em: 9400, p: 9 }, // CNH e categoria
  { em: 10200, p: 10 }, // vencimento e comissão
  { em: 11000, p: 11 }, // cursor → Salvar
  { em: 11700, p: 12 }, // clique: "Salvando..."
  { em: 12400, p: 13 }, // a janela fecha e o Paulo entra na lista
  { em: 14000, p: 14 }, // cursor → botão do assistente
  { em: 14700, p: 15 }, // clique: o assistente abre
  { em: 15700, p: 16 }, // a planilha aparece
  { em: 16500, p: 17 }, // as linhas são selecionadas
  { em: 17600, p: 18 }, // copiadas
  { em: 18500, p: 19 }, // a planilha sai; as linhas estão coladas no campo
  { em: 19500, p: 20 }, // cursor → enviar
  { em: 20100, p: 21 }, // clique: mensagem enviada
  { em: 20600, p: 22 }, // "Processando..."
  { em: 22100, p: 23 }, // o assistente lista os 3 e pede confirmação
  { em: 23700, p: 24 }, // digita "sim"
  { em: 24500, p: 25 }, // envia
  { em: 25000, p: 26 }, // "Processando..."
  { em: 26300, p: 27 }, // cadastrados, e a lista ganha 3 linhas
  { em: 28200, p: 28 }, // cursor → fechar o assistente
  { em: 28800, p: 29 }, // clique: fecha
  { em: 29600, p: 30 }, // cursor → Relatórios (celular: toque no menu)
  { em: 30300, p: 31 }, // clique: o grupo abre
  { em: 31000, p: 32 }, // cursor → Central de relatórios
  { em: 31700, p: 33 }, // clique: tela de Relatórios
  { em: 32800, p: 34 }, // cursor → aba Fluxo Mensal
  { em: 33500, p: 35 }, // clique: o fluxo mensal aparece
  { em: 35300, p: 36 }, // cursor → Exportar PDF
  { em: 36000, p: 37 }, // clique: "Gerando..."
  { em: 37000, p: 38 }, // o PDF aparece
  { em: 38600, p: 39 }, // baixado
  { em: 42000, p: 40 }, // tudo some, para recomeçar
]
const DURACAO = 42800
const ESTATICO = 39

const ETAPAS = ['Menu e cadastro manual', 'A IA cadastra a planilha', 'Relatório em PDF']
const TEMPO_ETAPA = [
  [0, 14000],
  [14000, 29600],
  [29600, 42000],
]

// onde o cursor (ou o dedo) está em cada passo: o nome de um [data-alvo]
const ALVO: Record<number, string> = {
  1: 'grupo-cadastros', 2: 'grupo-cadastros', 3: 'item-motoristas', 4: 'item-motoristas',
  5: 'btn-novo', 6: 'btn-novo', 7: 'campo-nome', 8: 'campo-cpf', 9: 'campo-cat', 10: 'campo-venc',
  11: 'btn-salvar', 12: 'btn-salvar', 14: 'bot', 15: 'bot', 16: 'planilha', 17: 'planilha', 18: 'planilha',
  19: 'chat-campo', 20: 'chat-enviar', 21: 'chat-enviar', 24: 'chat-campo', 25: 'chat-enviar',
  28: 'chat-fechar', 29: 'chat-fechar', 30: 'grupo-relatorios', 31: 'grupo-relatorios',
  32: 'item-relatorios', 33: 'item-relatorios', 34: 'aba-fluxo', 35: 'aba-fluxo', 36: 'btn-pdf', 37: 'btn-pdf',
}
const CLIQUES = new Set([2, 4, 6, 12, 15, 21, 25, 29, 31, 33, 35, 37])

// ── Dados fictícios ─────────────────────────────────────────────────
type Motorista = { nome: string; cpf: string; tel: string; cnh: string; cat: string; ate: string; tac?: boolean }
const MOTORISTAS: Motorista[] = [
  { nome: 'Anderson Prado', cpf: '***.***.482-**', tel: '(41) 9 ••••-4410', cnh: '•••••• 8901', cat: 'E', ate: '03/2028' },
  { nome: 'Diego Teixeira', cpf: '***.***.107-**', tel: '(41) 9 ••••-2276', cnh: '•••••• 3317', cat: 'E', ate: '11/2027', tac: true },
  { nome: 'Luís Fernandes', cpf: '***.***.659-**', tel: '(43) 9 ••••-8812', cnh: '•••••• 5520', cat: 'D', ate: '06/2029' },
  { nome: 'Marcos Ribeiro', cpf: '***.***.240-**', tel: '(41) 9 ••••-1934', cnh: '•••••• 7745', cat: 'E', ate: '01/2028' },
  { nome: 'Rafael Moura', cpf: '***.***.893-**', tel: '(44) 9 ••••-6051', cnh: '•••••• 2209', cat: 'E', ate: '09/2028', tac: true },
]
const PAULO: Motorista = { nome: 'Paulo Henrique Souza', cpf: '***.***.789-**', tel: '—', cnh: '•••••• 8900', cat: 'E', ate: '05/2029' }
const DA_PLANILHA: Motorista[] = [
  { nome: 'Wagner Lima', cpf: '***.***.315-**', tel: '—', cnh: '•••••• 4471', cat: 'E', ate: '08/2027' },
  { nome: 'Célio Andrade', cpf: '***.***.928-**', tel: '—', cnh: '•••••• 6602', cat: 'D', ate: '11/2028' },
  { nome: 'Juliano Costa', cpf: '***.***.574-**', tel: '—', cnh: '•••••• 1183', cat: 'E', ate: '02/2029' },
]

// Fluxo mensal (abr–set/2026); setembro é o mesmo número do dashboard
const MESES = [
  { m: 'Set/26', fat: 86420, custo: 52180, viagens: 27 },
  { m: 'Ago/26', fat: 83150, custo: 53010, viagens: 26 },
  { m: 'Jul/26', fat: 80900, custo: 51300, viagens: 25 },
  { m: 'Jun/26', fat: 74200, custo: 50640, viagens: 23 },
  { m: 'Mai/26', fat: 76850, custo: 49120, viagens: 24 },
  { m: 'Abr/26', fat: 71300, custo: 47900, viagens: 22 },
]
const MAIOR = Math.max(...MESES.map((x) => x.fat))
const brl = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const pct = (r: number, f: number) => `${((r / f) * 100).toFixed(1).replace('.', ',')}%`

const VIAGENS = [
  { rota: 'Paranaguá → Londrina', mot: 'Anderson Prado', frete: 6800, custo: 4010 },
  { rota: 'Curitiba → Maringá', mot: 'Rafael Moura', frete: 5900, custo: 3720 },
  { rota: 'Paranaguá → Cascavel', mot: 'Marcos Ribeiro', frete: 7400, custo: 4590 },
  { rota: 'Paranaguá → Ponta Grossa', mot: 'Diego Teixeira', frete: 3200, custo: 2110 },
]

// ── Menu (mesma ordem e ícones do layout do Fleet) ──────────────────
const GRUPOS: { nome: string; ic: NomeIcone; id?: 'cadastros' | 'relatorios'; itens?: { nome: string; ic: NomeIcone; alvo?: string }[] }[] = [
  { nome: 'Cadastros', ic: 'ferramenta', id: 'cadastros', itens: [{ nome: 'Clientes', ic: 'predio' }, { nome: 'Veículos', ic: 'caminhao' }, { nome: 'Motoristas', ic: 'pessoas', alvo: 'item-motoristas' }, { nome: 'Carretas', ic: 'conteiner' }] },
  { nome: 'Comercial', ic: 'documento' },
  { nome: 'Operacional', ic: 'prancheta' },
  { nome: 'Combustível', ic: 'bomba' },
  { nome: 'Financeiro', ic: 'cifrao' },
  { nome: 'Manutenção', ic: 'martelo' },
  { nome: 'Relatórios', ic: 'grafico', id: 'relatorios', itens: [{ nome: 'Central de relatórios', ic: 'grafico', alvo: 'item-relatorios' }, { nome: 'Resultado operacional', ic: 'grafico' }] },
  { nome: 'Configurações', ic: 'engrenagem' },
]

type Pagina = 'dash' | 'motoristas' | 'relatorios'

export function FleetDemo() {
  const { ref, p, rodada } = useCena(ROTEIRO, DURACAO, ESTATICO)
  const vista = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const [medida, setMedida] = useState<{ modo: 'pc' | 'cel'; escala: number }>({ modo: 'pc', escala: 0.9 })
  const [mira, setMira] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const el = vista.current
    if (!el) return
    const medir = () => {
      const w = el.clientWidth
      const modo = w < 640 ? 'cel' : 'pc'
      setMedida({ modo, escala: modo === 'pc' ? w / 1000 : Math.min(1.08, w / 300) })
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // O cursor (ou o dedo) vai até o elemento marcado com data-alvo: a posição sai
  // da própria tela, então serve para o computador e para o celular.
  const { modo, escala } = medida
  useLayoutEffect(() => {
    const raiz = palco.current
    if (!raiz) return
    const nome = modo === 'cel' && (p === 1 || p === 30) ? 'menu' : ALVO[p]
    if (!nome) return
    const el = raiz.querySelector(`[data-alvo="${nome}"]`)
    if (!el) return
    const r = el.getBoundingClientRect()
    const b = raiz.getBoundingClientRect()
    const x = (r.left + r.width / 2 - b.left) / escala
    const y = (r.top + r.height / 2 - b.top) / escala
    setMira({ x: nome === 'planilha' ? x - 30 : x, y })
  }, [p, modo, escala])

  const pagina: Pagina = p < 4 ? 'dash' : p < 33 ? 'motoristas' : 'relatorios'
  const etapa = p < 14 ? 0 : p < 30 ? 1 : 2
  const estatico = rodada === 0 && p === ESTATICO
  const toque = modo === 'cel' && (CLIQUES.has(p) || p === 1 || p === 30) && mira
  const alturaVista = modo === 'pc' ? 630 * escala : 600 * escala

  const app = <App p={p} rodada={rodada} pagina={pagina} estatico={estatico} />

  return (
    <div className="fd" ref={ref} data-modo={modo} data-p={p}>
      <span className="hg-demo__selo">Exemplo com dados fictícios</span>
      <div className="fd__vista" ref={vista} style={{ height: alturaVista }}>
        <div
          className={`fd__palco ${p === 40 ? 'fd__palco--fim' : ''}`}
          ref={palco}
          style={{ '--escala': escala } as CSSProperties}
          role="img"
          aria-label="Exemplo com dados fictícios do Fleet: no menu, o usuário abre Cadastros, Motoristas, e cadastra um motorista à mão. Depois cola no Assistente Fleet as linhas de uma planilha com três motoristas; o assistente confirma e cadastra os três. Por fim, abre a Central de relatórios, a aba Fluxo Mensal, e exporta o relatório em PDF."
        >
          {modo === 'pc' ? (
            <div className="fd-janela">
              <div className="fd-janela__barra"><i /><i /><i /><span>app.logcodex.com/{pagina === 'dash' ? 'dashboard' : pagina === 'motoristas' ? 'dashboard/drivers' : 'relatorios'}</span></div>
              {app}
            </div>
          ) : (
            <MolduraCelular className="fd-cel">
              <Status claro hora="18:40" />
              {app}
            </MolduraCelular>
          )}
          {modo === 'pc' && mira && (
            <Cursor
              className={`fd-cursor ${CLIQUES.has(p) ? 'hg-cursor--clica' : ''} ${p === 0 || p >= 40 ? 'hg-cursor--some' : ''}`}
              style={{ left: mira.x, top: mira.y }}
            />
          )}
          {toque && <span key={`${p}-${rodada}`} className="hg-toque" style={{ left: mira.x, top: mira.y }} />}
        </div>
      </div>

      <ol className="hg-mesa__etapas fd__etapas" aria-hidden="true">
        {ETAPAS.map((t, i) => {
          const estado = i === etapa && p < 40 && !estatico ? 'ativa' : i < etapa || estatico || p === 40 ? 'feita' : ''
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
// O sistema
// ════════════════════════════════════════════════════════════════════

// Logo do cliente no menu (pedido do Leo, 12/10): no lugar da marca "logcodex",
// uma logo fictícia e o aviso "[sua logo aqui]". É fiel ao sistema: no Fleet de
// verdade, a empresa sobe a própria logo e ela aparece aqui no menu.
function LogoCliente() {
  return (
    <span className="fd-logo">
      <span className="fd-logo__caixa">
        <svg className="fd-logo__sol" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="fd-sol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <path d="M6 20a10 10 0 0 1 20 0z" fill="url(#fd-sol)" />
          <path d="M16 5v3M6.1 9.1l2.1 2.1M25.9 9.1l-2.1 2.1M2 20h3M27 20h3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 24h26M8 28h16" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className="fd-logo__nome"><b>Horizonte</b><small>Transportes</small></span>
      </span>
      <small className="fd-logo__aqui">[sua logo aqui]</small>
    </span>
  )
}

function App({ p, rodada, pagina, estatico }: { p: number; rodada: number; pagina: Pagina; estatico: boolean }) {
  const gaveta = (p >= 1 && p < 4) || (p >= 30 && p < 33)
  const chat = p >= 15 && p < 29
  return (
    <div className="fd-app">
      <Menu p={p} gaveta={gaveta} />
      <div className="fd-main">
        <header className="fd-topo">
          <span className="fd-topo__menu" data-alvo="menu"><Icone nome="menu" /></span>
          <span className="fd-topo__logo"><LogoCliente /></span>
          <span className="fd-topo__lua"><Icone nome="lua" /></span>
        </header>
        <div className="fd-conteudo">
          <div className={`fd-pag ${pagina === 'dash' ? 'fd-pag--on' : ''}`}><Dashboard rodada={rodada} /></div>
          <div className={`fd-pag ${pagina === 'motoristas' ? 'fd-pag--on' : ''}`}><Motoristas p={p} /></div>
          <div className={`fd-pag ${pagina === 'relatorios' ? 'fd-pag--on' : ''}`}><Relatorios p={p} /></div>
        </div>
        {p >= 6 && p < 13 && <Dialogo p={p} rodada={rodada} />}
        <span className={`fd-bot ${chat ? 'fd-bot--oculto' : ''}`} data-alvo="bot"><Icone nome="robo" /></span>
        <Chat p={p} rodada={rodada} aberto={chat} />
        <Planilha p={p} />
        <Pdf p={p} estatico={estatico} />
      </div>
    </div>
  )
}

function Menu({ p, gaveta }: { p: number; gaveta: boolean }) {
  const aberto = { cadastros: p >= 2, relatorios: p >= 31 }
  const ativo = p < 4 ? 'Dashboard' : p < 33 ? 'Motoristas' : 'Central de relatórios'
  return (
    <aside className={`fd-menu ${gaveta ? 'fd-menu--gaveta' : ''}`}>
      <div className="fd-menu__logo"><LogoCliente /></div>
      <nav>
        <span className={`fd-item ${ativo === 'Dashboard' ? 'fd-item--ativo' : ''}`}><Icone nome="painel" /> Dashboard{ativo === 'Dashboard' && <i />}</span>
        <div className="fd-grupos">
          {GRUPOS.map((g) => {
            const abre = g.id ? aberto[g.id] : false
            return (
              <div key={g.nome} className={`fd-grupo ${abre ? 'fd-grupo--aberto' : ''}`}>
                <span className="fd-grupo__nome" data-alvo={g.id ? `grupo-${g.id}` : undefined}>
                  <Icone nome={g.ic} /> {g.nome}
                  <Icone nome="abaixo" className="fd-grupo__seta" />
                </span>
                {g.itens && (
                  <div className="fd-grupo__itens">
                    {g.itens.map((it) => (
                      <span key={it.nome} className={`fd-item ${ativo === it.nome ? 'fd-item--ativo' : ''}`} data-alvo={it.alvo}>
                        <Icone nome={it.ic} /> {it.nome}{ativo === it.nome && <i />}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
      <div className="fd-menu__pe">
        <div className="fd-menu__empresa"><small>Transportes Horizonte</small><b>Ricardo Alves</b></div>
        <span className="fd-item fd-item--sair"><Icone nome="sair" /> Sair</span>
        <small className="fd-menu__versao">v3.7.0</small>
      </div>
    </aside>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────
function Dashboard({ rodada }: { rodada: number }) {
  const kpis = [
    { t: 'Faturamento', v: 'R$ 86.420,00', c: 'azul' },
    { t: 'A receber', v: 'R$ 21.300,00', c: 'laranja' },
    { t: 'Custo total', v: 'R$ 52.180,00', c: '' },
    { t: 'Resultado', v: 'R$ 34.240,00', c: 'verde' },
    { t: 'Margem', v: '39,6%', c: 'verde' },
  ]
  const semanas = [6, 7, 6, 8, 0]
  return (
    <div className="fd-dash" key={rodada}>
      <div className="fd-cab">
        <div><small>Olá, Ricardo</small><h3>Dashboard</h3></div>
        <span className="fd-abas-pill"><b>Visão Geral</b><span>Frota Própria</span><span>Terceiros</span></span>
      </div>
      <div className="fd-filtros"><span>Set <Icone nome="abaixo" /></span><span>2026 <Icone nome="abaixo" /></span></div>
      <div className="fd-kpis">
        {kpis.map((k, i) => (
          <div key={k.t} className={`fd-kpi fd-kpi--${k.c || 'neutro'}`} style={{ '--i': i } as CSSProperties}>
            <small>{k.t}{k.c && <i />}</small>
            <b>{k.v}</b>
          </div>
        ))}
      </div>
      <div className="fd-kpis fd-kpis--2">
        <div className="fd-kpi" style={{ '--i': 5 } as CSSProperties}><small>Total de veículos</small><b>8</b></div>
        <div className="fd-kpi" style={{ '--i': 6 } as CSSProperties}><small>Em viagem agora<i className="fd-ponto--azul" /></small><b className="fd-azul">3</b></div>
        <div className="fd-kpi" style={{ '--i': 7 } as CSSProperties}><small>Ociosos &gt; 7 dias<i className="fd-ponto--amarelo" /></small><b className="fd-laranja">1</b></div>
        <div className="fd-kpi" style={{ '--i': 8 } as CSSProperties}><small>Viagens no mês</small><b>27</b></div>
      </div>
      <div className="fd-graficos">
        <div className="fd-cartao">
          <b className="fd-cartao__titulo">Viagens — Set/26</b>
          <div className="fd-barras">
            {semanas.map((v, i) => (
              <span key={i} style={{ '--h': `${(v / 8) * 100}%`, '--i': i } as CSSProperties}>
                <i />
                <small>Sem. {i + 1}</small>
              </span>
            ))}
          </div>
        </div>
        <div className="fd-cartao">
          <b className="fd-cartao__titulo">Faturamento vs Custo</b>
          <svg className="fd-linhas" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 100 L60 74 L120 52 L180 34 L240 18 L300 10" className="fd-linha fd-linha--fat" pathLength={1} />
            <path d="M0 104 L60 92 L120 80 L180 70 L240 62 L300 56" className="fd-linha fd-linha--custo" pathLength={1} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Motoristas ─────────────────────────────────────────────────────
function Linha({ m, nova }: { m: Motorista; nova?: boolean }) {
  return (
    <div className={`fd-tr ${nova ? 'fd-tr--nova' : ''}`}>
      <span className="fd-td fd-td--nome">{m.nome}</span>
      <span className="fd-td fd-td--cpf">{m.cpf}</span>
      <span className="fd-td fd-td--tel">{m.tel}</span>
      <span className="fd-td fd-td--cnh">{m.cnh} ({m.cat}) <small>até {m.ate}</small></span>
      <span className="fd-td fd-td--tipo"><em className={m.tac ? 'fd-badge fd-badge--azul' : 'fd-badge'}>{m.tac ? 'TAC' : 'CLT/Func.'}</em></span>
      <span className="fd-td fd-td--status"><em className="fd-badge fd-badge--verde">Ativo</em></span>
      <span className="fd-td fd-td--acoes"><Icone nome="lapis" /><Icone nome="lixeira" /></span>
    </div>
  )
}

function Motoristas({ p }: { p: number }) {
  const paulo = p >= 13
  const planilha = p >= 27
  return (
    <div className="fd-mot">
      <div className="fd-cab">
        <div><h3>Motoristas</h3><small>Gerencie a equipe de motoristas</small></div>
        <span className={`fd-btn fd-btn--escuro ${p === 5 || p === 6 ? 'fd-btn--hover' : ''}`} data-alvo="btn-novo"><Icone nome="mais" /> Novo Motorista</span>
      </div>
      <span className="fd-alavanca"><Icone nome="alavanca" /> Exibir inativos</span>
      <div className="fd-tabela">
        <div className="fd-tr fd-tr--cab">
          <span className="fd-td fd-td--nome">Nome</span>
          <span className="fd-td fd-td--cpf">CPF</span>
          <span className="fd-td fd-td--tel">Telefone</span>
          <span className="fd-td fd-td--cnh">CNH</span>
          <span className="fd-td fd-td--tipo">Tipo</span>
          <span className="fd-td fd-td--status">Status</span>
          <span className="fd-td fd-td--acoes">Ações</span>
        </div>
        {planilha && DA_PLANILHA.map((m) => <Linha key={m.nome} m={m} nova={p < 31} />)}
        {paulo && <Linha m={PAULO} nova={p < 16} />}
        {MOTORISTAS.map((m) => <Linha key={m.nome} m={m} />)}
      </div>
    </div>
  )
}

function Dialogo({ p, rodada }: { p: number; rodada: number }) {
  const campo = (rotulo: string, valor: ReactNode, alvo: string, extra = '') => (
    <label className={`fd-campo ${extra}`} data-alvo={alvo}>
      <span>{rotulo}</span>
      <span className="fd-input">{valor}</span>
    </label>
  )
  return (
    <div className="fd-dialogo">
      <div className="fd-dialogo__caixa">
        <div className="fd-dialogo__topo"><b>Novo Motorista</b><Icone nome="fechar" /></div>
        <div className="fd-form">
          {campo('Nome completo *', p >= 7 ? <TextoDigitado key={`n-${rodada}`} texto="Paulo Henrique Souza" ativo={p === 7} cheio={p >= 8} passoMs={60} /> : <em>Nome do motorista</em>, 'campo-nome', 'fd-campo--largo')}
          {campo('CPF * (apenas dígitos)', p >= 8 ? <TextoDigitado key={`c-${rodada}`} texto="12345678909" ativo={p === 8} cheio={p >= 9} passoMs={70} /> : <em>00000000000</em>, 'campo-cpf')}
          {campo('Telefone', <em>(11) 99999-9999</em>, 'campo-tel')}
          {campo('Nº CNH', p >= 9 ? '04718838900' : <em>00000000000</em>, 'campo-cnh')}
          {campo('Categoria', p >= 9 ? <>E <Icone nome="abaixo" /></> : <><em>—</em> <Icone nome="abaixo" /></>, 'campo-cat', 'fd-campo--select')}
          {campo('Vencimento CNH', p >= 10 ? '12/05/2029' : <em>dd/mm/aaaa</em>, 'campo-venc')}
          {campo('Comissão (%)', p >= 10 ? '12' : <em>0</em>, 'campo-com')}
          <span className="fd-check"><i /> Motorista autônomo (TAC)</span>
        </div>
        <div className="fd-dialogo__acoes">
          <span className="fd-btn fd-btn--claro">Cancelar</span>
          <span className={`fd-btn fd-btn--escuro ${p >= 11 ? 'fd-btn--hover' : ''}`} data-alvo="btn-salvar">{p >= 12 ? <><Icone nome="carregando" className="fd-gira" /> Salvando...</> : 'Salvar'}</span>
        </div>
      </div>
    </div>
  )
}

// ── Assistente Fleet ───────────────────────────────────────────────
const COLADO = 'Cadastra esses motoristas da planilha:\nWagner Lima  315  E  31/08/2027\nCélio Andrade  928  D  30/11/2028\nJuliano Costa  574  E  28/02/2029'

function Chat({ p, rodada, aberto }: { p: number; rodada: number; aberto: boolean }) {
  const campo = p === 19 || p === 20 ? 'colado' : p === 24 ? 'sim' : ''
  return (
    <div className={`fd-chat ${aberto ? 'fd-chat--on' : ''}`}>
      <div className="fd-chat__topo">
        <span><i /> <b>Assistente Fleet</b> <em>Beta</em></span>
        <span className="fd-chat__acoes"><Icone nome="lixeira" /><Icone nome="expandir" /><span data-alvo="chat-fechar"><Icone nome="fechar" /></span></span>
      </div>
      <div className="fd-chat__msgs">
        <div className="fd-msg fd-msg--ia">Olá! Sou o assistente operacional da frota. Posso consultar viagens, cadastrar motoristas e veículos, registrar despesas e muito mais. O que precisa?</div>
        {p >= 21 && <div className="fd-msg fd-msg--eu">{COLADO}</div>}
        {p === 22 && <div className="fd-msg fd-msg--ia fd-msg--proc">Processando...</div>}
        {p >= 23 && (
          <>
            <div className="fd-msg fd-msg--ia">Encontrei 3 motoristas na planilha. Confirma o cadastro?</div>
            <div className="fd-dados">
              {DA_PLANILHA.map((m) => (
                <div key={m.nome} className="fd-dado">
                  <b>{m.nome}</b>
                  <small>CNH {m.cat} · válida até {m.ate}</small>
                </div>
              ))}
            </div>
          </>
        )}
        {p >= 25 && <div className="fd-msg fd-msg--eu">sim</div>}
        {p === 26 && <div className="fd-msg fd-msg--ia fd-msg--proc">Processando...</div>}
        {p >= 27 && (
          <>
            <div className="fd-msg fd-msg--ia">Feito! Os 3 motoristas foram cadastrados.</div>
            <div className="fd-sucesso">✅ Motorista cadastrado!</div>
          </>
        )}
      </div>
      <div className="fd-chat__campo">
        <div className="fd-chat__texto" data-alvo="chat-campo">
          {campo === 'colado' ? <span className="fd-chat__colado">{COLADO}</span> : campo === 'sim' ? <TextoDigitado key={`s-${rodada}`} texto="sim" ativo={p === 24} cheio={false} passoMs={160} /> : <em>Pergunte algo sobre a operação…</em>}
        </div>
        <div className="fd-chat__barra">
          <span className="fd-chat__pill"><Icone nome="clipe" /><span><Icone nome="robo" /> Assistente</span><Icone nome="mic" /></span>
          <span className="fd-chat__enviar-grupo">
            <small>{campo === 'colado' ? COLADO.length : campo === 'sim' ? 3 : 0}</small>
            <span className={`fd-chat__enviar ${campo ? 'fd-chat__enviar--on' : ''}`} data-alvo="chat-enviar"><Icone nome="enviar" /></span>
          </span>
        </div>
      </div>
    </div>
  )
}

function Planilha({ p }: { p: number }) {
  const on = p >= 16 && p < 19
  return (
    <div className={`fd-plan ${on ? 'fd-plan--on' : ''} ${p >= 17 ? 'fd-plan--sel' : ''}`} data-alvo="planilha">
      <div className="fd-plan__topo"><Icone nome="planilha" /> motoristas-novos.xlsx</div>
      <div className="fd-plan__grade">
        <span className="fd-plan__col" /><span className="fd-plan__col">A</span><span className="fd-plan__col">B</span><span className="fd-plan__col">C</span><span className="fd-plan__col">D</span>
        <span className="fd-plan__n">1</span><b>Nome</b><b>CPF</b><b>Cat.</b><b>Validade CNH</b>
        {DA_PLANILHA.map((m, i) => (
          <Fragment key={m.nome}>
            <span className="fd-plan__n">{i + 2}</span>
            <span className="fd-plan__c" style={{ '--i': i } as CSSProperties}>{m.nome}</span>
            <span className="fd-plan__c" style={{ '--i': i } as CSSProperties}>{m.cpf}</span>
            <span className="fd-plan__c" style={{ '--i': i } as CSSProperties}>{m.cat}</span>
            <span className="fd-plan__c" style={{ '--i': i } as CSSProperties}>{m.ate}</span>
          </Fragment>
        ))}
      </div>
      <span className={`fd-plan__copiado ${p >= 18 ? 'fd-plan__copiado--on' : ''}`}><kbd>Ctrl</kbd> + <kbd>C</kbd> Copiado</span>
    </div>
  )
}

// ── Relatórios ─────────────────────────────────────────────────────
function Exportar({ p }: { p: number }) {
  return (
    <span className="fd-exportar">
      <span className={`fd-btn fd-btn--claro fd-btn--mini ${p >= 36 && p < 38 ? 'fd-btn--foco' : ''}`} data-alvo="btn-pdf">
        {p === 37 ? <><Icone nome="carregando" className="fd-gira" /> Gerando...</> : <><Icone nome="documento" /> Exportar PDF</>}
      </span>
      <span className="fd-btn fd-btn--claro fd-btn--mini"><Icone nome="planilha" /> Exportar Excel</span>
      <span className="fd-btn fd-btn--claro fd-btn--mini fd-so-pc"><Icone nome="baixar" /> Exportar CSV</span>
      <span className="fd-btn fd-btn--claro fd-btn--mini fd-so-pc"><Icone nome="externo" /> Google Sheets</span>
    </span>
  )
}

function Relatorios({ p }: { p: number }) {
  const fluxo = p >= 35
  const abas = ['Viagens', 'Motoristas', 'Veículos', 'Clientes', 'Despesas', 'Fluxo Mensal']
  return (
    <div className="fd-rel">
      <div className="fd-cab"><div><h3>Relatórios</h3><small>Análise financeira e operacional da frota</small></div></div>
      <div className="fd-abas">
        {abas.map((a) => (
          <span key={a} className={(a === 'Fluxo Mensal') === fluxo ? 'fd-aba--on' : ''} data-alvo={a === 'Fluxo Mensal' ? 'aba-fluxo' : undefined}>{a}</span>
        ))}
      </div>
      {!fluxo ? (
        <div className="fd-rel__corpo" key="viagens">
          <div className="fd-rel__linha"><small>Margem, custo e frete por viagem</small><Exportar p={p} /></div>
          <div className="fd-tabela fd-tabela--rel">
            <div className="fd-tr fd-tr--cab"><span className="fd-td">Rota</span><span className="fd-td fd-so-pc">Motorista</span><span className="fd-td fd-td--num">Frete</span><span className="fd-td fd-td--num fd-so-pc">Custo</span><span className="fd-td fd-td--num">Margem</span></div>
            {VIAGENS.map((v) => (
              <div className="fd-tr" key={v.rota}>
                <span className="fd-td"><b>{v.rota}</b></span>
                <span className="fd-td fd-so-pc">{v.mot}</span>
                <span className="fd-td fd-td--num">{brl(v.frete)}</span>
                <span className="fd-td fd-td--num fd-so-pc">{brl(v.custo)}</span>
                <span className="fd-td fd-td--num fd-verde">{pct(v.frete - v.custo, v.frete)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fd-rel__corpo" key="fluxo">
          <div className="fd-rel__linha">
            <small>Faturamento, custo e resultado por mês</small>
            <span className="fd-periodo"><b>6 meses</b><span>12 meses</span></span>
            <Exportar p={p} />
          </div>
          <div className="fd-cartao fd-fluxo">
            <div className="fd-legenda"><span><i className="fd-l--fat" /> Faturamento</span><span><i className="fd-l--custo" /> Custo</span><span><i className="fd-l--res" /> Resultado</span></div>
            {MESES.map((x, i) => (
              <div key={x.m} className="fd-fluxo__linha" style={{ '--i': i } as CSSProperties}>
                <small>{x.m}</small>
                <span className="fd-fluxo__trilho">
                  <i className="fd-fluxo__fat" style={{ '--w': `${(x.fat / MAIOR) * 100}%` } as CSSProperties} />
                  <i className="fd-fluxo__custo" style={{ '--w': `${(x.custo / MAIOR) * 100}%` } as CSSProperties} />
                </span>
                <b>+{brl(x.fat - x.custo)}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── PDF exportado (mesmo cabeçalho do PDF que o Fleet gera) ─────────
function Pdf({ p, estatico }: { p: number; estatico: boolean }) {
  const on = p >= 38 && p < 40
  const baixado = p >= 39 && p < 40
  return (
    <>
      <div className={`fd-pdf ${on ? 'fd-pdf--on' : ''} ${estatico ? 'fd-pdf--estatico' : ''}`}>
        <div className="fd-pdf__cab">
          <div><b>Fluxo Mensal</b><small>Faturamento, custo e resultado por mês</small><small>Período: Abr/26 a Set/26</small></div>
          <div className="fd-pdf__dir"><small>TRANSPORTES HORIZONTE</small><small>Gerado em 30/09/2026 18:40</small><small>LogCodex Fleet</small></div>
        </div>
        <div className="fd-pdf__tab">
          <div className="fd-pdf__tr fd-pdf__tr--cab"><span>Mês</span><span>Faturamento (R$)</span><span>Custo Total (R$)</span><span>Resultado (R$)</span><span>Margem %</span><span>Viagens</span></div>
          {MESES.map((x) => (
            <div key={x.m} className="fd-pdf__tr">
              <span>{x.m}</span>
              <span>{(x.fat).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>{(x.custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>{(x.fat - x.custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>{pct(x.fat - x.custo, x.fat)}</span>
              <span>{x.viagens}</span>
            </div>
          ))}
        </div>
        <div className="fd-pdf__pe"><small>LogCodex Fleet — Relatório exportado</small><small>Página 1 de 1</small></div>
      </div>
      <span className={`fd-baixado ${baixado || estatico ? 'fd-baixado--on' : ''}`}>
        <i><Icone nome="documento" /></i>
        <span><b>fluxo-mensal.pdf</b><small><Icone nome="check" /> Download concluído</small></span>
      </span>
    </>
  )
}
