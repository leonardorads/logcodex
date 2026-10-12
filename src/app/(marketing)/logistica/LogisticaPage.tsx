'use client'

import { useEffect, useState } from 'react'
import { ContactModalHome, type ContactIntent } from '../contato/ContactModalHome'
import { HomeNav } from './secoes/HomeNav'
import { HomeHero } from './secoes/HomeHero'
import { SecDiagnostico } from './secoes/SecDiagnostico'
import { SecComoEntregamos } from './secoes/SecComoEntregamos'
import { SecIntegracoes } from './secoes/SecIntegracoes'
import { SecIncluso } from './secoes/SecIncluso'
import { SecObjecoes } from './secoes/SecObjecoes'
import { SecCapacidades } from './secoes/SecCapacidades'
import { SecMarquee } from './secoes/SecMarquee'
import { HOME_MARQUEE_ROW_A, HOME_MARQUEE_ROW_B } from './secoes/marquee-data'
import { SecFaq } from './secoes/SecFaq'
import { SecCloser } from './secoes/SecCloser'
import { HomeFooter } from './secoes/HomeFooter'

export function LogisticaPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [intent, setIntent] = useState<ContactIntent>(null)

  const openModal = (nextIntent: ContactIntent) => {
    setIntent(nextIntent)
    setModalOpen(true)
  }

  // Seletor comum a todas as variantes de reveal (.reveal, .reveal-zoom,
  // .reveal-left, .reveal-right, .reveal-fade) — cada seção escolhe a que
  // combina com seu conteúdo, para o scroll não repetir sempre o mesmo
  // movimento de seção em seção.
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '-60px', threshold: 0.05 }
    )
    document.querySelectorAll('.lcx-root [class*="reveal"]').forEach((el) => io.observe(el))
    const t = setTimeout(
      () => document.querySelectorAll('.lcx-root [class*="reveal"]').forEach((el) => el.classList.add('in')),
      1200
    )

    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="lcx-root">
      <style>{`
        .lcx-root .reveal { opacity: 0; transform: translateY(20px); transition: opacity 1s var(--ease), transform 1s var(--ease); }
        .lcx-root .reveal.in { opacity: 1; transform: none; }

        .lcx-root .reveal-fade { opacity: 0; transition: opacity 1.1s var(--ease); }
        .lcx-root .reveal-fade.in { opacity: 1; }

        .lcx-root .reveal-zoom { opacity: 0; transform: scale(.94); transition: opacity .9s var(--ease), transform .9s var(--ease); }
        .lcx-root .reveal-zoom.in { opacity: 1; transform: none; }

        .lcx-root .reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity .9s var(--ease), transform .9s var(--ease); }
        .lcx-root .reveal-left.in { opacity: 1; transform: none; }

        .lcx-root .reveal-right { opacity: 0; transform: translateX(28px); transition: opacity .9s var(--ease), transform .9s var(--ease); }
        .lcx-root .reveal-right.in { opacity: 1; transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .lcx-root .reveal, .lcx-root .reveal-fade, .lcx-root .reveal-zoom,
          .lcx-root .reveal-left, .lcx-root .reveal-right {
            opacity: 1; transform: none; transition: none;
          }
        }
      `}</style>
      <ContactModalHome open={modalOpen} onClose={() => setModalOpen(false)} intent={intent} />

      <HomeNav onOpenContact={openModal} />
      <HomeHero onOpenContact={openModal} />
      <SecDiagnostico />
      <SecComoEntregamos />
      <SecIntegracoes />
      <SecIncluso onOpenContact={openModal} />
      <SecObjecoes />
      <SecCapacidades />
      <SecMarquee
        eyebrow="Capacidades · em síntese"
        title="Tudo o que a LogCodex"
        titleEm="coloca pra rodar por você."
        rowA={HOME_MARQUEE_ROW_A}
        rowB={HOME_MARQUEE_ROW_B}
      />
      <SecFaq />
      <SecCloser onOpenContact={openModal} />
      <HomeFooter />
    </div>
  )
}
