'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShaderBackground } from '../ShaderBackground'

// A palavra rotativa FECHA a frase: "Sua operação logística, automatizada."
// Antes ela caía no meio, entre a vírgula e um "resolvida ponta a ponta" fixo,
// e a leitura não fechava sentido ("logística, automatizada resolvida ponta a
// ponta"). O "ponta a ponta" migrou para o parágrafo, que não anima.
//
// Vocabulário de tecnologia e liberdade, não de "problema resolvido": cada
// termo é um particípio feminino (concorda com "operação") que fala do que a
// tecnologia FAZ pela operação, e o arco termina em "livre" — a promessa é o
// tempo que o dono da transportadora recupera.
//
// Uma palavra só, de propósito: a 92px qualquer frase maior quebra em 2 linhas
// e a caixa saltaria ~100px de altura a cada troca (verificado em 1920 e 390px).
const ROTATING_WORDS = [
  'automatizada.',
  'integrada.',
  'inteligente.',
  'autônoma.',
  'no automático.',
]

export function HomeHero({ onOpenContact }: { onOpenContact: (intent: 'agendar') => void }) {
  const [wordIndex, setWordIndex] = useState(0)
  const espelhoRef = useRef<HTMLSpanElement>(null)
  const rotRef = useRef<HTMLSpanElement>(null)
  const [altura, setAltura] = useState<number | undefined>(undefined)
  const [larguraRot, setLarguraRot] = useState<number | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // A altura vem de um espelho invisível com a MESMA tipografia: o elemento
  // visível está sempre no meio de uma transição do Framer, então medir ele
  // devolveria valores intermediários. useLayoutEffect para a caixa já nascer
  // no tamanho certo, sem um quadro de salto. Reage a resize porque a fonte é
  // clamp() — em outra largura a mesma frase ocupa outro número de linhas.
  useLayoutEffect(() => {
    const medir = () => {
      // A largura vem primeiro: o espelho só quebra linha igual ao visível se
      // já estiver na largura certa quando a altura for lida.
      const w = rotRef.current?.getBoundingClientRect().width
      if (w) setLarguraRot(w)
      const h = espelhoRef.current?.getBoundingClientRect().height
      if (h) setAltura(h)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [wordIndex, larguraRot])

  return (
    <>
      <style>{`
        /* .hero (marketing.css) traz padding-top:200px + justify-content:center
           pensados pro hero antigo, mais alto — sobrescrevemos os dois aqui pra
           puxar o conteúdo para logo abaixo do nav, sem o vão vazio. */
        .hero-section { padding-top: 0 !important; justify-content: flex-start !important; align-items: flex-start; }
        .hero-inner { padding: clamp(88px,11vh,110px) clamp(20px,5vw,40px) clamp(40px,5vh,60px); }

        /* Sem altura fixa: as frases variam de 1 a 2 linhas (de "sob controle."
           a "implantada por quem entende."). Reservar o pior caso deixava um
           vão enorme nas curtas; travar em 1 linha cortava as longas.
           A altura é medida por JS e animada, então a caixa acompanha. */
        .hero-rot { display: block; position: relative; overflow: hidden;
                    transition: height .38s cubic-bezier(.22,1,.36,1); }
        .hero-rot > span { display: block; }

        /* Mesma tipografia e mesma largura do h1 — é o que garante que a
           frase quebre no mesmo ponto e a medida valha. position:absolute
           tira do fluxo (não empurra nada); visibility:hidden mantém ele
           mensurável, ao contrário de display:none. */
        .hero-rot-espelho {
          position: absolute; left: 0; top: 0;
          visibility: hidden; pointer-events: none;
          font-size: clamp(36px, 7vw, 80px); font-weight: 800;
          letter-spacing: -.03em; line-height: 1.05;
        }

        @media (max-width: 640px) {
          .hero-inner { padding: 88px 20px 32px; }
          .hero-ctas { gap: 8px; margin-bottom: 20px !important; }
          .hero-ctas a { padding: 11px 20px !important; font-size: 14px !important; }
          .hero-badges { gap: 16px; margin-top: 20px !important; }
        }
      `}</style>
      <section className="hero hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex' }}>
        <ShaderBackground />

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,13,15,0.68) 0%, rgba(12,13,15,0.50) 50%, rgba(12,13,15,0.88) 100%)', zIndex: 1 }} />

        <div className="hero-inner" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
            LogCodex · Transformação operacional para logística
          </motion.div>

          {/* position:relative ancora o .hero-rot-espelho (absolute) nesta
              caixa, para ele herdar a MESMA largura do h1 e quebrar linha no
              mesmo ponto. Sem isso ele ancoraria no body. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            style={{ position: 'relative', fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: '16px', color: '#fff' }}
          >
            Sua operação logística,{' '}
            {/* Bloco próprio, ocupando a linha inteira: os termos têm larguras
                muito diferentes ("sob controle." x "implantada por quem
                entende.") e, em linha, empurrariam o texto fixo a cada troca.
                A altura vem medida do espelho e é animada — ver .hero-rot. */}
            <span ref={rotRef} className="hero-rot" style={{ height: altura }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: -60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', color: 'transparent', backgroundImage: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Espelho de medição — FORA do h1 de propósito: dentro dele, o
              texto entrava no textContent e o Google lia o título duplicado
              ("...já existe.diagnosticada de verdade."). aria-hidden cobre o
              leitor de tela; ficar fora do h1 cobre o buscador.
              A largura vem do .hero-rot (medida abaixo) e não de um pai
              posicionado: ancorar no h1 não funciona porque o Framer reescreve
              o transform dele, e o espelho acabava herdando os 780px do
              .hero-inner em vez dos 700px reais do h1. */}
          <span
            ref={espelhoRef}
            aria-hidden
            className="hero-rot-espelho"
            style={{ width: larguraRot }}
          >
            {ROTATING_WORDS[wordIndex]}
          </span>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 28px' }}
          >
            Ponta a ponta: a LogCodex entende sua operação, desenha a solução certa, integra com o que você já usa e implanta tudo — do diagnóstico ao time treinado. Sem travar a operação, sem jogar a complexidade no seu colo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="hero-ctas"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onOpenContact('agendar') }}
              style={{ padding: '13px 28px', borderRadius: '10px', background: '#fff', color: '#0c0d0f', fontSize: '15px', fontWeight: 700, textDecoration: 'none', transition: 'transform .15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >Falar com especialista</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-badges"
            style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '28px' }}
          >
            {[
              { label: 'Diagnóstico completo', sub: 'Antes de qualquer proposta' },
              { label: 'Implantação assistida', sub: 'A gente assume a parte pesada' },
              { label: 'Integração com o que já existe', sub: 'Sem recomeçar do zero' },
              { label: 'Suporte técnico consultivo', sub: 'Depois que o sistema entra no ar' },
            ].map(({ label, sub }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
