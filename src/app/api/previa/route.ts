import { randomInt } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { CONSENT_TEXTO, CONSENT_VERSAO } from '@/lib/previa'

// Pedido de "prévia grátis" da /hospedagem (plano aprovado pelo Leo em 14/10/2026,
// projetos/hermes/docs/frentes/previa-gratis-formulario-plano.md).
// Grava em marketing.pedidos_previa (db/marketing/2026-10-14_pedidos_previa.sql) e
// devolve o código curto. Quem dá a partida é a mensagem que a pousada manda ao
// WhatsApp da LogCodex com "[ref: pedido-<código>]" — a Meta só abre a conversa
// quando o cliente escreve, por isso o site não manda nada sozinho.

const INTERNAL_ERROR_MSG = 'Não conseguimos registrar seu pedido agora. Tente de novo ou chame no WhatsApp.'

// Sem 0/o, 1/l/i: o código pode ser lido em voz alta ou digitado.
const ALFABETO = 'abcdefghjkmnpqrstuvwxyz23456789'
// Teto global por hora contra enxurrada (o Turnstile já barra a maior parte).
const TETO_POR_HORA = 60

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

function texto(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''
}

// Brasil: aceita com ou sem 55; guarda sempre com 55 (formato do wa.me e da fila).
function normalizaWhatsapp(v: unknown): string | null {
  const d = typeof v === 'string' ? v.replace(/\D/g, '') : ''
  if (d.length === 10 || d.length === 11) return `55${d}`
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) return d
  return null
}

// Link opcional: site, Instagram (@perfil ou endereço), Booking, Google…
// Só é guardado como texto para o Leo conferir; nada visita esse endereço sozinho.
function normalizaLink(v: unknown): string | null | 'invalido' {
  const s = texto(v, 500)
  if (!s) return null
  if (/^@[A-Za-z0-9._]{1,30}$/.test(s)) return s
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`)
    if (!['http:', 'https:'].includes(u.protocol) || !u.hostname.includes('.')) return 'invalido'
    return u.toString()
  } catch {
    return 'invalido'
  }
}

function novoCodigo(): string {
  let c = ''
  for (let i = 0; i < 6; i++) c += ALFABETO[randomInt(ALFABETO.length)]
  return c
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('VALIDATION_ERROR', 'Corpo da requisição inválido.', 422)
  }

  // Honeypot: humano não preenche. Finge sucesso sem gravar.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return ok({ codigo: novoCodigo() })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  if (!(await turnstileOk(body.turnstile_token, ip))) {
    return err('VALIDATION_ERROR', 'Verificação de segurança falhou. Recarregue a página e tente de novo.', 422)
  }

  const pousada = texto(body.pousada, 120)
  if (pousada.length < 2) return err('VALIDATION_ERROR', 'Informe o nome da sua pousada.', 422)

  const cidade = texto(body.cidade, 80)
  if (cidade.length < 2) return err('VALIDATION_ERROR', 'Informe a cidade e o estado da pousada.', 422)

  const whatsapp = normalizaWhatsapp(body.whatsapp)
  if (!whatsapp) return err('VALIDATION_ERROR', 'Informe um WhatsApp válido com DDD.', 422)

  const link = normalizaLink(body.link)
  if (link === 'invalido') {
    return err('VALIDATION_ERROR', 'Esse link não parece válido. Pode deixar em branco se preferir.', 422)
  }

  if (body.consent !== true) {
    return err('VALIDATION_ERROR', 'Marque a caixa para a gente poder te mandar a prévia pelo WhatsApp.', 422)
  }

  const optStr = (v: unknown): string | null => (texto(v, 255) || null)
  const sql = getDb()

  try {
    // Mesmo número nas últimas 24 h: devolve o pedido que já existe (clique duplo,
    // voltar e reenviar). Uma prévia ativa por contato.
    const existente = await sql<{ codigo: string }[]>`
      SELECT codigo FROM marketing.pedidos_previa
      WHERE whatsapp = ${whatsapp} AND status <> 'descartada' AND created_at > now() - interval '24 hours'
      ORDER BY created_at DESC LIMIT 1
    `
    if (existente[0]) return ok({ codigo: existente[0].codigo })

    const [{ n }] = await sql<{ n: number }[]>`
      SELECT count(*)::int AS n FROM marketing.pedidos_previa WHERE created_at > now() - interval '1 hour'
    `
    if (n >= TETO_POR_HORA) {
      return err('RATE_LIMIT', 'Recebemos muitos pedidos agora. Tente de novo em alguns minutos ou chame no WhatsApp.', 429)
    }

    const consentAt = new Date().toISOString()
    for (let tentativa = 0; tentativa < 4; tentativa++) {
      const codigo = novoCodigo()
      try {
        await sql`
          INSERT INTO marketing.pedidos_previa
            (codigo, pousada, cidade, whatsapp, link, consent_texto, consent_versao, consent_at,
             utm_source, utm_medium, utm_campaign)
          VALUES
            (${codigo}, ${pousada}, ${cidade}, ${whatsapp}, ${link}, ${CONSENT_TEXTO}, ${CONSENT_VERSAO}, ${consentAt},
             ${optStr(body.utm_source)}, ${optStr(body.utm_medium)}, ${optStr(body.utm_campaign)})
        `
        return ok({ codigo })
      } catch (e) {
        if ((e as { code?: string }).code !== '23505') throw e // só repete se o código já existia
      }
    }
    return err('INTERNAL_ERROR', INTERNAL_ERROR_MSG, 500)
  } catch (e) {
    console.error('[previa] pedido não gravado', { code: (e as { code?: string }).code })
    return err('INTERNAL_ERROR', INTERNAL_ERROR_MSG, 500)
  }
}
