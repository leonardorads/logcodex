import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Route Handlers não são cacheados em POST (Next 16) — escrita roda em request-time.

// Mensagem única de erro interno (env ausente OU falha de banco). Texto oficial do
// contrato api-leads-1.6.md: orienta uma ação ao usuário, sem vazar detalhe técnico.
const INTERNAL_ERROR_MSG =
  'Não conseguimos registrar sua vaga agora. Verifique sua conexão e tente de novo.'

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

  // consent_at vem do servidor (não confiar no client, exigência LGPD).
  // created_at e updated_at são OMITIDOS do INSERT → recebem DEFAULT NOW();
  // no conflito, created_at é preservado e updated_at é atualizado pelo
  // trigger trg_marketing_leads_updated_at (migration 050) — não duplicamos a lógica.
  const consentAt = new Date().toISOString()

  // ── Acesso a dados: conexão Postgres DIRETA (BL-1 / Decisão 57) ──
  // O schema `marketing` é isolado e NÃO exposto no PostgREST; supabase-js
  // falharia com PGRST106. A conexão direta enxerga o schema preservando o
  // isolamento da API pública. Tagged template do postgres.js PARAMETRIZA tudo
  // (sem interpolação de string → sem risco de SQL injection).
  try {
    const sql = getDb()
    const rows = await sql<{ nome: string }[]>`
      INSERT INTO marketing.leads
        (nome, whatsapp, email, q_veiculos, q_controle, q_dor, segmento,
         utm_source, utm_medium, utm_campaign, utm_content, utm_term, variant, consent_at)
      VALUES
        (${nome}, ${whatsapp}, ${email}, ${qVeiculos}, ${qControle}, ${qDor}, ${segmento},
         ${optStr(body.utm_source)}, ${optStr(body.utm_medium)}, ${optStr(body.utm_campaign)},
         ${optStr(body.utm_content)}, ${optStr(body.utm_term)}, ${optStr(body.variant)}, ${consentAt})
      ON CONFLICT (email) DO UPDATE SET
        nome         = EXCLUDED.nome,
        whatsapp     = EXCLUDED.whatsapp,
        q_veiculos   = EXCLUDED.q_veiculos,
        q_controle   = EXCLUDED.q_controle,
        q_dor        = EXCLUDED.q_dor,
        segmento     = EXCLUDED.segmento,
        utm_source   = EXCLUDED.utm_source,
        utm_medium   = EXCLUDED.utm_medium,
        utm_campaign = EXCLUDED.utm_campaign,
        utm_content  = EXCLUDED.utm_content,
        utm_term     = EXCLUDED.utm_term,
        variant      = EXCLUDED.variant,
        consent_at   = EXCLUDED.consent_at
      RETURNING nome
    `
    // Retorna só o nome (para a tela de confirmação interpolar "Pronto, [Nome]!").
    const savedNome = rows[0]?.nome ?? nome
    return ok({ status: 'ok', nome: savedNome })
  } catch {
    // Env DATABASE_URL ausente OU falha do banco — mensagem única, sem detalhe técnico.
    return err('INTERNAL_ERROR', INTERNAL_ERROR_MSG, 500)
  }
}
