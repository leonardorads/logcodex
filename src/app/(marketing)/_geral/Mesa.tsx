'use client'

import type { CSSProperties } from 'react'
import { Icone } from './Icone'
import { Contador, TextoDigitado, useRoteiro, type Marca } from './useRoteiro'

// "Mesa" do topo: a história que a página promete, em três peças.
// 1. alguém procura no Google e entra no site do negócio;
// 2. clica em "Agendar pelo WhatsApp" e é atendido pela IA;
// 3. o agendamento aparece organizado no painel.
// O negócio (Studio Equilíbrio) é FICTÍCIO e marcado como exemplo; sem nota,
// avaliação, preço ou número de resultado inventado.
//
// No computador as três peças ficam à vista (a ativa em destaque); no celular
// aparece uma por vez, no mesmo palco, com as etapas embaixo.

const BUSCA = 'fisioterapia perto de mim'

const ROTEIRO: Marca[] = [
  { em: 0, p: 1 }, // digitando a busca
  { em: 1700, p: 2 }, // cursor vai ao resultado
  { em: 2400, p: 3 }, // clique: abre o site
  { em: 3100, p: 4 }, // cursor vai ao botão do WhatsApp
  { em: 3700, p: 5 }, // clique: a mensagem voa para o WhatsApp
  { em: 4400, p: 6 }, // cliente pergunta
  { em: 5000, p: 7 }, // IA digitando
  { em: 5900, p: 8 }, // IA responde
  { em: 6900, p: 9 }, // cliente escolhe
  { em: 7400, p: 10 }, // IA digitando
  { em: 8200, p: 11 }, // IA confirma
  { em: 8900, p: 12 }, // o agendamento voa para o painel
  { em: 9600, p: 13 }, // nova linha + contador
  { em: 10500, p: 14 }, // fim
]
const FIM = 14

const ETAPAS = ['Achou no Google', 'Atendimento no WhatsApp', 'Organizado no painel']

// Posição do cursor dentro da peça do site (em %), por passo.
function cursor(p: number): CSSProperties {
  if (p >= 4) return { left: '46%', top: '80%' }
  if (p >= 2) return { left: '52%', top: '50%' }
  return { left: '82%', top: '90%' }
}

