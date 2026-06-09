'use client'

import { FormEvent, useMemo, useState } from 'react'
import { ArrowRight, Check, Send } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { services } from '@/lib/data/services'
import { WHATSAPP_NUMBER } from '@/lib/contact'

const requestOptions = [
  ...services.map((service) => service.title),
  'Ainda não sei, preciso de diagnóstico',
]

const requestBenefits = [
  'Você escolhe o tipo de projeto mais próximo da sua necessidade.',
  'A equipe entende o contexto antes de responder.',
  'A proposta vem depois do escopo, sem preço genérico na página.',
]

export function Pricing() {
  const [selectedService, setSelectedService] = useState(requestOptions[0])
  const [context, setContext] = useState('')

  const whatsappHref = useMemo(() => {
    const message = [
      'Olá! Gostaria de solicitar uma proposta pela LogCodex.',
      '',
      `Tipo de trabalho: ${selectedService}`,
      context.trim() ? `Contexto: ${context.trim()}` : 'Contexto: ainda vou explicar na conversa.',
    ].join('\n')

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }, [context, selectedService])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.open(whatsappHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="solicitar" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 06 ] Solicitação rápida
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[20ch] mb-6">
              Conte o que você precisa.
              <br />
              <span className="text-muted font-normal">A proposta vem depois do escopo.</span>
            </h2>
            <p className="text-[16px] text-secondary leading-[1.6] max-w-[50ch] mb-8">
              Removemos os pacotes fechados da página porque projetos de operação precisam de
              contexto. Escolha o trabalho mais próximo da sua necessidade e envie a solicitação.
            </p>

            <div className="space-y-3">
              {requestBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" strokeWidth={1.8} />
                  <p className="text-[14px] text-secondary leading-[1.55]">{benefit}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.07] bg-surface p-6 sm:p-8 op-panel"
            >
              <div className="grid grid-cols-1 gap-5">
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted mb-2 block">
                    Tipo de trabalho
                  </span>
                  <select
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-base px-4 py-3 text-[14px] text-primary outline-none transition-colors focus:border-accent/60"
                  >
                    {requestOptions.map((option) => (
                      <option key={option} value={option} className="bg-base text-primary">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted mb-2 block">
                    Contexto rápido
                  </span>
                  <textarea
                    value={context}
                    onChange={(event) => setContext(event.target.value)}
                    rows={5}
                    placeholder="Ex: preciso organizar agenda, responder leads mais rápido e medir de onde vêm os contatos."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-base px-4 py-3 text-[14px] text-primary placeholder:text-muted/70 outline-none transition-colors focus:border-accent/60"
                  />
                </label>

                <button
                  type="submit"
                  className="btn-shimmer inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f4f4f5] px-5 text-[14px] font-medium text-[#08080a] transition-all duration-200 hover:bg-white"
                >
                  <Send className="w-4 h-4" strokeWidth={1.8} />
                  Solicitar proposta
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <p className="text-center text-[12.5px] text-muted">
                  Você será direcionado para o WhatsApp com a mensagem pronta.
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
