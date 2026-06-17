import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com SERVICE ROLE — apenas para uso server-side (Route Handlers).
 *
 * A tabela `marketing.leads` tem RLS habilitada SEM policies + REVOKE de
 * anon/authenticated (migration 050). Só a service role bypassa a RLS, então
 * a captura de leads obrigatoriamente passa por este client.
 *
 * SUPABASE_SERVICE_ROLE_KEY NÃO tem prefixo NEXT_PUBLIC_ → fica restrita ao
 * ambiente Node.js e nunca é enviada ao browser. Nunca importar este módulo
 * em código de cliente.
 */
export function createSupabaseServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase service client indisponível: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
