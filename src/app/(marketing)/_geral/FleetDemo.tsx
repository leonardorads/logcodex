'use client'

import type { CSSProperties } from 'react'
import { Icone } from './Icone'
import { TextoDigitado, useRoteiro, type Marca } from './useRoteiro'

// Demonstração do assistente do Fleet, desenhada do zero (no lugar de vídeo
// gravado): uma pergunta → a resposta → o gráfico que confirma a resposta.
// Transportadora e números FICTÍCIOS, e os números fecham entre si:
// setembro R$ 18.420 contra agosto R$ 20.240 = 9% a menos.
// Linguagem visual inspirada no discord.com (pedido do Leo, 11/10): um palco com
// fundo próprio e só um recorte da tela, com uma ação e a sua consequência.

const PERGUNTA = 'Quanto gastei de combustível em setembro?'

const MESES = [
  { m: 'Jun', v: 21300 },
  { m: 'Jul', v: 20880 },
  { m: 'Ago', v: 20240 },
  { m: 'Set', v: 18420 },
]
const MAIOR = Math.max(...MESES.map((x) => x.v))
const mil = (v: number) => `${(v / 1000).toFixed(1).replace('.', ',')} mil`

const ROTEIRO: Marca[] = [
  { em: 0, p: 1 }, // cursor vai ao campo
  { em: 600, p: 2 }, // digitando a pergunta
  { em: 3000, p: 3 }, // cursor vai ao botão de enviar
  { em: 3500, p: 4 }, // envia
  { em: 3900, p: 5 }, // assistente digitando
  { em: 4900, p: 6 }, // resposta + gráfico
  { em: 6300, p: 7 }, // selo final
]
const FIM = 7

function cursor(p: number): CSSProperties {
  if (p >= 3) return { left: '93%', top: '91%' }
  if (p >= 1) return { left: '40%', top: '91%' }
  return { left: '70%', top: '60%' }
}

export function FleetDemo() {
  const { ref, p, rodada, rever } = useRoteiro(ROTEIRO, FIM)

  return (
    <div className="hg-demo" ref={ref}>
      <div className="hg-fleet" role="img" aria-label="Exemplo com dados fictícios: o dono da transportadora pergunta ao assistente do Fleet quanto gastou de combustível em setembro. O assistente responde R$ 18.420,00, 9% a menos que agosto, e mostra um gráfico dos últimos quatro meses.">
        <aside className="hg-fleet__lado" aria-hidden="true">
          <span className="hg-fleet__logo">F</span>
          <Icone nome="painel" />
          <Icone nome="caminhao" />
          <Icone nome="cartao" />
          <Icone nome="grafico" />
        </aside>
        <div className="hg-fleet__chat" aria-hidden="true">
          <div className="hg-fleet__topo">
            <span><i className="hg-ponto-verde" /> Assistente Fleet</span>
            <small>Transportes Horizonte</small>
          </div>
          <div className="hg-fleet__conversa">
            <p className="hg-fbal hg-fbal--ia">Olá! Sou o assistente da frota. Pergunte sobre viagens, despesas ou acertos.</p>
            {p >= 4 && <p className="hg-fbal hg-fbal--eu">{PERGUNTA}</p>}
            {p === 5 && <p className="hg-fbal hg-fbal--ia hg-balao--digitando"><i /><i /><i /></p>}
            {p >= 6 && (
              <div className="hg-fbal hg-fbal--ia hg-fbal--resposta">
                <p>Em setembro, o combustível custou <b>R$ 18.420,00</b>, 9% a menos que em agosto.</p>
                <div className="hg-grafico">
                  <span className="hg-grafico__titulo">Combustível · últimos 4 meses</span>
                  <div className="hg-grafico__barras">
                    {MESES.map((x, i) => (
                      <span key={x.m} className={`hg-grafico__col ${i === MESES.length - 1 ? 'hg-grafico__col--foco' : ''}`} style={{ '--h': `${(x.v / MAIOR) * 100}%`, '--i': i } as CSSProperties}>
                        <em>{mil(x.v)}</em>
                        <i />
                        <small>{x.m}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="hg-fleet__campo">
            <span className="hg-fleet__input">
              {p >= 4 ? (
                <span className="hg-fleet__dica">Pergunte algo sobre a operação…</span>
              ) : p >= 2 ? (
                <TextoDigitado key={rodada} texto={PERGUNTA} ativo={p === 2} cheio={p >= 3} passoMs={45} />
              ) : (
                <span className="hg-fleet__dica">Pergunte algo sobre a operação…</span>
              )}
            </span>
            <span className={`hg-fleet__enviar ${p === 3 || p === 4 ? 'hg-fleet__enviar--ativo' : ''}`}><Icone nome="enviar" /></span>
          </div>
          <span className={`hg-cursor ${p === 4 ? 'hg-cursor--clica' : ''} ${p >= 5 || p === 0 ? 'hg-cursor--some' : ''}`} style={cursor(p)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l13 8.5-6 1.2-3.2 5.6z" /></svg>
          </span>
        </div>
      </div>

      <span className={`hg-demo__chip ${p >= FIM ? 'hg-demo__chip--on' : ''}`} aria-hidden="true">
        <Icone nome="check" /> Pergunta em português, resposta com os números
      </span>
      <span className="hg-demo__selo">Exemplo com dados fictícios</span>

      {p === FIM && (
        <button type="button" className="hg-rever" onClick={rever}>
          <Icone nome="rever" /> Rever
        </button>
      )}
    </div>
  )
}
