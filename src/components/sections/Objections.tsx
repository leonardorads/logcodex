import { AnimatedSection } from '@/components/ui/AnimatedSection'

const objections = [
  {
    question: '"Mas é caro pra mim agora..."',
    answer:
      'Por isso a proposta só vem depois do diagnóstico. Primeiro entendemos o que realmente precisa ser construído, o que pode ser simplificado e qual entrega tende a gerar retorno operacional mais rápido.',
  },
  {
    question: '"Mas eu não entendo nada de tecnologia..."',
    answer:
      'Ótimo — você não precisa. O Método Diagnóstico Primeiro existe exatamente pra isso: a gente entende o seu negócio e entrega a tecnologia pronta, configurada e explicada em português. Você fala de operação — a gente resolve o resto.',
  },
  {
    question: '"Já tentei uma vez e não funcionou..."',
    answer:
      'Sabemos que isso é comum. A maioria das soluções foi construída antes de entender o negócio — e aí não funciona. Com o Método Diagnóstico Primeiro, o diagnóstico vem antes de qualquer código. O que entregamos foi feito pra funcionar na sua realidade.',
  },
  {
    question: '"Não sei se preciso disso agora..."',
    answer:
      'Se você ainda confirma consulta na mão, perde lead porque não viu mensagem a tempo, ou não tem site — você já precisa. A diferença entre ter e não ter fica mais cara a cada mês que passa.',
  },
  {
    question: '"E se você sumir? Fico preso?"',
    answer:
      'Tudo que construímos é entregue com acesso total pra você — arquivos, plataformas, configurações. É seu, não nosso. Se quiser levar pra outro profissional no futuro, pode. Sem contrato de fidelidade, sem cláusula escondida.',
  },
]

export function Objections() {
  return (
    <section className="py-24 bg-base-2">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mb-14">
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-4">
              [ 05 ] Dúvidas comuns
            </p>
            <h2 className="text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary max-w-[20ch]">
              Entendemos as dúvidas.
              <br />
              <span className="text-muted font-normal">Aqui estão as respostas.</span>
            </h2>
          </AnimatedSection>
        </div>

        {/* Objection list */}
        <div className="border-t border-white/[0.055]">
          {objections.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.06}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-white/[0.055] items-start">
                <h3 className="text-[16px] font-medium tracking-[-0.015em] text-primary">
                  {item.question}
                </h3>
                <p className="text-[14.5px] text-secondary leading-[1.65]">
                  {item.answer}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  )
}
