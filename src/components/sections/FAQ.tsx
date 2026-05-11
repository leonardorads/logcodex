'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const faqs = [
  {
    question: 'Quanto tempo leva pra entregar?',
    answer:
      'Projetos simples costumam levar até 2 semanas. Projetos com automação, integrações e ajustes de fluxo costumam levar até 3 semanas. Antes de começar, você recebe escopo, etapas e prazo combinados por escrito.',
  },
  {
    question: 'O que é o Método Diagnóstico Primeiro?',
    answer:
      'É como evitamos tecnologia desnecessária. Antes de construir, entendemos atendimento, agenda, captação, rotina manual e gargalos. Só depois definimos se o próximo passo é site, automação, sistema interno ou apenas simplificação de processo.',
  },
  {
    question: 'Preciso entender de tecnologia pra contratar?',
    answer:
      'Não. Você precisa explicar como o negócio funciona, onde perde tempo e quais problemas se repetem. A parte técnica fica com a LogCodex, mas as decisões importantes são traduzidas em linguagem de operação.',
  },
  {
    question: 'Como funciona a garantia?',
    answer:
      'Depois da entrega, acompanhamos os primeiros 30 dias de uso. Se algo do escopo combinado não funcionar como deveria, corrigimos. Se a solução não cumprir o que foi acordado, devolvemos o valor.',
  },
  {
    question: 'Como funciona o processo passo a passo?',
    answer:
      '1. Você chama no WhatsApp · 2. Fazemos uma leitura inicial da operação · 3. Definimos prioridade, escopo e prazo · 4. Você aprova antes de qualquer cobrança · 5. Construímos, entregamos e ajustamos com base no uso real.',
  },
  {
    question: 'Vou ficar dependente de vocês depois da entrega?',
    answer:
      'Não é esse o modelo. O que for criado para o seu negócio fica documentado e acessível. Quando fizer sentido, você pode seguir com suporte mensal; quando não fizer, recebe o que precisa para operar sem contrato de fidelidade.',
  },
  {
    question: 'Vocês aceitam qualquer tipo de projeto?',
    answer:
      'Não. A LogCodex funciona melhor para negócios com atendimento recorrente, agenda, captação de leads, operação manual ou necessidade clara de presença digital. Se o diagnóstico mostrar que não faz sentido construir agora, falamos isso.',
  },
  {
    question: 'Quais formas de pagamento?',
    answer: 'Pix, cartão de crédito ou boleto bancário. O formato depende do escopo aprovado e é combinado antes do início.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/[0.055] last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="text-[15px] font-medium tracking-[-0.012em] text-primary group-hover:text-white transition-colors duration-150">
          {question}
        </span>
        <span className="shrink-0 text-muted group-hover:text-secondary transition-colors duration-150">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <p className="text-[14.5px] text-secondary leading-[1.65] pb-5 max-w-[64ch]">
          {answer}
        </p>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <section className="py-24 bg-base-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20 items-start">

          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 08 ] Perguntas frequentes
            </p>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary">
              Antes de decidir,
              <br />
              vale saber.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="border-t border-white/[0.055]">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
