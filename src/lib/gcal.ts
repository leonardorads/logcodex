import { createSign } from 'node:crypto'

/**
 * Cliente mínimo do Google Calendar via fetch + JWT (Service Account),
 * sem a dependência `googleapis` (dezenas de MB, custa no cold start
 * serverless para só 2 endpoints: freebusy e events.insert).
 *
 * Server-only. Nunca importar no cliente.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/calendar'

let cachedToken: { accessToken: string; expiresAt: number } | null = null

export function isCalendarEnabled(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  )
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function signJwt(): string {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
  // Chave guardada com \n literais no ambiente — precisa virar quebra de linha real,
  // senão o crypto falha com "error:1E08010C:DECODER routines::unsupported".
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  const signature = base64url(signer.sign(privateKey))

  return `${unsigned}.${signature}`
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken
  }

  const assertion = signJwt()
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!res.ok) {
    throw new Error(`gcal: falha ao obter access token (${res.status})`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { accessToken: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 }
  return json.access_token
}

interface FreeBusyResult {
  /** Lista de intervalos ocupados [inicio, fim] em ISO */
  busy: { start: string; end: string }[]
}

/** Consulta os intervalos ocupados da agenda entre `timeMin` e `timeMax` (ISO com offset). */
export async function queryFreeBusy(timeMin: string, timeMax: string): Promise<FreeBusyResult> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!
  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'America/Sao_Paulo'
  const accessToken = await getAccessToken()

  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone,
      items: [{ id: calendarId }],
    }),
  })

  if (!res.ok) {
    throw new Error(`gcal: freebusy falhou (${res.status})`)
  }

  const json = await res.json()
  const busy = json.calendars?.[calendarId]?.busy ?? []
  return { busy }
}

export interface InsertEventInput {
  summary: string
  description: string
  startIso: string
  endIso: string
  attendeeEmail: string
  attendeeName: string
}

export interface InsertEventResult {
  eventId: string
}

/**
 * Cria o evento na agenda. Sem domain-wide delegation, o e-mail de convite ao
 * participante pode não chegar de forma confiável — mitigado pela confirmação
 * na tela e pela descrição do evento carregar os dados de contato.
 */
export async function insertEvent(input: InsertEventInput): Promise<InsertEventResult> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!
  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'America/Sao_Paulo'
  const accessToken = await getAccessToken()

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startIso, timeZone },
        end: { dateTime: input.endIso, timeZone },
        attendees: [{ email: input.attendeeEmail, displayName: input.attendeeName }],
      }),
    }
  )

  if (!res.ok) {
    const status = res.status
    const isDeterministic = status === 400 || status === 401 || status === 403
    const error = new Error(`gcal: insertEvent falhou (${status})`) as Error & { deterministic?: boolean }
    error.deterministic = isDeterministic
    throw error
  }

  const json = (await res.json()) as { id: string }
  return { eventId: json.id }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!
  const accessToken = await getAccessToken()

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
}
