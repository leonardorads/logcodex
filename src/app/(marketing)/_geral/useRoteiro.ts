'use client'

import { createElement, useCallback, useEffect, useRef, useState } from 'react'

export type Marca = { em: number; p: number }

// Motor das demonstrações (mesa do topo, assistente do Fleet).
// - Começa quando a cena aparece na tela, roda UMA vez e para no resultado
//   (WCAG 2.2.2: nada se mexendo sem fim ao lado do texto); "Rever" toca de novo.
// - Com "reduzir movimento", vai direto ao quadro final: o resultado aparece
//   explicado, nada fica escondido.
// - `rodada` muda a cada execução: as peças com estado próprio (texto digitado,
//   contador) usam `key={rodada}` e recomeçam do zero, sem mostrar o quadro
//   final da rodada anterior por um instante.
export function useRoteiro(roteiro: Marca[], fim: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [rodada, setRodada] = useState(0)
  const timers = useRef<number[]>([])

  const limpar = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const tocar = useCallback(() => {
    limpar()
    setP(0)
    setRodada((r) => r + 1)
    for (const { em, p: passo } of roteiro) {
      timers.current.push(window.setTimeout(() => setP(passo), em + 60))
    }
  }, [roteiro])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setP(fim)
        else tocar()
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      limpar()
    }
  }, [fim, tocar])

  return { ref, p, rodada, rever: tocar }
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

// Número que conta até o valor quando `ativo` (ex.: 0 → 12 quando o painel aparece).
export function Contador({ alvo, ativo, duracao = 900 }: { alvo: number; ativo: boolean; duracao?: number }) {
  const [v, setV] = useState(0)
  const atual = useRef(0)
  useEffect(() => {
    if (!ativo) return
    const de = atual.current
    const inicio = performance.now()
    let raf = 0
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao)
      const val = Math.round(de + (alvo - de) * (1 - Math.pow(1 - t, 3)))
      atual.current = val
      setV(val)
      if (t < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [alvo, ativo, duracao])
  return createElement('b', null, v)
}
