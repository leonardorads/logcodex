import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-service'

// Route Handlers não são cacheados em POST (Next 16) — escrita roda em request-time.

// ── Valores válidos (espelham os CHECK da migration 050, acentuação inclusa) ──
const Q_VEICULOS = ['1 a 5', '6 a 10', '11 a 50', 'Mais de 50'] as const
const Q_CONTROLE = ['Planilha ou caderno', 'Outro sistema', 'Não controlo direito'] as const
const Q_DOR = [
  'Não sei o lucro de cada viagem',
  'Acerto com motorista é confuso',
  'Não controlo custo e combustível',
  'Outra coisa',
] as const

type QVeiculos = (typeof Q_VEICULOS)[number]
type QControle = (typeof Q_CONTROLE)[number]
type Segmento = 'pequena_planilha' | 'pequena_sistema' | 'media_planilha' | 'media_sistema'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Helpers de resposta (padrão do projeto) ──
function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status })
}
function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status })
}

// ── Derivação do segmento (regra do onboarding 1.2) — sempre no servidor ──
function deriveSegmento(qVeiculos: QVeiculos, qControle: QControle): Segmento {
  const porte: 'pequena' | 'media' =
    qVeiculos === '1 a 5' || qVeiculos === '6 a 10' ? 'pequena' : 'media'
  const fonte: 'planilha' | 'sistema' =
    qControle === 'Outro sistema' ? 'sistema' : 'planilha'
  return `${porte}_${fonte}` as Segmento
}

// ── Anti-spam: Cloudflare Turnstile (ativo só se a env existir) ──
async function turnstileOk(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // sem chave provisionada → guard desligado (sinalizado ao DevOps)
  if (typeof token !== 'string' || !token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.append('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return err('VALIDATION_ERROR', 'Corpo da requisição inválido.', 422)
  }

  // ── Honeypot: campo oculto que humano nunca preenche. Se vier preenchido,
  //    é bot → finge sucesso (não revela a regra) e não grava nada. ──
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return ok({ status: 'ok' })
  }

  // ── Turnstile (se provisionado) ──
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  if (!(await turnstileOk(body.turnstile_token, ip))) {
    return err('VALIDATION_ERROR', 'Verificação de segurança falhou. Recarregue a página e tente de novo.', 422)
  }

  // ── Validação de contato ──
  const nome = typeof body.nome === 'string' ? body.nome.trim() : ''
  if (nome.length < 2) {
    return err('VALIDATION_ERROR', 'Informe seu nome para a gente saber como te chamar.', 422)
  }

  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : ''
  if (whatsapp.replace(/\D/g, '').length < 10) {
    return err('VALIDATION_ERROR', 'Informe um WhatsApp válido com DDD. É por onde a gente te chama.', 422)
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) {
    return err('VALIDATION_ERROR', 'Esse e-mail não parece válido. Confira e tente de novo.', 422)
  }

  // ── Validação das 3 respostas (devem estar entre os valores permitidos) ──
  const qVeiculos = body.q_veiculos
  if (typeof qVeiculos !== 'string' || !Q_VEICULOS.includes(qVeiculos as QVeiculos)) {
    return err('VALIDATION_ERROR', 'Selecione quantos veículos tem a sua frota.', 422)
  }
  const qControle = body.q_controle
  if (typeof qControle !== 'string' || !Q_CONTROLE.includes(qControle as QControle)) {
    return err('VALIDATION_ERROR', 'Selecione como você controla a frota hoje.', 422)
  }
  const qDor = body.q_dor
  if (typeof qDor !== 'string' || !Q_DOR.includes(qDor as (typeof Q_DOR)[number])) {
    return err('VALIDATION_ERROR', 'Selecione o que mais te incomoda hoje.', 422)
  }

  // ── Consentimento LGPD (obrigatório) ──
  if (body.consent !== true) {
    return err('VALIDATION_ERROR', 'Marque a caixa de consentimento para a gente poder entrar em contato.', 422)
  }

  // ── Campos opcionais (UTM + variant). Aceitar string, senão null. ──
  const optStr = (v: unknown): string | null =>
    typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, 255) : null

  const segmento = deriveSegmento(qVeiculos as QVeiculos, qControle as QControle)

  // consent_at e updated_at vêm do servidor (não confiar no client).
  // created_at é OMITIDO → no insert recebe DEFAULT NOW(); no conflito é preservado.
  const now = new Date().toISOString()
  const payload = {
    nome,
    whatsapp,
    email,
    q_veiculos: qVeiculos,
    q_controle: qControle,
    q_dor: qDor,
    segmento,
    utm_source: optStr(body.utm_source),
    utm_medium: optStr(body.utm_medium),
    utm_campaign: optStr(body.utm_campaign),
    utm_content: optStr(body.utm_content),
    utm_term: optStr(body.utm_term),
    variant: optStr(body.variant),
    consent_at: now,
    updated_at: now,
  }

  let supabase
  try {
    supabase = createSupabaseServiceClient()
  } catch {
    // Env de service role ausente (pendência do DevOps) — não vazar detalhe técnico.
    return err('INTERNAL_ERROR', 'Não conseguimos registrar sua vaga agora. Tente novamente em instantes.', 500)
  }

  // Upsert por email: dedupe preservando created_at original (ON CONFLICT não toca created_at).
  const { error } = await supabase
    .schema('marketing')
    .from('leads')
    .upsert(payload, { onConflict: 'email' })

  if (error) {
    return err('INTERNAL_ERROR', 'Não conseguimos registrar sua vaga agora. Verifique sua conexão e tente de novo.', 500)
  }

  // Retorna só o nome (para a tela de confirmação interpolar "Pronto, [Nome]!").
  return ok({ status: 'ok', nome })
}
