'use client'

import { createElement, useCallback, useEffect, useRef, useState } from 'react'

export type Marca = { em: number; p: number }

// Motor das demonstrações (cena do topo, Fleet).
// - Roda em LOOPING (pedido do Leo, 12/10: "as animações precisam ficar num
//   looping, sem botão de rever"): ao fim do roteiro, recomeça do zero.
// - Só anda com a cena à vista e a aba aberta: saiu da tela, para; voltou,
//   recomeça do início (assim ninguém chega no meio da história).
// - Com "reduzir movimento", mostra direto o quadro `estatico` (o resultado
//   explicado) e não se mexe; nada fica escondido.
// - `rodada` muda a cada volta: as peças com estado próprio (texto digitado,
//   número que conta) usam `key={rodada}` e recomeçam limpas.
export function useCena(roteiro: Marca[], duracao: number, estatico: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [rodada, setRodada] = useState(0)
  const timers = useRef<number[]>([])
  const rodando = useRef(false)
  // a próxima volta chama a versão mais nova de `tocar` (ela não pode chamar a si mesma)
  const proxima = useRef<() => void>(() => {})

  const parar = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    rodando.current = false
  }, [])

  const tocar = useCallback(() => {
    parar()
    rodando.current = true
    setP(0)
    setRodada((r) => r + 1)
    for (const { em, p: passo } of roteiro) {
      timers.current.push(window.setTimeout(() => setP(passo), em + 60))
    }
    timers.current.push(window.setTimeout(() => proxima.current(), duracao))
  }, [roteiro, duracao, parar])

  useEffect(() => {
    proxima.current = tocar
  }, [tocar])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => setP(estatico), 0)
      return () => window.clearTimeout(t)
    }
    let visivel = false
    const decidir = () => {
      const deve = visivel && !document.hidden
      if (deve && !rodando.current) tocar()
      else if (!deve && rodando.current) parar()
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting
        decidir()
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    document.addEventListener('visibilitychange', decidir)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', decidir)
      parar()
    }
  }, [estatico, tocar, parar])

  return { ref, p, rodada }
}

// Texto que se "digita" enquanto `ativo`; com `cheio`, aparece inteiro.
export function TextoDigitado({ texto, ativo, cheio, passoMs = 55 }: { texto: string; ativo: boolean; cheio: boolean; passoMs?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!ativo) return
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setN(i)
      if (i >= texto.length) window.clearInterval(id)
    }, passoMs)
    return () => window.clearInterval(id)
  }, [ativo, texto, passoMs])
  return createElement('span', null, cheio ? texto : texto.slice(0, n))
}

// Número que nasce no valor certo e, quando o valor muda, conta até o novo
// (12 → 13) e dá um pulo. Use com `key={rodada}` para voltar ao início a cada volta.
export function Numero({ valor, duracao = 700, className = '' }: { valor: number; duracao?: number; className?: string }) {
  const [v, setV] = useState(valor)
  const atual = useRef(valor)
  const [pulo, setPulo] = useState(0)
  useEffect(() => {
    const de = atual.current
    if (de === valor) return
    const inicio = performance.now()
    let raf = 0
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao)
      const val = Math.round(de + (valor - de) * (1 - Math.pow(1 - t, 3)))
      atual.current = val
      setV(val)
      if (t < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    setPulo((x) => x + 1)
    return () => cancelAnimationFrame(raf)
  }, [valor, duracao])
  return createElement('b', { className: `${className} ${pulo ? 'hg-num--pulo' : ''}`, key: pulo }, v.toLocaleString('pt-BR'))
}