export function Mesa() {
  const { ref, p, rodada, rever } = useRoteiro(ROTEIRO, FIM)
  const foco = p <= 5 ? 'site' : p <= 11 ? 'zap' : 'painel'
  const etapa = foco === 'site' ? 0 : foco === 'zap' ? 1 : 2
  const estatico = rodada === 0 && p === FIM // "reduzir movimento": quadro final direto

  return (
    <div className="hg-mesa" ref={ref} data-foco={foco} data-p={p}>
      <span className="hg-mesa__selo">Exemplo ilustrativo</span>

      {/* role="img" só no palco: o botão "Rever" fica fora, para continuar acessível */}
      <div className="hg-mesa__palco" role="img" aria-label="Exemplo ilustrativo: uma pessoa procura fisioterapia no Google, entra no site do Studio Equilíbrio, agenda pelo WhatsApp com a IA e o horário aparece organizado no painel do negócio.">
        {/* ── 1. Site ─────────────────────────────── */}
        <div className={`hg-peca hg-peca--site ${foco === 'site' ? 'hg-peca--ativa' : ''}`} aria-hidden="true">
          <div className="hg-janela__barra">
            <i /><i /><i />
            <span>{p >= 3 ? 'studioequilibrio.com.br' : 'google.com'}</span>
          </div>
          <div className="hg-janela__tela">
            {p < 3 ? (
              <div className="hg-busca">
                <div className="hg-busca__caixa">
                  <Icone nome="busca" />
                  <span>
                    {p === 0 ? '' : <TextoDigitado key={rodada} texto={BUSCA} ativo={p === 1} cheio={p >= 2} />}
                    <i className="hg-caret" />
                  </span>
                </div>
                <div className={`hg-busca__res ${p >= 2 ? 'hg-alvo' : ''}`}>
                  <small>studioequilibrio.com.br</small>
                  <b>Studio Equilíbrio · Pilates e Fisioterapia</b>
                  <span>Fisioterapia e pilates com hora marcada. Agende pelo WhatsApp.</span>
                </div>
                <div className="hg-busca__res hg-busca__res--vazio"><small /><b /><span /></div>
                <div className="hg-busca__res hg-busca__res--vazio"><small /><b /><span /></div>
              </div>
            ) : (
              <div className="hg-sitio">
                <div className="hg-sitio__capa">
                  <svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="300" height="120" fill="#e9e2f7" />
                    <circle cx="236" cy="34" r="22" fill="#f6c58f" />
                    <path d="M0 96 C60 70 120 104 180 84 S270 70 300 80 V120 H0Z" fill="#b9a6e8" />
                    <path d="M0 108 C70 92 140 116 210 100 S280 96 300 100 V120 H0Z" fill="#8d74d6" />
                  </svg>
                </div>
                <b>Studio Equilíbrio</b>
                <span>Pilates e fisioterapia</span>
                <span className={`hg-sitio__btn ${p >= 4 ? 'hg-alvo' : ''}`}>
                  <Icone nome="conversa" /> Agendar pelo WhatsApp
                </span>
              </div>
            )}
            <span className={`hg-cursor ${p === 3 || p === 5 ? 'hg-cursor--clica' : ''} ${p >= 6 || p === 0 ? 'hg-cursor--some' : ''}`} style={cursor(p)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l13 8.5-6 1.2-3.2 5.6z" /></svg>
            </span>
          </div>
        </div>

        {/* ── 2. WhatsApp ─────────────────────────── */}
        <div className={`hg-peca hg-peca--zap ${foco === 'zap' ? 'hg-peca--ativa' : ''}`} aria-hidden="true">
          <div className="hg-fone">
            <div className="hg-fone__topo">
              <span className="hg-fone__av">SE</span>
              <span>
                <b>Studio Equilíbrio</b>
                <small>{p === 7 || p === 10 ? 'digitando…' : 'online'}</small>
              </span>
            </div>
            <div className="hg-fone__conversa">
              {p >= 6 && <p className="hg-balao hg-balao--cliente">Oi! Tem horário para fisioterapia na quinta à tarde?</p>}
              {p === 7 && <p className="hg-balao hg-balao--digitando"><i /><i /><i /></p>}
              {p >= 8 && <p className="hg-balao hg-balao--ia">Oi, Marina! Na quinta temos às 15h e às 17h. Qual fica melhor para você?</p>}
              {p >= 9 && <p className="hg-balao hg-balao--cliente">17h, por favor</p>}
              {p === 10 && <p className="hg-balao hg-balao--digitando"><i /><i /><i /></p>}
              {p >= 11 && <p className="hg-balao hg-balao--ia">Prontinho! Quinta, 17h, fisioterapia. Te mando um lembrete na véspera.</p>}
            </div>
            <div className="hg-fone__rodape">
              <Icone nome="robo" /> Atendimento com IA
            </div>
          </div>
        </div>

        {/* ── 3. Painel ───────────────────────────── */}
        <div className={`hg-peca hg-peca--painel ${foco === 'painel' ? 'hg-peca--ativa' : ''}`} aria-hidden="true">
          <div className="hg-painel__topo">
            <span><Icone nome="painel" /> Agenda da semana</span>
            <span className={`hg-painel__num ${p >= 13 ? 'hg-painel__num--sobe' : ''}`}>
              {estatico ? <b>13</b> : <Contador key={rodada} alvo={p >= 13 ? 13 : 12} ativo={p >= 1} />} agendamentos
            </span>
          </div>
          <ul className="hg-painel__lista">
            {p >= 13 && (
              <li className="hg-painel__novo">
                <span className="hg-painel__av">M</span>
                <span><b>Marina S.</b><small>Fisioterapia · Qui 17h</small></span>
                <em>Novo</em>
              </li>
            )}
            <li>
              <span className="hg-painel__av">C</span>
              <span><b>Carlos M.</b><small>Pilates · Ter 9h</small></span>
              <em className="hg-ok">Confirmado</em>
            </li>
            <li>
              <span className="hg-painel__av">A</span>
              <span><b>Ana P.</b><small>Avaliação · Qua 14h</small></span>
              <em className="hg-ok">Confirmado</em>
            </li>
            {/* só no celular, onde o painel ocupa o palco inteiro */}
            <li className="hg-painel__extra">
              <span className="hg-painel__av">J</span>
              <span><b>João R.</b><small>Pilates · Sex 8h</small></span>
              <em className="hg-ok">Confirmado</em>
            </li>
          </ul>
        </div>

        {/* Mensagem e agendamento "voando" entre as peças (só no computador) */}
        <span className={`hg-voo hg-voo--um ${p === 5 ? 'hg-voo--vai' : ''}`} aria-hidden="true"><Icone nome="conversa" /></span>
        <span className={`hg-voo hg-voo--dois ${p === 12 ? 'hg-voo--vai' : ''}`} aria-hidden="true"><Icone nome="agenda" /></span>
      </div>

      <ol className="hg-mesa__etapas">
        {ETAPAS.map((t, i) => (
          <li key={t} className={i === etapa && p < FIM ? 'hg-etapa--ativa' : i < etapa || p === FIM ? 'hg-etapa--feita' : ''}>
            <span>{i + 1}</span> {t}
          </li>
        ))}
      </ol>

      {p === FIM && (
        <button type="button" className="hg-rever" onClick={rever}>
          <Icone nome="rever" /> Rever
        </button>
      )}
    </div>
  )
}
