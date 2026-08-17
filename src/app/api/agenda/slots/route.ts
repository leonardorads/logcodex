import { NextResponse } from 'next/server'
import { gerarSlots } from '@/lib/agenda-slots'
import { isCalendarEnabled, queryFreeBusy } from '@/lib/gcal'

// GET não é cacheado por padrão nas Route Handlers do Next 16, mas `force-dynamic`
// torna a intenção explícita: a grade depende de `Date.now()` e da agenda em
// tempo real, nunca pode servir uma resposta congelada do build.
export const dynamic = 'force-dynamic'

function ok(data: unknown) {
  return NextResponse.json({ data })
}

export async function GET() {
  const slots = gerarSlots()

  if (!isCalendarEnabled() || slots.length === 0) {
    return ok({
      slots: slots.map((s) => ({ ...s, ocupado: false })),
      calendarEnabled: false,
    })
  }

  try {
    const timeMin = slots[0].inicio
    const timeMax = slots[slots.length - 1].fim
    const { busy } = await queryFreeBusy(timeMin, timeMax)

    const busyRanges = busy.map((b) => ({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() }))

    const slotsComOcupacao = slots.map((s) => {
      const inicio = new Date(s.inicio).getTime()
      const fim = new Date(s.fim).getTime()
      const ocupado = busyRanges.some((b) => inicio < b.end && fim > b.start)
      return { ...s, ocupado }
    })

    return ok({ slots: slotsComOcupacao, calendarEnabled: true })
  } catch {
    // Google indisponível (timeout, quota, 403) → degradação suave: grade
    // completa sem marcação de ocupado, mas sinalizando que a integração
    // não está confirmando em tempo real. Nunca 500 aqui.
    return ok({
      slots: slots.map((s) => ({ ...s, ocupado: false })),
      calendarEnabled: false,
    })
  }
}
