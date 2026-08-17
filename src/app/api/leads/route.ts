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

// Origens da home (reposicionamento) não fazem as 3 perguntas de qualificação de
// frota — são específicas do funil antigo do /lancamento. Colunas q_* viraram
// nullable e origem/empresa/mensagem foram adicionadas nesta sessão (Fase 1).
const HOME_ORIGENS = ['home_diagnostico', 'home_agendamento', 'home_whatsapp'] as const
type HomeOrigem = (typeof HOME_ORIGENS)[number]

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

  // ── Origem do lead. Ausente/desconhecida = comportamento legado (/lancamento) ──
  const origem: HomeOrigem | 'lancamento' =
    typeof body.origem === 'string' && HOME_ORIGENS.includes(body.origem as HomeOrigem)
      ? (body.origem as HomeOrigem)
      : 'lancamento'
  const isHomeOrigem = origem !== 'lancamento'

  // ── Campos opcionais (UTM + variant). Aceitar string, senão null. ──
  const optStr = (v: unknown): string | null =>
    typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, 255) : null

  let qVeiculos: QVeiculos | null = null
  let qControle: QControle | null = null
  let qDor: (typeof Q_DOR)[number] | null = null
  let segmento: Segmento | null = null
  let empresa: string | null = null

  if (isHomeOrigem) {
    // A home não qualifica frota — só empresa (obrigatória) e mensagem livre.
    const empresaValue = typeof body.empresa === 'string' ? body.empresa.trim() : ''
    if (empresaValue.length < 2) {
      return err('VALIDATION_ERROR', 'Informe o nome da sua empresa.', 422)
    }
    empresa = empresaValue
  } else {
    // ── Validação das 3 respostas (devem estar entre os valores permitidos) ──
    const qv = body.q_veiculos
    if (typeof qv !== 'string' || !Q_VEICULOS.includes(qv as QVeiculos)) {
      return err('VALIDATION_ERROR', 'Selecione quantos veículos tem a sua frota.', 422)
    }
    const qc = body.q_controle
    if (typeof qc !== 'string' || !Q_CONTROLE.includes(qc as QControle)) {
      return err('VALIDATION_ERROR', 'Selecione como você controla a frota hoje.', 422)
    }
    const qd = body.q_dor
    if (typeof qd !== 'string' || !Q_DOR.includes(qd as (typeof Q_DOR)[number])) {
      return err('VALIDATION_ERROR', 'Selecione o que mais te incomoda hoje.', 422)
    }
    qVeiculos = qv as QVeiculos
    qControle = qc as QControle
    qDor = qd as (typeof Q_DOR)[number]
    segmento = deriveSegmento(qVeiculos, qControle)
  }

  // ── Consentimento LGPD (obrigatório) ──
  if (body.consent !== true) {
    return err('VALIDATION_ERROR', 'Marque a caixa de consentimento para a gente poder entrar em contato.', 422)
  }

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
  const mensagem = optStr(body.mensagem)

  try {
    const sql = getDb()
    const rows = await sql<{ nome: string }[]>`
      INSERT INTO marketing.leads
        (nome, whatsapp, email, q_veiculos, q_controle, q_dor, segmento,
         origem, empresa, mensagem,
         utm_source, utm_medium, utm_campaign, utm_content, utm_term, variant, consent_at)
      VALUES
        (${nome}, ${whatsapp}, ${email}, ${qVeiculos}, ${qControle}, ${qDor}, ${segmento},
         ${origem}, ${empresa}, ${mensagem},
         ${optStr(body.utm_source)}, ${optStr(body.utm_medium)}, ${optStr(body.utm_campaign)},
         ${optStr(body.utm_content)}, ${optStr(body.utm_term)}, ${optStr(body.variant)}, ${consentAt})
      ON CONFLICT (email) DO UPDATE SET
        nome         = EXCLUDED.nome,
        whatsapp     = EXCLUDED.whatsapp,
        q_veiculos   = COALESCE(EXCLUDED.q_veiculos, marketing.leads.q_veiculos),
        q_controle   = COALESCE(EXCLUDED.q_controle, marketing.leads.q_controle),
        q_dor        = COALESCE(EXCLUDED.q_dor, marketing.leads.q_dor),
        segmento     = COALESCE(EXCLUDED.segmento, marketing.leads.segmento),
        origem       = EXCLUDED.origem,
        empresa      = COALESCE(EXCLUDED.empresa, marketing.leads.empresa),
        mensagem     = COALESCE(EXCLUDED.mensagem, marketing.leads.mensagem),
        utm_source   = COALESCE(EXCLUDED.utm_source, marketing.leads.utm_source),
        utm_medium   = COALESCE(EXCLUDED.utm_medium, marketing.leads.utm_medium),
        utm_campaign = COALESCE(EXCLUDED.utm_campaign, marketing.leads.utm_campaign),
        utm_content  = COALESCE(EXCLUDED.utm_content, marketing.leads.utm_content),
        utm_term     = COALESCE(EXCLUDED.utm_term, marketing.leads.utm_term),
        variant      = COALESCE(EXCLUDED.variant, marketing.leads.variant),
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
