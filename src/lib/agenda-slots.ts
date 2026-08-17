/**
 * Grade de horários fixos para agendamento — puro, sem I/O.
 *
 * seg–sex: 08:00–08:45 · 17:30–18:15 · 18:20–19:05
 * sábado:  09:00–10:00 · 10:00–11:00 · 11:00–12:00
 * domingo: nenhum
 *
 * Tudo em horário de Brasília. Nunca usar `new Date('...T08:00:00')` sem offset
 * (o Node em produção lê como UTC) nem `getHours()`/`getDay()` do servidor
 * (retornam UTC) — o offset de Brasília é derivado da própria data via `Intl`,
 * nunca hardcodado, porque o Brasil pode voltar a ter horário de verão.
 */

export interface Slot {
  /** ISO 8601 com offset explícito, ex: 2026-08-18T08:00:00-03:00 */
  inicio: string
  fim: string
  /** Rótulo pronto para exibir, formatado no servidor (evita hydration mismatch) */
  label: string
  diaLabel: string
}

const TZ = 'America/Sao_Paulo'
const WINDOW_DAYS = 14
const MIN_ANTECEDENCIA_MS = 2 * 60 * 60 * 1000

type Janela = { hora: number; minuto: number; duracaoMin: number }

// weekday: 0=domingo .. 6=sábado (derivado via Intl, nunca via Date.getDay())
const JANELAS_POR_DIA: Record<number, Janela[]> = {
  0: [],
  1: [
    { hora: 8, minuto: 0, duracaoMin: 45 },
    { hora: 17, minuto: 30, duracaoMin: 45 },
    { hora: 18, minuto: 20, duracaoMin: 45 },
  ],
  2: [
    { hora: 8, minuto: 0, duracaoMin: 45 },
    { hora: 17, minuto: 30, duracaoMin: 45 },
    { hora: 18, minuto: 20, duracaoMin: 45 },
  ],
  3: [
    { hora: 8, minuto: 0, duracaoMin: 45 },
    { hora: 17, minuto: 30, duracaoMin: 45 },
    { hora: 18, minuto: 20, duracaoMin: 45 },
  ],
  4: [
    { hora: 8, minuto: 0, duracaoMin: 45 },
    { hora: 17, minuto: 30, duracaoMin: 45 },
    { hora: 18, minuto: 20, duracaoMin: 45 },
  ],
  5: [
    { hora: 8, minuto: 0, duracaoMin: 45 },
    { hora: 17, minuto: 30, duracaoMin: 45 },
    { hora: 18, minuto: 20, duracaoMin: 45 },
  ],
  6: [
    { hora: 9, minuto: 0, duracaoMin: 60 },
    { hora: 10, minuto: 0, duracaoMin: 60 },
    { hora: 11, minuto: 0, duracaoMin: 60 },
  ],
}

/** Offset atual de Brasília (ex: "-03:00"), derivado da data — nunca hardcodado. */
function offsetEm(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    timeZoneName: 'longOffset',
  }).formatToParts(date)
  const gmt = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-03:00'
  // "GMT-03:00" -> "-03:00"
  return gmt.replace('GMT', '') || '-03:00'
}

/** Componentes de data (ano/mês/dia) e dia-da-semana de `date`, em Brasília. */
function partesEmBrasilia(date: Date): { ano: number; mes: number; dia: number; weekday: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    ano: Number(get('year')),
    mes: Number(get('month')),
    dia: Number(get('day')),
    weekday: weekdayMap[get('weekday')] ?? 0,
  }
}

/** Constrói o instante UTC correspondente a `hora:minuto` em Brasília, num dado ano/mês/dia civil. */
function instanteEmBrasilia(ano: number, mes: number, dia: number, hora: number, minuto: number): Date {
  const pad = (n: number) => String(n).padStart(2, '0')
  // Chute inicial assumindo -03:00, depois corrige comparando o weekday/hora resultante.
  const chuteIso = `${ano}-${pad(mes)}-${pad(dia)}T${pad(hora)}:${pad(minuto)}:00-03:00`
  const chute = new Date(chuteIso)
  const offset = offsetEm(chute)
  return new Date(`${ano}-${pad(mes)}-${pad(dia)}T${pad(hora)}:${pad(minuto)}:00${offset}`)
}

const DIA_LABEL_FMT = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'short', day: '2-digit', month: 'short' })
const HORA_LABEL_FMT = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })

/**
 * Gera a grade de slots para os próximos `WINDOW_DAYS` dias, a partir de `now`,
 * já descartando passado e exigindo antecedência mínima. Não sabe nada sobre
 * ocupação real do Google Calendar — isso é aplicado por cima em `/api/agenda/slots`.
 */
export function gerarSlots(now: Date = new Date()): Slot[] {
  const slots: Slot[] = []
  const minimo = new Date(now.getTime() + MIN_ANTECEDENCIA_MS)

  for (let d = 0; d < WINDOW_DAYS; d++) {
    const cursor = new Date(now.getTime() + d * 24 * 60 * 60 * 1000)
    const { ano, mes, dia, weekday } = partesEmBrasilia(cursor)
    const janelas = JANELAS_POR_DIA[weekday] ?? []

    for (const j of janelas) {
      const inicio = instanteEmBrasilia(ano, mes, dia, j.hora, j.minuto)
      if (inicio < minimo) continue
      const fim = new Date(inicio.getTime() + j.duracaoMin * 60 * 1000)

      slots.push({
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        label: HORA_LABEL_FMT.format(inicio),
        diaLabel: DIA_LABEL_FMT.format(inicio),
      })
    }
  }

  return slots
}

/** Revalida um slot arbitrário (payload de cliente) contra as janelas fixas — nunca confiar no client. */
export function isSlotValido(inicioIso: string, fimIso: string): boolean {
  const inicio = new Date(inicioIso)
  const fim = new Date(fimIso)
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return false

  const minimo = new Date(Date.now() + MIN_ANTECEDENCIA_MS)
  if (inicio < minimo) return false

  const { weekday } = partesEmBrasilia(inicio)
  const janelas = JANELAS_POR_DIA[weekday] ?? []
  return janelas.some((j) => {
    const esperadoInicio = instanteEmBrasilia(
      partesEmBrasilia(inicio).ano,
      partesEmBrasilia(inicio).mes,
      partesEmBrasilia(inicio).dia,
      j.hora,
      j.minuto
    )
    const esperadoFim = new Date(esperadoInicio.getTime() + j.duracaoMin * 60 * 1000)
    return inicio.getTime() === esperadoInicio.getTime() && fim.getTime() === esperadoFim.getTime()
  })
}

export const AGENDA_TIMEZONE = TZ
