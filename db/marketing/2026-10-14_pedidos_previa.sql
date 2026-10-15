-- marketing.pedidos_previa: pedidos de "prévia grátis" feitos pela /hospedagem.
-- Banco: Supabase de produção do site e do Fleet (aszyawanzldsvohkomov).
-- Plano aprovado pelo Leo em 14/10/2026 ("plano aprovado"):
--   projetos/hermes/docs/frentes/previa-gratis-formulario-plano.md (peças A e B).
-- Aplicado em 14/10/2026 ~23h30 (Claude, conexão direta do .env.local); conferido: 15 colunas, RLS ligado.
--
-- Por que uma tabela própria e não marketing.leads: o pedido não pede e-mail nem
-- nome da pessoa (formulário de 4 campos), e marketing.leads é chaveada por e-mail.
-- Sem fotos aqui: elas chegam pelo WhatsApp da LogCodex (v1).
--
-- Acesso: igual às outras tabelas do schema `marketing` — só o usuário postgres
-- (conexão direta do site). O schema não está exposto no PostgREST. RLS ligado e
-- sem política, como a marketing.leads, para negar por padrão se um dia for exposto.

BEGIN;

CREATE TABLE marketing.pedidos_previa (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- vai no WhatsApp como "[ref: pedido-<codigo>]"; minúsculo porque a fila só aceita [a-z0-9-]
  codigo         text NOT NULL UNIQUE CHECK (codigo ~ '^[a-z0-9]{6}$'),
  pousada        text NOT NULL CHECK (char_length(pousada) BETWEEN 2 AND 120),
  cidade         text NOT NULL CHECK (char_length(cidade) BETWEEN 2 AND 80),
  whatsapp       text NOT NULL CHECK (whatsapp ~ '^[0-9]{10,13}$'),
  link           text CHECK (link IS NULL OR char_length(link) <= 500),
  -- texto exato da caixa marcada + versão (LGPD e regra da Meta: registrar o que foi aceito)
  consent_texto  text NOT NULL,
  consent_versao text NOT NULL,
  consent_at     timestamptz NOT NULL,
  status         text NOT NULL DEFAULT 'aguardando_contato' CHECK (status IN (
                   'aguardando_contato', -- preencheu, ainda não mandou a mensagem
                   'em_conversa',        -- mandou a mensagem; Lia pedindo as fotos
                   'material',           -- fotos chegaram; esperando o Leo tocar em Montar
                   'montando',
                   'enviada',
                   'descartada',
                   'teste')),
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pedidos_previa_whatsapp_idx ON marketing.pedidos_previa (whatsapp, created_at DESC);
CREATE INDEX pedidos_previa_status_idx ON marketing.pedidos_previa (status, created_at DESC);

ALTER TABLE marketing.pedidos_previa ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Volta atrás (só se a tabela estiver vazia ou o conteúdo já tiver sido copiado):
-- DROP TABLE marketing.pedidos_previa;
