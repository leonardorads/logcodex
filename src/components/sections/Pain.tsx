import {
  CalendarClock,
  DatabaseZap,
  MessageSquareWarning,
  MonitorX,
  Store,
  UserRoundCog,
  type LucideIcon,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const pains: { text: string; Icon: LucideIcon }[] = [
  { text: 'Mensagens importantes ficam sem resposta no horário em que o cliente decide', Icon: MessageSquareWarning },
  { text: 'Agendamento, confirmação e cobrança ainda dependem de trabalho manual', Icon: CalendarClock },
  { text: 'O site não transmite o mesmo cuidado que você entrega no atendimento', Icon: MonitorX },
  { text: 'Concorrentes parecem mais organizados porque têm presença digital mais clara', Icon: Store },
  { text: 'Informação importante vive na memória, no WhatsApp ou em uma planilha frágil', Icon: DatabaseZap },
  { text: 'A rotina depende demais de você para continuar funcionando', Icon: UserRoundCog },
]

export function Pain() {
  return (
    <section className="py-24 bg-base-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Scene */}
          <AnimatedSection>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-6">
              [ 01 ] O problema
            </p>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.1] tracking-[-0.028em] text-primary mb-6">
              São 22h.
              <br />
              Você acabou de fechar.
            </h2>
            <div className="space-y-4 text-[15px] text-secondary leading-[1.65] max-w-[48ch]">
              <p>
                No celular, 3 mensagens não respondidas — clientes pedindo horário.
                Você vai responder amanhã.
              </p>
              <p>
                Mas amanhã dois deles já marcaram em outro lugar.
              </p>
              <p className="text-primary font-medium">
                Você não perdeu por falta de dedicação.
                Você perdeu porque essa parte do negócio ainda depende de você olhando o celular.
              </p>
            </div>
          </AnimatedSection>

          {/* Pain bullets */}
          <AnimatedSection delay={0.12}>
            <p className="text-[14px] text-muted font-mono uppercase tracking-[0.1em] mb-5">
              Sinais de que a operação está pedindo estrutura:
            </p>
            <ul className="space-y-0 border-t border-white/[0.055]">
              {pains.map(({ text, Icon }, i) => (
                <li
                  key={text}
                  className="flex items-start gap-4 py-4 border-b border-white/[0.055]"
                >
                  <span className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] text-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={1.65} />
                  </span>
                  <span className="pt-[3px] text-[14.5px] text-secondary leading-[1.55]">
                    <span className="font-mono text-[10.5px] text-faint tracking-[0.04em] mr-2">
                      /{String(i + 1).padStart(2, '0')}
                    </span>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-muted font-medium">
              Não é falta de esforço. É falta de estrutura.
            </p>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
