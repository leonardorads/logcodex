import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isSlotValido } from '@/lib/agenda-slots'
import { isCalendarEnabled, insertEvent } from '@/lib/gcal'

const INTERNAL_ERROR_MSG = 'Não conseguimos registrar seu horário agora. Verifique sua conexão e tente de novo.'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status })
}
function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status })
}

async function turnstileOk(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || !token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.append('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  // 1. Parse
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('VALIDATION_ERROR', 'Corpo da requisição inválido.', 422)
  }

  // 2. Honeypot
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return ok({ status: 'ok' })
  }

  // 3. Turnstile
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  if (!(await turnstileOk(body.turnstile_token, ip))) {
    return err('VALIDATION_ERROR', 'Verificação de segurança falhou. Recarregue a página e tente de novo.', 422)
  }

  // 4. Validação dos campos de contato
  const nome = typeof body.nome === 'string' ? body.nome.trim() : ''
  if (nome.length < 2) return err('VALIDATION_ERROR', 'Informe seu nome para a gente saber como te chamar.', 422)

  const empresa = typeof body.empresa === 'string' ? body.empresa.trim() : ''
  if (empresa.length < 2) return err('VALIDATION_ERROR', 'Informe o nome da sua empresa.', 422)

  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : ''
  if (whatsapp.replace(/\D/g, '').length < 10) {
    return err('VALIDATION_ERROR', 'Informe um WhatsApp válido com DDD. É por onde a gente te chama.', 422)
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) return err('VALIDATION_ERROR', 'Esse e-mail não parece válido. Confira e tente de novo.', 422)

  if (body.consent !== true) {
    return err('VALIDATION_ERROR', 'Marque a caixa de consentimento para a gente poder entrar em contato.', 422)
  }

  const mensagem = typeof body.mensagem === 'string' && body.mensagem.trim() !== '' ? body.mensagem.trim().slice(0, 2000) : null

  // 5. Revalidar o slot contra as janelas fixas — o cliente não é fonte de verdade
  const slotInicio = typeof body.slot_inicio === 'string' ? body.slot_inicio : ''
  const slotFim = typeof body.slot_fim === 'string' ? body.slot_fim : ''
  if (!isSlotValido(slotInicio, slotFim)) {
    return err('VALIDATION_ERROR', 'Esse horário não está mais disponível. Escolha outro na lista.', 422)
  }

  const consentAt = new Date().toISOString()
  const sql = getDb()

  // 6. Lock atômico — o UNIQUE(slot_inicio) resolve a corrida; freebusy do
  //    Google não serve de trava (responde "livre" pra dois pedidos simultâneos).
  let reservaId: string
  try {
    const rows = await sql<{ id: string }[]>`
      INSERT INTO marketing.agenda_reservas (slot_inicio, slot_fim, lead_email)
      VALUES (${slotInicio}, ${slotFim}, ${email})
      RETURNING id
    `
    reservaId = rows[0].id
  } catch (e) {
    const pgError = e as { code?: string }
    if (pgError.code === '23505') {
      return err('SLOT_TAKEN', 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro.', 409)
    }
    return err('INTERNAL_ERROR', INTERNAL_ERROR_MSG, 500)
  }

  // 7. Google Calendar (se ligado)
  let calendarEventId: string | null = null
  let calendarConfirmed = false

  if (isCalendarEnabled()) {
    try {
      const result = await insertEvent({
        summary: `Diagnóstico LogCodex — ${empresa}`,
        description: [
          `Nome: ${nome}`,
          `Empresa: ${empresa}`,
          `WhatsApp: ${whatsapp}`,
          `E-mail: ${email}`,
          mensagem ? `Mensagem: ${mensagem}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        startIso: slotInicio,
        endIso: slotFim,
        attendeeEmail: email,
        attendeeName: nome,
      })
      calendarEventId = result.eventId
      calendarConfirmed = true

      await sql`UPDATE marketing.agenda_reservas SET calendar_event_id = ${calendarEventId} WHERE id = ${reservaId}`
    } catch (e) {
      const gcalError = e as Error & { deterministic?: boolean }
      if (gcalError.deterministic) {
        // Falha determinística (credencial/payload) → libera o lock, segue como
        // se a integração estivesse desligada. Nenhuma reunião foi marcada de
        // verdade, então o horário deve voltar a ficar disponível.
        await sql`DELETE FROM marketing.agenda_reservas WHERE id = ${reservaId}`
        calendarEventId = null
        calendarConfirmed = false
      }
      // Falha ambígua (timeout/rede): mantém o lock — pode ter sido criado do
      // lado do Google e a resposta se perdeu. Falha de rede não autoriza
      // afirmar que não aconteceu. calendarEventId fica nulo, marcador de pendência.
    }
  }

  // 8. Lead em marketing.leads — mesmo COALESCE do /api/leads para não apagar dado
  try {
    await sql`
      INSERT INTO marketing.leads
        (nome, whatsapp, email, origem, empresa, mensagem, slot_inicio, slot_fim, calendar_event_id, consent_at)
      VALUES
        (${nome}, ${whatsapp}, ${email}, 'home_agendamento', ${empresa}, ${mensagem}, ${slotInicio}, ${slotFim}, ${calendarEventId}, ${consentAt})
      ON CONFLICT (email) DO UPDATE SET
        nome              = EXCLUDED.nome,
        whatsapp          = EXCLUDED.whatsapp,
        origem            = EXCLUDED.origem,
        empresa           = COALESCE(EXCLUDED.empresa, marketing.leads.empresa),
        mensagem          = COALESCE(EXCLUDED.mensagem, marketing.leads.mensagem),
        slot_inicio       = EXCLUDED.slot_inicio,
        slot_fim          = EXCLUDED.slot_fim,
        calendar_event_id = EXCLUDED.calendar_event_id,
        consent_at        = EXCLUDED.consent_at
    `
  } catch {
    // Lock e evento (se houver) já existem — a reunião ESTÁ marcada. Responde
    // sucesso e engole o erro do lead; ele é recuperável a partir da reserva.
  }

  // 9. Sucesso
  return ok({ status: 'ok', nome, calendarConfirmed })
}
