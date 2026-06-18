import postgres, { type Sql } from 'postgres'

/**
 * Conexão Postgres DIRETA com o banco do Supabase — server-only (Route Handlers).
 *
 * POR QUÊ (BL-1 / Decisão 57): a tabela `marketing.leads` vive no schema isolado
 * `marketing` (migration 050), que NÃO está nos "Exposed schemas" da API Supabase
 * — e expô-lo está vetado (3ª camada de isolamento, Decisões 44/47). Por isso o
 * acesso via `supabase-js`/PostgREST falha com `PGRST106 — Invalid schema: marketing`.
 * Uma conexão Postgres direta enxerga QUALQUER schema sem depender de exposição na
 * API pública, preservando o isolamento (o schema continua fora do PostgREST).
 *
 * DATABASE_URL é o pooler do Supabase (porta 6543, pgbouncer) — adequado a um
 * Route Handler serverless. NÃO tem prefixo NEXT_PUBLIC_ → fica restrita ao
 * ambiente Node.js e nunca vai ao browser. Nunca importar este módulo no cliente.
 *
 * Singleton de módulo: em serverless cada instância reaproveita o mesmo client
 * entre invocações (o módulo é avaliado uma vez por instância). Pool pequeno
 * (max: 1) porque o pgbouncer já multiplexa as conexões do lado do Supabase.
 */

// Reaproveita o client entre hot-reloads do `next dev` (evita vazar conexões).
const globalForDb = globalThis as unknown as { __leadsDb?: Sql }

export function getDb(): Sql {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'Conexão de banco indisponível: defina DATABASE_URL (pooler Postgres do Supabase).'
    )
  }

  if (globalForDb.__leadsDb) return globalForDb.__leadsDb

  const sql = postgres(connectionString, {
    max: 1, // pool pequeno: o pgbouncer do Supabase já multiplexa
    idle_timeout: 20, // encerra conexões ociosas (segundos) — adequado ao pooler serverless
    connect_timeout: 10,
    prepare: false, // obrigatório no transaction pooler (pgbouncer) do Supabase
  })

  globalForDb.__leadsDb = sql
  return sql
}
