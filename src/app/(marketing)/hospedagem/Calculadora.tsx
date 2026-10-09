'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { Calculator, Info, PiggyBank } from 'lucide-react'

// Simulador de comissão (pedido do Leo, 09/10/2026; desenho revisado com o
// Codex — projetos/claude-x-chatgpt/sessoes/2026-10-09-codex-calculadora-pousadas.md).
// Regras de honestidade: é cenário, não promessa; usa média mensal (não um mês
// de alta temporada); padrão de 10% direto; não desconta custos da venda direta.
// Taxas conferidas em 09/10/2026:
//  - Airbnb: taxa única de 16% do anfitrião para anúncios no Brasil (Central de Ajuda, art. 1857)
//  - Booking.com: 15% padrão; 18% no programa preferencial desde 01/07/2026 (Panrotas, 05/2026)
const PLATAFORMAS = [
  { id: 'airbnb', nome: 'Airbnb', taxa: 16 },
  { id: 'booking', nome: 'Booking', taxa: 15 },
  { id: 'booking-pref', nome: 'Booking preferencial', taxa: 18 },
] as const

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const milhar = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

function Valor({ v, className }: { v: number; className?: string }) {
  const reduz = useReducedMotion()
  const [mostra, setMostra] = useState(v)
  const atual = useRef(v)
  useEffect(() => {
    if (reduz) return
    const c = animate(atual.current, v, { duration: 0.45, ease: 'easeOut', onUpdate: (x) => { atual.current = x; setMostra(x) } })
    return () => c.stop()
  }, [v, reduz])
  return <span className={className}>{brl.format(Math.round(reduz ? v : mostra))}</span>
}

function Faixa({ min, max, passo, valor, onChange, rotulo }: { min: number; max: number; passo: number; valor: number; onChange: (n: number) => void; rotulo: string }) {
  const p = ((Math.min(Math.max(valor, min), max) - min) / (max - min)) * 100
  return (
    <input
      type="range"
      className="pz-faixa-range"
      min={min}
      max={max}
      step={passo}
      value={Math.min(Math.max(valor, min), max)}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={rotulo}
      style={{ ['--p' as string]: `${p}%` }}
    />
  )
}

export function Calculadora({ acao }: { acao: ReactNode }) {
  const [mensal, setMensal] = useState(20000)
  const [taxa, setTaxa] = useState(16)
  const [direto, setDireto] = useState(10)

  const comissaoAno = mensal * (taxa / 100) * 12
  const deixaAno = comissaoAno * (direto / 100)

  return (
    <div className="pz-calc">
      <div className="pz-calc__entradas">
        {/* Cabeçalho pedido pelo Leo (09/10): sem ele não ficava claro o que o
            quadro faz. Perguntas numeradas = o visitante sabe o que responder. */}
        <div className="pz-calc__cabeca">
          <span className="pz-calc__icone"><Calculator size={22} /></span>
          <div>
            <h3>Simule a sua economia</h3>
            <p>Responda 3 perguntas rápidas e veja quanto vai em comissão — e quanto poderia ficar com você.</p>
          </div>
        </div>

        <label className="pz-calc__campo">
          <span><i className="pz-calc__n">1</i> Quanto a pousada vende por mês pelas plataformas? <small>(média do mês, antes das comissões)</small></span>
          <span className="pz-calc__dinheiro">
            <b>R$</b>
            <input
              type="text"
              inputMode="numeric"
              value={milhar.format(mensal)}
              onChange={(e) => setMensal(Math.min(Number(e.target.value.replace(/\D/g, '') || 0), 5_000_000))}
              aria-label="Média mensal das reservas pelas plataformas, em reais"
            />
          </span>
          <Faixa min={2000} max={150000} passo={1000} valor={mensal} onChange={setMensal} rotulo="Ajustar a média mensal" />
        </label>

        <div className="pz-calc__campo">
          <span><i className="pz-calc__n">2</i> Por qual plataforma vende mais?</span>
          <div className="pz-calc__pilulas" role="radiogroup" aria-label="Plataforma principal">
            {PLATAFORMAS.map((pl) => (
              <button key={pl.id} type="button" role="radio" aria-checked={taxa === pl.taxa} className={taxa === pl.taxa ? 'is-on' : ''} onClick={() => setTaxa(pl.taxa)}>
                {pl.nome} <em>{pl.taxa}%</em>
              </button>
            ))}
          </div>
          <span className="pz-calc__outra">
            Comissão:
            <input
              type="number"
              min={1}
              max={40}
              value={taxa}
              onChange={(e) => setTaxa(Math.min(Math.max(Number(e.target.value) || 0, 0), 40))}
              aria-label="Comissão em porcentagem"
            />
            %
          </span>
        </div>

        <label className="pz-calc__campo">
          <span><i className="pz-calc__n">3</i> E se <b className="pz-calc__dest">{direto}%</b> desse valor viesse de reservas diretas?</span>
          <Faixa min={5} max={50} passo={5} valor={direto} onChange={setDireto} rotulo="Parte que viria direto" />
        </label>
      </div>

      <div className="pz-calc__saida">
        <div className="pz-calc__linha">
          <span>Comissão às plataformas em 12 meses</span>
          <Valor v={comissaoAno} className="pz-calc__pago" />
        </div>
        <div className="pz-calc__barra" aria-hidden>
          <motion.span layout style={{ width: `${direto}%` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} />
        </div>
        <div className="pz-calc__destaque">
          <span className="pz-calc__porco"><PiggyBank size={22} /></span>
          <div>
            <span>Comissão que você deixaria de pagar</span>
            <Valor v={deixaAno} className="pz-calc__ganho" />
            <small>em 12 meses, com {direto}% vindo direto</small>
          </div>
        </div>
        {acao}
        <p className="pz-calc__nota">
          <Info size={13} /> Cenário ilustrativo: projeta a média mensal para 12 meses. Não garante reservas e não desconta os custos da venda direta
          (como a taxa do cartão). Taxas de referência: Airbnb 16% no Brasil (Central de Ajuda do Airbnb); Booking 15%, ou 18% no programa preferencial
          desde jul/2026 (Panrotas).
        </p>
      </div>
    </div>
  )
}
